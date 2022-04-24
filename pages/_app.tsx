import { Center, Container, MantineProvider, Stack } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/globals.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: preferredColorScheme,
      }}
    >
      <NotificationsProvider position="bottom-center">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
          />
          <meta property="og:title" content={"Planny"} />
          <meta
            property="og:description"
            content={"Schedule events. With friends."}
          />
          <title>Planny</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <QueryClientProvider client={queryClient}>
          <Container size="sm">
            <Stack align="center" sx={{ height: "100%" }}>
              <Component {...pageProps} />
            </Stack>
          </Container>
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}
