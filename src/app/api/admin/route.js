import { prisma } from "../../../libs/prisma.js";
import { NextResponse } from "next/server";
import argon2 from "argon2";

export async function GET() {
  return NextResponse.json({ message: "Hello World!" });
}
export async function POST(req) {
  const data = await req.json();
  try {
    const hashedPassword = await argon2.hash(data.password);
    console.log(data);
    const newUser = {
      ...data,
      password: hashedPassword,
    };
    console.log(data);
    await prisma.admin.create({ data: newUser });
    return NextResponse.json(
      { message: "creado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Algo ha ido mal", error },
      { status: 401 }
    );
  }
}
export async function DELETE() {
  try {
    await prisma.calificacion.deleteMany({});
    await prisma.promedio.deleteMany({});
    await prisma.mensajesPreceptores.deleteMany({});
    await prisma.mensajesProfesores.deleteMany({});
    await prisma.tarea.deleteMany({});
    await prisma.periodo.deleteMany({});
    await prisma.materia.deleteMany({});
    await prisma.estudiante.deleteMany({});
    await prisma.curso.deleteMany({});
    await prisma.docente.deleteMany({});
    await prisma.familiar.deleteMany({});
    await prisma.admin.deleteMany({});

    return NextResponse.json({
      message: "Toda la base de datos ha sido eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar la base de datos:", error);
    return NextResponse.json(
      { message: "Error al eliminar la base de datos." },
      { status: 500 }
    );
  }
}
