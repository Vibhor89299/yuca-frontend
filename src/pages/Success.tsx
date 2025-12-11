
export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--yuca-background)] p-4">
      <header className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between bg-[var(--yuca-header-footer)] px-4 text-[var(--yuca-card-background)] shadow-md md:px-6">
        <a className="flex items-center gap-2 text-lg font-semibold" href="#">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="sr-only">YUCA</span>
          <span>YUCA</span>
        </a>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              className="h-9 w-48 rounded-md border border-[var(--yuca-border-color)] bg-[var(--yuca-input-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--yuca-button-background)]"
              placeholder="Search..."
              type="search"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--yuca-text-color)] hover:bg-[var(--yuca-border-color)]">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
          <button className="rounded-full p-2 text-[var(--yuca-card-background)] hover:bg-[var(--yuca-border-color)]">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="sr-only">Account</span>
          </button>
          <button className="relative rounded-full p-2 text-[var(--yuca-card-background)] hover:bg-[var(--yuca-border-color)]">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              1
            </span>
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </header>
      <main className="flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-[var(--yuca-card-background)] p-8 text-center shadow-lg">
        <svg
          className="mb-4 h-16 w-16 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <h1 className="mb-2 text-3xl font-bold text-[var(--yuca-text-color)]">Payment Successful!</h1>
        <p className="mb-6 text-[var(--yuca-text-color)]">Your order has been placed and will be processed shortly.</p>
        <a
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--yuca-button-background)] px-8 text-sm font-medium text-[var(--yuca-card-background)] shadow transition-colors hover:bg-[var(--yuca-button-background)]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--yuca-button-background)] disabled:pointer-events-none disabled:opacity-50"
          href="/"
        >
          Continue Shopping
        </a>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-center bg-[var(--yuca-header-footer)] px-4 text-[var(--yuca-card-background)] shadow-md md:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>YUCA</span>
        </div>
        <p className="ml-4 text-sm">© 2025 YUCA. All rights reserved.</p>
      </footer>
    </div>
  )
}
