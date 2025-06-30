import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import Dashboard from '@/components/dashboard'

export const Route = createFileRoute('/dashboard')({
  validateSearch: z.object({
    user_id: z.string(), // ✅ this makes `useSearch` typed
  }),
  component: Dashboard,
})
