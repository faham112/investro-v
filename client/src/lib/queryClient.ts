import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const headers: HeadersInit = data ? { "Content-Type": "application/json" } : {};

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    if (res.status >= 500) {
      throw new Error(`Server error: ${res.status}`);
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        if (typeof url !== "string") {
          throw new Error("Invalid URL");
        }

        const res = await fetch(url, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized");
          }
          if (res.status >= 500) {
            throw new Error(`Server error: ${res.status}`);
          }
          throw new Error(`HTTP error: ${res.status}`);
        }

        return res.json();
      },
      retry: (failureCount, error) => {
        // Don't retry on 401 errors
        if (error.message === "Unauthorized") {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
