"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-[#170604] px-6 py-16 text-white">
          <div className="mx-auto max-w-xl rounded-lg border border-orange-200/15 bg-black/35 p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-200/70">Hibachi Calculator</p>
            <h1 className="mt-3 text-3xl font-black">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-orange-100/70">
              Please reload the calculator and try again.
            </p>
            <button
              className="mt-6 rounded-md bg-orange-400 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-300"
              type="button"
              onClick={reset}
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
