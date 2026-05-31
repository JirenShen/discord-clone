import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 1. 定义哪些路由是绝对公开、不需要登录的
// 这里把 /sign-in, /sign-up 以及它们底下的所有子路由 (.*) 都设为公开
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // 2. 如果当前访问的网址「不是」公开路由，那就必须强制登录
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // 保持你原有的最新版匹配规则不变
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}