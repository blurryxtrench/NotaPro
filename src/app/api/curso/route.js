import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";

export async function GET() {
  const cursos = await prisma.curso.findMany();
  return NextResponse.json(cursos);
}

export async function POST(request) {
  const { nombre, docenteId } = await request.json();
  const preceptor = await prisma.docente.findFirst({
    where: { id: docenteId },
  });
  if (!preceptor) {
    return NextResponse.json(
      { error: "No existe el docente" },
      { status: 404 }
    );
  }
  const nuevoCurso = await prisma.curso.create({
    data: {
      nombre,
      docenteId,
    },
  });
  return NextResponse.json(nuevoCurso);
}
