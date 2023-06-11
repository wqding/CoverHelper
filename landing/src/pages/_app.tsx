import { AppProps } from 'next/app';
import Head from 'next/head'

import '../styles/main.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <title>CoverHelper - Best AI Cover Letter Writer</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default MyApp;
