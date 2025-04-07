import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { familiarId } = await params;

  const familiar = await prisma.familiar.findUnique({
    where: { id: Number(familiarId) },
    include: {
      estudiantes: true,
    },
  });
  return NextResponse.json(familiar);
}

export async function PUT(request, { params }) {
  const { familiarId } = await params;
  const data = await request.json();

  const familiar = await prisma.familiar.findFirst({
    where: {
      id: parseInt(familiarId),
    },
    include: { estudiantes: true },
  });

  if (data.estudiantesIds) data.estudiantesIds.map(Number);
  // Actualizar los datos del estudiante
  try {
    const familiarActualizado = await prisma.familiar.update({
      where: { id: parseInt(familiarId) },
      data: !data.estudiantesIds
        ? data
        : {
            nombre: data.nombre || familiar.nombre,
            apellido: data.apellido || familiar.apellido,
            email: data.email || familiar.email,
            estudiantes: {
              set: data.estudiantesIds.map((id) => ({ id: parseInt(id) })), // Asignar nuevos familiares
            },
          },
      include: { estudiantes: true },
    });
    return NextResponse.json({
      message: "Familiar actualizado correctamente",
      estudiante: familiarActualizado,
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
  const { familiarId } = await params;

  await prisma.familiar.delete({
    where: { id: parseInt(familiarId) },
  });

  return NextResponse.json({
    message: "Familiar eliminado",
  });
}
