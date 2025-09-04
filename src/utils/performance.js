export default class PerformanceMonitor {
  constructor() {
    this.reportData = {
      metrics: {
        FCP: null,
        LCP: [],
        CLS: [],
        INP: [],
        FID: null
      },
      //用户相关配置信息
      environment: {
        page: window.location.pathname,
        initTime: Date.now(),
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        navigationType: this.getNavigationType(),
        isCacheHit: this.checkCacheHit() // 是否命中缓存
      }
    };
    this.init();
  }

  // 初始化监控
  init() {
    this.collectPerformanceMetrics();
    // 页面生命周期关键节点上报
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        console.log('隐藏');
        this.report();
      }
    });
    window.addEventListener('beforeunload', () => {
      this.report();
    }, { capture: true });
  }

  // 获取导航类型（区分首次加载/刷新/回退）
  getNavigationType() {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      return navEntry ? navEntry.type : 'unknown';
    } catch (error) {
      console.warn('获取导航类型失败:', error);
      return 'unknown';
    }
  }

  // 检测是否命中缓存
  checkCacheHit() {
    const navType = this.getNavigationType();
    // 回退/前进或刷新通常会命中缓存
    return ['back_forward', 'reload'].includes(navType);
  }

  // 采集所有性能指标
  collectPerformanceMetrics() {
    // 首次内容绘制 (FCP)
    this.observeMetric('first-contentful-paint', 'FCP', (entry) => entry.startTime);
    // 最大内容绘制 (LCP)
    this.observeMetric('largest-contentful-paint', 'LCP', (entry) => entry.startTime);
    // 交互到下一次绘制 (INP)
    this.observeMetric('interaction', 'INP', (entry) => entry.duration);
    // 首次输入延迟 (FID)
    this.observeMetric('first-input', 'FID', (entry) => entry.processingStart - entry.startTime);
    // 累积布局偏移 (CLS)
    this.observeLayoutShift();
  }

  // 通用指标观察器
  observeMetric(entryType, metricName, valueProcessor) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const value = valueProcessor(lastEntry);

        // 构建指标记录（包含值和时间戳）
        const metricRecord = {
          value: parseFloat(value.toFixed(2)),
          timestamp: Date.now()
        };

        // 单次指标只记录一次，多次指标推入数组
        if (['FCP', 'FID'].includes(metricName)) {
          if (!this.reportData.metrics[metricName]) {
            this.reportData.metrics[metricName] = metricRecord;
          }
        } else {
          this.reportData.metrics[metricName].push(metricRecord);
        }
      });
      observer.observe({
        type: entryType,
        buffered: true
      });
    } catch (error) {
      console.warn(`监控${metricName}指标失败:`, error);
    }
  }

  // 布局偏移特殊处理（CLS）
  observeLayoutShift() {
    try {
      let cumulativeValue = 0;
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            cumulativeValue += entry.value;
            this.reportData.metrics.CLS.push({
              value: parseFloat(cumulativeValue.toFixed(4)),
              timestamp: Date.now()
            });
          }
        });
      }).observe({
        type: 'layout-shift',
        buffered: true
      });
    } catch (error) {
      console.warn('监控CLS指标失败:', error);
    }
  }

  // 数据上报方法
  report() {
    // 过滤无效数据
    const validData = {
      metrics: {},
      environment: this.reportData.environment
    };
    console.log('准备上报的原始数据:', this.reportData);
    // 处理指标数据
    Object.entries(this.reportData.metrics).forEach(([key, value]) => {
      if (value !== null && (value.length > 0 || key === 'FCP' || key === 'FID')) {
        validData.metrics[key] = value;
      }
    });

    // 使用sendBeacon确保页面卸载时能成功上报
    if (Object.keys(validData.metrics).length > 0) {
      console.log('性能数据上报:', validData);
      navigator.sendBeacon('/web/collect/performance', JSON.stringify(validData));
    }
  }
}