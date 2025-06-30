import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
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

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        'https://v2-dev-api.esigns.io/v1.0/oauth/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: import.meta.env.VITE_OAUTH_CLIENT_ID!,
            client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET!,
            redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI!,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || 'Token exchange failed')
      }

      return data
    },

    onSuccess: (data) => {
      // ✅ Save token
      localStorage.setItem('access_token', data.accessToken)
      console.log('✅ Token saved:', data.accessToken)

      // ✅ Redirect to another page (e.g., auth-check or dashboard)
      setTimeout(
        () =>
          navigate({
            to: '/dashboard',
            search: { user_id: data?.user?._id }, // 👈 passing user_id
            replace: true,
          }),
        1000,
      )
    },

    onError: (error: any) => {
      console.error('❌ Token exchange failed:', error.message)
      // Optional: navigate({ to: '/signin' }) or show fallback UI
    },
  })

  useEffect(() => {
    mutation.mutate()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800 text-xl font-semibold">
      🔄 Redirecting...
    </div>
  )
}
