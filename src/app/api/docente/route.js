import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
export async function GET(request) {
  const docentes = await prisma.docente.findMany();
  const host = request.nextUrl.origin;

  const docentesConActivacion = docentes.map((docente) => ({
    ...docente,
    activationURL: docente.oneTimeToken
      ? `${host}/activar-usuario?token=${docente.oneTimeToken}`
      : null,
  }));
  // new URL(request.url);
  return NextResponse.json(docentesConActivacion);
}

export async function POST(request) {
  const data = await request.json();
  try {
    const password = await argon2.hash(uuidv4().slice(0, 12));
    const oneTimeToken = uuidv4();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 72);
    // tokenExpiresAt.setMinutes(tokenExpiresAt.getMinutes() + 1);

    console.log(password, data, oneTimeToken, tokenExpiresAt);
    const newDocente = await prisma.docente.create({
      data: {
        user: data.user,
        password,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        oneTimeToken,
        tokenExpiresAt,
      },
    });

    // Obtener host dinámicamente del request
    const host = request.nextUrl.origin;
    const activationURL = `${host}/activar-usuario?token=${oneTimeToken}`;

    console.log("URL de activación generada:", activationURL); // ← Para depuración

    return NextResponse.json({ ...newDocente, activationURL });
  } catch (error) {
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          message: "El email ya está en uso. Prueba con otro.",
          field: error.meta?.target,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
