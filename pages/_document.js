import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap" rel="stylesheet" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.waves.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
            <script src="/__/firebase/8.4.1/firebase-app.js"></script>

            <script src="/__/firebase/8.4.1/firebase-analytics.js"></script>

            <script src="/__/firebase/init.js"></script>
        </body>
      </Html>
    )
  }
}

export default MyDocument