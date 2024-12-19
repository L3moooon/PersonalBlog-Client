import layoutIndex from '@/layout/layout-index.vue'
import HomeView from '@/view/home/home-index.vue'
import ArticlePage from '@/view/article/article-page.vue'
import NotFoundView from '@/view/notFound/not-found-index.vue'
import ProgramIndex from '@/view/tech/program/program-index.vue'
import NoteIndex from '@/view/tech/note/note-index.vue'
import GameIndex from '@/view/live/game/game-index.vue'
import ExprienceIndex from '@/view/live/exprience/exprience-index.vue'
import LogIndex from '@/view/log/log-index.vue'
import AboutmeIndex from '@/view/aboutme/aboutme-index.vue'
import MessageIndex from '@/view/message/message-index.vue'
import LinkIndex from '@/view/link/link-index.vue'


export const routes = [
  {
    path: '/',
    component: layoutIndex,
    redirect: '/home',
    meta: {
      title: '',
      icon: '',
      hidden: true
    },
    children: [
      {
        path: '/home',
        component: HomeView,
        meta: {
          title: '首页',
          icon: '#icon-home'
        }
      },
    ]
  },
  {
    path: '/tech',
    component: layoutIndex,
    redirect: '/program',
    meta: {
      title: '技术相关',
      icon: '#icon-banshou'
    },
    children: [
      {
        path: '/program',
        component: ProgramIndex,
        meta: {
          title: '程序设计',
          icon: '#icon-chengxuprogram1'
        }
      },
      {
        path: '/note',
        component: NoteIndex,
        meta: {
          title: '学习笔记',
          icon: '#icon-note'
        }
      },
    ]
  },
  {
    path: '/live',
    component: layoutIndex,
    redirect: '/game',
    meta: {
      title: '生活相关',
      icon: '#icon-icon'
    },
    children: [
      {
        path: '/game',
        component: GameIndex,
        meta: {
          title: '游戏攻略',
          icon: '#icon-game'
        }
      },
      {
        path: '/exprience',
        component: ExprienceIndex,
        meta: {
          title: '生活经历',
          icon: '#icon-daifasong'
        }
      },
    ]
  },
  {
    path: '/catagroy',
    component: layoutIndex,
    meta: {
      title: '',
      icon: '',
      hidden: true
    },
    children: [
      {
        path: '/log',
        component: LogIndex,
        meta: {
          title: '建站日志',
          icon: '#icon-rizhi'
        }
      },
    ]
  },
  {
    path: '/aboutme',
    component: AboutmeIndex,
    meta: {
      title: '关于我',
      icon: '#icon-aboutMe'
    }
  },
  {
    path: '/message',
    component: MessageIndex,
    meta: {
      title: '留言板',
      icon: '#icon-message'
    }
  },
  {
    path: '/link',
    component: LinkIndex,
    meta: {
      title: '友情链接',
      icon: '#icon-link1'
    }
  },
  {
    path: '/article',
    component: ArticlePage,
    meta: {
      title: '',
      icon: '',
      hidden: true,
      // transition: 'slide-fade'
    }
  },
  {
    path: '/404',
    component: NotFoundView,
    meta: {
      title: '',
      icon: '',
      hidden: true
    }
  }
]