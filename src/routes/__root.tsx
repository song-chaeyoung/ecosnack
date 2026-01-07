import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import React from 'react'

const TanStackDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-devtools').then((res) => ({
          default: res.TanStackDevtools,
        })),
      )

const TanStackRouterDevtoolsPanel =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtoolsPanel,
        })),
      )

import appCss from '../styles.css?url'
import { Navigation } from '../components/Navigation'
import { ScrollToTopButton } from '../components/ScrollToTopButton'
import { SITE_CONFIG, getDefaultMeta } from '../lib/seo'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { useThemeStore } from '../stores/themeStore'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      ...getDefaultMeta(),
      {
        title: SITE_CONFIG.title,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'canonical',
        href: SITE_CONFIG.url,
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            try {
              var themeStorage = localStorage.getItem('theme-storage');
              var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              var isDark = systemPrefersDark;
              
              if (themeStorage) {
                try {
                  var parsed = JSON.parse(themeStorage);

                  if (parsed && parsed.state && typeof parsed.state.theme === 'string') {
                    // isUserSelected가 명시적으로 false인 경우에만 시스템 테마 사용
                    if (parsed.state.isUserSelected === false) {
                      isDark = systemPrefersDark;
                    } else {
                      // 그 외의 경우 (true 또는 undefined) 저장된 테마 사용
                      isDark = parsed.state.theme === 'dark';
              
                    }
                  }
                } 
              }

              if (isDark) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } 
          })();
        `,
      },
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7913636156841478',
        async: true,
        crossOrigin: 'anonymous',
      },
    ],
  }),

  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <>
      <Navigation />
      <div className="pt-16 sm-pt-14">
        <Outlet />
      </div>
      <ScrollToTopButton />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ClerkProvider>
      <html
        lang="ko"
        className={theme === 'dark' ? 'dark' : ''}
        suppressHydrationWarning
      >
        <head>
          <HeadContent />
        </head>
        <body
          className="bg-background text-foreground"
          suppressHydrationWarning
        >
          {children}
          {typeof window !== 'undefined' && (
            <React.Suspense fallback={null}>
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
            </React.Suspense>
          )}
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다</p>
      <Link to="/" className="text-primary hover:underline">
        홈으로 돌아가기
      </Link>
    </div>
  )
}
