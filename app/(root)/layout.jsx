import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="p-4 border-b border-gray-700 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" width={42} />
            <h2 className="text-primary-100 text-xl font-extrabold">CrackWise</h2>
          </Link>
        </nav>

        <div className="p-1">
          <h1 className="text-2xl font-semibold mb-6"></h1>
        </div>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
