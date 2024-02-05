
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/normal', component: () => import('components/stage/NormalStage.vue') },
      { path: '/racing', component: () => import('components/stage/TypingRacing.vue') },
      { path: '/story', component: () => import('components/stage/StoryStage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
