import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID || "2669dc08-4825-4c18-88a3-4a762efc5eb9",
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "pck_jb0s2422wceqyqpvmnf8cqnxx1yc4gyprq0cy6jjb4btg",
  tokenStore: "cookie",
});