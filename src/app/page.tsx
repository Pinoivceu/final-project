import { redirect } from "next/navigation";

export default function RootPage() {
  // The proxy.ts handles role-based redirection for "/"
  // This is a fallback in case the proxy doesn't catch it
  redirect('/login');
}
