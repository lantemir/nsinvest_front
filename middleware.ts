import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token");

  const { pathname } = request.nextUrl;

  // 👀 Только если пользователь на главной
  if (pathname === "/" && refreshToken) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// 👇 Указываем, что middleware применяется только к главной
export const config = {
  matcher: ["/"],
};