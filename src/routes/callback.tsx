import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/callback')({
  validateSearch: z.object({
    code: z.string(),
  }),
  component: CallbackPage,
})

function CallbackPage() {
  const { code } = Route.useSearch()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['oauth-token', code],
    queryFn: async () => {
      const response = await fetch(
        `https://esigns-app.onrender.com/v1.0/oauth/token?redirect_uri=${import.meta.env.VITE_OAUTH_REDIRECT_URI}&code=${code}`,
        {
          method: 'GET',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || 'Token exchange failed')
      }

      return data?.data
    },
    enabled: !!code,
    refetchOnWindowFocus: false,
  })

  console.log(data)

  useEffect(() => {
    if (data) {
      localStorage.setItem('access_token', data.accessToken)
      console.log('✅ Token saved:', data.accessToken)

      setTimeout(() => {
        navigate({
          to: '/dashboard',
          search: { user_id: data?.user?._id },
          replace: true,
        })
      }, 1000)
    }
  }, [data, navigate])

  useEffect(() => {
    if (isError) {
    navigate({ to: '/signin', replace: true })
      // Optional fallback
    }
  }, [isError, error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 text-xl font-semibold">
      {isLoading
        ? '🔄 Redirecting...'
        : isError
          ? '❌ Error occurred'
          : '✅ Redirecting...'}
    </div>
  )
}
