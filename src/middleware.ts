import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public asset requests and static files pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If Supabase environment credentials exist, check cookie-based auth token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && supabaseUrl !== "https://placeholder-project.supabase.co";

  if (isConfigured) {
    // Check if auth token cookie exists
    const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes("auth-token") || cookie.name.includes("sb-"));
    
    // Redirect unauthenticated users from dashboard routes to login
    if (pathname.startsWith("/dashboard") && !hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
