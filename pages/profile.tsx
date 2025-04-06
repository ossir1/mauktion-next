import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (!user) {
      router.push('/login')
    } else {
      setUsername(user)
    }
  }, [])

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>

      {username ? (
        <>
          <p>Tervetuloa, <span className="font-semibold">{username}</span>!</p>
          <p className="text-gray-600 mt-2 text-sm">Tulevaan profiilisivuun voidaan lisätä esim. ostohistoria, arvostelut, keskiarvot jne.</p>
        </>
      ) : (
        <p>Kirjaudutaan sisään...</p>
      )}
    </main>
  )
}
