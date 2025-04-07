// pages/api/activar-docente.js
import { prisma } from "../../../libs/prisma.js";
import argon2 from "argon2";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, newPassword } = await request.json();

  try {
    // Buscar al usuario en las tres tablas posibles (Docente, Estudiante, Familiar)
    let usuario = await prisma.docente.findUnique({
      where: { oneTimeToken: token },
    });

    if (!usuario) {
      usuario = await prisma.estudiante.findUnique({
        where: { oneTimeToken: token },
      });
    }

    if (!usuario) {
      usuario = await prisma.familiar.findUnique({
        where: { oneTimeToken: token },
      });
    }

    if (!usuario) {
      return new NextResponse(
        JSON.stringify({ message: "Token inválido o expirado." }),
        { status: 400 }
      );
    }

    const currentDate = new Date();
    if (currentDate > new Date(usuario.tokenExpiresAt)) {
      return new NextResponse(
        JSON.stringify({ message: "El token ha expirado." }),
        { status: 400 }
      );
    }
    const hashedPassword = await argon2.hash(newPassword);

    // Actualizar la contraseña y eliminar el token de un solo uso en la tabla correspondiente

    if (usuario.user.includes("_doc")) {
      await prisma.docente.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
          oneTimeToken: null, // Eliminar el token de un solo uso
          tokenExpiresAt: null, // Establecer la fecha de expiración en null
        },
      });
    } else if (usuario.user.includes("_est")) {
      await prisma.estudiante.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
          oneTimeToken: null,
          tokenExpiresAt: null, // Establecer la fecha de expiración en null
        },
      });
    } else if (usuario.user.includes("_fam")) {
      await prisma.familiar.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
          oneTimeToken: null,
          tokenExpiresAt: null, // Establecer la fecha de expiración en null
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Contraseña cambiada con éxito." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error al activar cuenta." }),
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  const { token } = await request.json();
  try {
    // Buscar al usuario en las tres tablas posibles (Docente, Estudiante, Familiar)
    let usuario = await prisma.docente.findUnique({
      where: { oneTimeToken: token },
    });
    if (!usuario) {
      usuario = await prisma.estudiante.findUnique({
        where: { oneTimeToken: token },
      });
    }

    if (!usuario) {
      usuario = await prisma.familiar.findUnique({
        where: { oneTimeToken: token },
      });
    }

    if (!usuario) {
      return new NextResponse(
        JSON.stringify({ message: "Token inválido o expirado." }),
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Contraseña cambiada con éxito.", usuario },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error al activar cuenta." }),
      { status: 500 }
    );
  }
}
