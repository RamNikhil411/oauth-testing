// src/routes/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: RedirectToSignIn,
})

function RedirectToSignIn() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/signin', replace: true })
  }, [])

  return null
}
