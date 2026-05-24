import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#170604] px-6 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-lg border border-orange-200/15 bg-black/35 p-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-200/70">Hibachi Calculator</p>
        <h1 className="mt-3 text-3xl font-black">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-orange-100/70">
          The calculator page is still available from the home page.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md bg-orange-400 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-300"
          href="/"
        >
          Open calculator
        </Link>
      </div>
    </main>
  );
}
