import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    code: z.string().optional(), // allow visiting / without query
  }),
  component: IndexRedirect,
})

function IndexRedirect() {
  const navigate = useNavigate()
  const search = Route.useSearch() // ✅ returns { code?: string }

  useEffect(() => {
    if (search.code) {
      navigate({
        to: '/callback',
        search: { code: search.code }, // ✅ required by callback route
        replace: true,
      })
    } else {
      navigate({ to: '/signin', replace: true })
    }
  }, [])

  return null
}
