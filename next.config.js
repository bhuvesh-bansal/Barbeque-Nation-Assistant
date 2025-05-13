/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RETELL_API_KEY: process.env.NEXT_PUBLIC_RETELL_API_KEY,
    GOOGLE_SHEETS_CREDENTIALS: process.env.GOOGLE_SHEETS_CREDENTIALS,
    GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this from being included
      config.resolve.fallback = {
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        http2: false,
      };
    }
    return config;
  },
  // Add basePath and assetPrefix if not running on default port
  ...(process.env.PORT && process.env.PORT !== '3000'
    ? {
        basePath: '',
        assetPrefix: `http://localhost:${process.env.PORT}`,
      }
    : {}),
}; 