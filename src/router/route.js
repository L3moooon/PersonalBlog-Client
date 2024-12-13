import layoutIndex from '@/layout/layout-index.vue'
import HomeView from '@/view/home/home-index.vue'
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
          icon: ''
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
      icon: ''
    },
    children: [
      {
        path: '/program',
        component: ProgramIndex,
        meta: {
          title: '程序设计',
          icon: ''
        }
      },
      {
        path: '/note',
        component: NoteIndex,
        meta: {
          title: '学习笔记',
          icon: ''
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
      icon: ''
    },
    children: [
      {
        path: '/game',
        component: GameIndex,
        meta: {
          title: '游戏攻略',
          icon: ''
        }
      },
      {
        path: '/exprience',
        component: ExprienceIndex,
        meta: {
          title: '生活经历',
          icon: ''
        }
      },
    ]
  },
  {
    path: '/log',
    component: LogIndex,
    meta: {
      title: '建站日志',
      icon: ''
    }
  },
  {
    path: '/aboutme',
    component: AboutmeIndex,
    meta: {
      title: '关于我',
      icon: ''
    }
  },
  {
    path: '/message',
    component: MessageIndex,
    meta: {
      title: '留言板',
      icon: ''
    }
  },
  {
    path: '/link',
    component: LinkIndex,
    meta: {
      title: '友情链接',
      icon: ''
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