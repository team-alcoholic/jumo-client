"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";

const MINUTE = 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * MINUTE,
    },
  },
});

export default function Provider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
