import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow all dashboard routes and API endpoints to load smoothly
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
