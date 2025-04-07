import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { estudianteId } = await params;

  const estudiante = await prisma.estudiante.findUnique({
    where: { id: Number(estudianteId) },
    include: {
      curso: {
        include: {
          materias: {
            include: {
              tareas: {
                include: {
                  calificaciones: {
                    where: { estudianteId: Number(estudianteId) },
                  },
                },
              },
              promedios: {
                where: { estudianteId: Number(estudianteId) },
              },
            },
          },
        },
      },
      familiares: true,
    },
  });
  return NextResponse.json(estudiante);
}

export async function PUT(request, { params }) {
  const { estudianteId } = await params;
  const data = await request.json();

  const estudiante = await prisma.estudiante.findFirst({
    where: {
      id: parseInt(estudianteId),
    },
    include: { familiares: true },
  });
  if (estudiante.cursoId !== data.cursoId) {
    await prisma.calificacion.deleteMany({
      where: { id: parseInt(estudianteId) },
    });
    await prisma.promedio.deleteMany({
      where: { id: parseInt(estudianteId) },
    });
  }
  if (data.familiaresIds) data.familiaresIds.map(Number);
  // Actualizar los datos del estudiante
  try {
    const estudianteActualizado = await prisma.estudiante.update({
      where: { id: parseInt(estudianteId) },
      data: !data.familiaresIds
        ? data
        : {
            nombre: data.nombre || estudiante.nombre,
            apellido: data.apellido || estudiante.apellido,
            email: data.email || estudiante.email,
            cursoId: data.cursoId || estudiante.cursoId,
            familiares: {
              set: data.familiaresIds.map((id) => ({ id: parseInt(id) })), // Asignar nuevos familiares
            },
          },
      include: { familiares: true },
    });

    return NextResponse.json({
      message: "Estudiante actualizado correctamente",
      estudiante: estudianteActualizado,
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
  const { estudianteId } = await params;

  await prisma.calificacion.deleteMany({
    where: { id: parseInt(estudianteId) },
  });

  await prisma.promedio.deleteMany({
    where: { id: parseInt(estudianteId) },
  });

  await prisma.estudiante.delete({
    where: { id: parseInt(estudianteId) },
  });

  return NextResponse.json({
    message: "Estudiante eliminado correctamente, junto con sus calificaciones",
  });
}
