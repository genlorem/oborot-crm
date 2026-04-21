/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  experimental: {
    instrumentationHook: true, // REQUIRED for Next 14; removed in Next 15+
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: 'oborotcrm',
  project: 'app',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
