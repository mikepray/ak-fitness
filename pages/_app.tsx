import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications"

import { AppProps } from "next/app";
import Layout from "../components/Layout";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
        }}
      >
        <Notifications />
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </MantineProvider>
    </SessionProvider>
  );
};

export default App;
