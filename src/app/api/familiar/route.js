import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
export async function GET(request) {
  const familiares = await prisma.familiar.findMany({
    include: {
      estudiantes: true, // Incluir los estudiantes relacionados
    },
  });
  const host = request.nextUrl.origin;

  const famConActivacion = familiares.map((fam) => ({
    ...fam,
    activationURL: fam.oneTimeToken
      ? `${host}/activar-usuario?token=${fam.oneTimeToken}`
      : null,
  }));
  return NextResponse.json(famConActivacion);
}

export async function POST(request) {
  const data = await request.json();

  try {
    const password = await argon2.hash(uuidv4().slice(0, 12));
    const oneTimeToken = uuidv4();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 72);
    // tokenExpiresAt.setMinutes(tokenExpiresAt.getMinutes() + 1);

    const newDocente = await prisma.familiar.create({
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
