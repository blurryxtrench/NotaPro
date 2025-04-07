import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { docenteId } = await params;

  const docente = await prisma.docente.findUnique({
    where: { id: Number(docenteId) },
    include: {
      materias: {
        include: {
          tareas: {
            include: {
              calificaciones: true,
            },
          },
          promedios: true,
        },
      },
      cursos: {
        include: {
          estudiantes: true,
        },
      },
    },
  });
  return NextResponse.json(docente);
}

export async function PUT(request, { params }) {
  const { docenteId } = await params;
  const data = await request.json();

  try {
    const docenteActualizado = await prisma.docente.update({
      where: { id: parseInt(docenteId) },
      data,
    });
    return NextResponse.json({
      message: "docente actualizado correctamente",
      docente: docenteActualizado,
    });
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
export async function DELETE(request, { params }) {
  const { docenteId } = await params;

  const cursos = await prisma.curso.findMany({
    where: { docenteId: parseInt(docenteId) },
  });

  const materias = await prisma.materia.findMany({
    where: { docenteId: parseInt(docenteId) },
  });

  if (cursos.length || materias.length)
    return new Response(
      JSON.stringify({
        message: "Aún tiene cursos y materias a su cargo",
        cursos: cursos,
        materias: materias,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  await prisma.docente.delete({
    where: { id: parseInt(docenteId) },
  });
  return NextResponse.json({
    message: "Docente eliminado correctamente",
  });
}
