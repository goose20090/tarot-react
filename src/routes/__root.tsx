import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '#/components/Footer'
import Header from '#/components/Header'
import { getShellData } from '#/lib/tarot.functions'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: () => getShellData(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Tarot Atlas' },
      {
        name: 'description',
        content:
          'A Thoth Tarot study and reading app rebuilt with TanStack Start, Drizzle, Tailwind, and Radix.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/tarot-assets/icon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const { currentUser } = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header currentUser={currentUser} />
        <main className="app-shell pb-16 pt-8 md:pt-10">
          <Outlet />
        </main>
        <Footer />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
