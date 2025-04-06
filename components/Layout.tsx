import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto">{children}</div>
    </>
  )
}
