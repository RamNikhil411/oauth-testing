import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '../components/Header'

// ✅ Create QueryClient instance
const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
})
