import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";
import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
export async function GET(request) {
  const estudiantes = await prisma.estudiante.findMany();
  const host = request.nextUrl.origin;

  const estConActivacion = estudiantes.map((est) => ({
    ...est,
    activationURL: est.oneTimeToken
      ? `${host}/activar-usuario?token=${est.oneTimeToken}`
      : null,
  }));
  return NextResponse.json(estConActivacion);
}

export async function POST(request) {
  const data = await request.json();
  try {
    const password = await argon2.hash(uuidv4().slice(0, 12));
    const oneTimeToken = uuidv4();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 72);
    // tokenExpiresAt.setMinutes(tokenExpiresAt.getMinutes() + 1);
    const newDocente = await prisma.estudiante.create({
      data: {
        user: data.user,
        password,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        oneTimeToken,
        tokenExpiresAt,
        cursoId: Number(data.cursoId),
      },
    });

    // Obtener host dinámicamente del request
    const host = request.nextUrl.origin;
    const activationURL = `${host}/activar-usuario?token=${oneTimeToken}`;

    console.log("URL de activación generada:", activationURL); // ← Para depuración

    return NextResponse.json({ ...newDocente, activationURL });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
