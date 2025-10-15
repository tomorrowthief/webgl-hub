import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { locale, locales } = useRouter();
  return (
    <Layout
      isNextJs={true}
      locale={locale!}
      locales={locales!}
      commonContent={pageProps.common}
    >
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;