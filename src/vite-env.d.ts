/// <reference types="vite/client" />

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}
