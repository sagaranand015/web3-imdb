import '../styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from "../utils/authProvider";

function MyApp({ Component, pageProps }) {
  return (
   <AuthProvider>
      <Head>
        <title>WMDB</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/wmdb-icon.png" />
      </Head>

      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
