export default class Monitor {
  constructor() {
    this.queue = []; // 数据队列
    this.batchSize = 10; // 批量上报阈值
    this.maxQueueLength = 100; // 队列最大长度限制
    this.batchDelay = 10000; // 定时上报间隔(ms)-10s
    this.timer = null; // 定时触发器
    this.isHomePage = this.checkIfHomePage(); // 判断是否为首页
    this.init();
  }
  // 检查当前是否为首页
  checkIfHomePage() {
    const currentPath = window.location.pathname;
    return currentPath === '/' || currentPath === '/home';
  }
  // 初始化监控
  init() {
    this.listenJsError();
    this.listenResourceError();
    this.listenPromiseError();
    // this.collectPerformance();
    // this.autoTrackBehavior();
    if (this.isHomePage) {
      this.collectPerformance();
      console.log('已启用首页性能监控');
    }
    // 页面卸载前确保数据全部上报
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }
  // JS错误监控
  listenJsError() {
    window.addEventListener('error', (event) => {
      if (event.error) {
        this.add({
          type: 'js_error',
          message: event.error.message,
          stack: event.error.stack,
          url: event.filename,
          line: event.lineno,
          column: event.colno
        });
      }
    });
  }
  // 资源加载错误监控
  listenResourceError() {
    window.addEventListener('error', (event) => {
      if (event.target instanceof HTMLElement) {
        this.add({
          type: 'resource_error',
          tag: event.target.tagName,
          url: event.target.src || event.target.href
        });
      }
    }, true);
  }
  // Promise加载出错
  listenPromiseError() {
    window.addEventListener('unhandledrejection', (event) => {
      const promiseError = {
        type: 'promise_error',
        reason: event.reason?.message || 'Unknown promise error',
        stack: event.reason?.stack || ''
      };
      this.add(promiseError);
      event.preventDefault(); // 阻止默认处理（避免控制台报错）
    })
  }
  // 性能数据采集
  collectPerformance() {
    // 1. 首次内容绘制 (FCP)
    this.observePerformance('first-contentful-paint', 'fcp');
    // 2. 最大内容绘制 (LCP)
    this.observePerformance('largest-contentful-paint', 'lcp');
    // 3. 交互到下一次绘制 (INP) - 最新的用户交互指标
    this.observePerformance('interactionId', 'inp', (entry) => {
      return entry.duration;
    });
    // 4. 累积布局偏移 (CLS)
    this.observeLayoutShift('cls');
    // 5. 页面加载阶段性能指标
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectLoadPerformanceMetrics();
      }, 1000);
    });
  }
  // 通用性能指标观察器
  observePerformance(entryType, metricName, valueProcessor) {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        let value = lastEntry.startTime;
        if (valueProcessor && typeof valueProcessor === 'function') {
          value = valueProcessor(lastEntry);
        }
        this.add({
          type: 'performance',
          metric: metricName,
          value: parseFloat(value.toFixed(2)),
          detail: lastEntry
        });
      }).observe({
        type: entryType,
        buffered: true
      });
    } catch (error) {
      console.warn(`无法监控${metricName}指标:`, error);
    }
  }
  // 布局偏移观察器（CLS需要特殊处理）
  observeLayoutShift(metricName) {
    try {
      let cumulativeLayoutShift = 0;
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          // 只计算不包含用户输入的布局偏移
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        });
        this.add({
          type: 'performance',
          metric: metricName,
          value: parseFloat(cumulativeLayoutShift.toFixed(4)),
          isFinal: false
        });
      }).observe({
        type: 'layout-shift',
        buffered: true
      });
      // 页面隐藏时记录最终的CLS值
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.add({
            type: 'performance',
            metric: metricName,
            value: parseFloat(cumulativeLayoutShift.toFixed(4)),
            isFinal: true
          });
        }
      });
    } catch (error) {
      console.warn(`无法监控${metricName}指标:`, error);
    }
  }
  // 收集页面加载性能指标
  collectLoadPerformanceMetrics() {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (!perfData) return;
    // 计算各阶段时间
    const metrics = [
      { metric: 'dnsTime', value: perfData.domainLookupEnd - perfData.domainLookupStart },
      { metric: 'tcpTime', value: perfData.connectEnd - perfData.connectStart },
      { metric: 'sslTime', value: perfData.secureConnectionStart ? (perfData.connectEnd - perfData.secureConnectionStart) : 0 },
      { metric: 'ttfb', value: perfData.responseStart - perfData.requestStart }, // 首字节时间
      { metric: 'responseTime', value: perfData.responseEnd - perfData.responseStart },
      { metric: 'domReadyTime', value: perfData.domContentLoadedEventEnd - perfData.navigationStart },
      { metric: 'loadTime', value: perfData.loadEventEnd - perfData.navigationStart },
      { metric: 'firstPaintTime', value: perfData.responseEnd - perfData.navigationStart }
    ];

    metrics.forEach(item => {
      this.add({
        type: 'performance',
        metric: item.metric,
        value: Math.max(0, parseFloat(item.value.toFixed(2))) // 确保值不为负
      });
    });
  }

  // 添加数据到队列
  add(data) {
    const reportData = {
      ...data,
      page: window.location.pathname,
      time: Date.now(),
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`
    };
    // 限制队列最大长度
    if (this.queue.length >= this.maxQueueLength) {
      this.queue.shift(); // 移除最早的数据
    }
    this.queue.push(reportData);
    // 达到阈值立即上报
    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      // 重置定时器，延迟上报
      this.resetTimer();
    }
  }

  // 重置定时上报器
  resetTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.flush();
    }, this.batchDelay);
  }

  // 执行批量上报
  flush() {
    if (this.queue.length === 0) return;
    // 复制队列并清空，避免上报过程中新增数据被重复处理
    const dataList = [...this.queue];
    this.queue = [];
    clearTimeout(this.timer);

    // 执行上报
    this.reportBatch(dataList)
      .catch(error => {
        console.error('批量上报失败', error);
        // 上报失败时将数据重新加入队列（后续重试）
        this.queue.unshift(...dataList);
      });
  }
  // 批量上报请求
  reportBatch(dataList) {
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob(
          [JSON.stringify({ list: dataList })],
          { type: 'application/json' }
        );

        // 优先使用sendBeacon（不阻塞页面）
        if (navigator.sendBeacon('/api/report/batch', blob)) {
          resolve();
        } else {
          // 降级使用fetch
          fetch('/api/report/batch', {
            method: 'POST',
            body: JSON.stringify({ list: dataList }),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true // 确保页面关闭时能发送
          }).then(res => {
            if (res.ok) resolve();
            else reject(new Error('上报接口返回异常'));
          }).catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}