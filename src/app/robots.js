export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/Admin/', '/Profile/', '/(auth)/'],
    },
    sitemap: 'https://codeiu.in/sitemap.xml',
  }
}
