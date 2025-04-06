import { useEffect, useState } from 'react'
import Header from '../components/Header'

export default function ProfilePage() {
  const [userName, setUserName] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('mauktion-username')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  const handleLogin = () => {
    if (inputValue.trim()) {
      localStorage.setItem('mauktion-username', inputValue.trim())
      setUserName(inputValue.trim())
      setInputValue('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('mauktion-username')
    setUserName('')
  }

  return (
    <>
      <Header />
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profiili</h1>

        {!userName ? (
          <div className="space-y-4">
            <p>Kirjaudu sisään nimellä tai sähköpostilla:</p>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Esim. etunimi.sukunimi@email.com"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Kirjaudu sisään
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p><strong>Kirjautunut käyttäjä:</strong> {userName}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Kirjaudu ulos
            </button>
          </div>
        )}
      </main>
    </>
  )
}
