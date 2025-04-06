import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (!user) {
      router.push('/login')
    } else {
      setUsername(user)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Profiili</title>
      </Head>
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profiili</h1>
        <p>Tervetuloa, <strong>{username}</strong>!</p>
        <p className="mt-2 text-sm text-gray-600">Täällä voit tarkastella omaa ostohistoriaasi, myyntejä ja arvostelujasi.</p>
      </main>
    </>
  )
}
