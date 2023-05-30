import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';

import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
      <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default App;
