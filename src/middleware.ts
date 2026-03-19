import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas - não proteger
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/track") ||
    pathname.startsWith("/api/helena")
  ) {
    return NextResponse.next();
  }

  // Verificar cookie de sessão
  const token = request.cookies.get("bw_admin_session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verificar formato e expiração
  try {
    const parts = token.split(".");
    if (parts.length !== 2) throw new Error("Invalid token");

    const payload = JSON.parse(atob(parts[0]));
    if (payload.exp < Date.now()) throw new Error("Expired");
  } catch {
    const response = pathname.startsWith("/api/admin")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("bw_admin_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
