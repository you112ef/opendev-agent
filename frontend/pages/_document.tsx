import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1A1A2E" />
        <meta name="description" content="منصة مهندس البرمجيات المتقدمة بالذكاء الاصطناعي" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
