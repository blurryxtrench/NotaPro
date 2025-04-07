import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const config = {
  matcher: "/:path*",
};

// Rutas públicas que no requieren autenticación

export async function middleware(request) {
  // Rutas permitidas según rol
  const rolePages = {
    docente: "/docente",
    estudiante: "/estudiante",
    familiar: "/familiar",
    admin: "/admin",
    signup: "/admin/signup",
  };
  // Referers permitidos para la API
  const host = request.nextUrl.origin; // Obtiene la URL base dinámicamente
  const allowedReferers = [
    `${host}/docente`,
    `${host}/estudiante`,
    `${host}/familiar`,
    `${host}/admin`,
    `${host}/`,
    `${host}/admin/signup`,
    `${host}/login`,
  ];
  const publicPaths = [
    "/login",
    "/activar-usuario", // Ruta para activar la cuenta, no requiere token
  ];
  const currentPage = request.nextUrl.pathname;
  const referer = request.headers.get("referer") || "";

  const normalizedReferer = referer.replace(/\/$/, ""); // Elimina la "/" final si la tiene
  const isValidReferer = allowedReferers.some((url) =>
    normalizedReferer.startsWith(url)
  );
  if (publicPaths.includes(currentPage) || normalizedReferer === host) {
    return NextResponse.next();
  }
  if (currentPage.startsWith("/api")) {
    if (!referer) {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    if (!isValidReferer) {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 403 }
      );
    }
  }
  const isProtectedRoute = Object.values(rolePages).some((path) =>
    currentPage.startsWith(path)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }
  // lo siguiente está mal, debería aplicarse solo a RUTAS PROTEGIDAS. El resto de rutas deberían ser publicas.
  // Es decir, debes listar y aplicar logica dedicada las RUTAS PROTEGIDAS, y que el resto sean publicas.
  // No hya que listar las RUTAS PUBLICAS, ya que hay rutas internas que no se están contemplando
  const cookieStore = await cookies();
  const value = cookieStore.get("userToken")?.value;
  if (!value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  try {
    const { payload } = await jwtVerify(
      value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const allowedPath = rolePages[payload.rol];

    if (!allowedPath || currentPage != allowedPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
