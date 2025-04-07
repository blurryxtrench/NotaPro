import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { materiaId } = await params;
  const materia = await prisma.materia.findFirst({
    where: {
      id: Number(materiaId),
    },
    include: {
      tareas: {
        include: {
          calificaciones: true, // 🔥 Incluir calificaciones dentro de las tareas
        },
      },
      promedios: true,
      curso: {
        include: {
          estudiantes: true, // 🔥 Incluir los alumnos que pertenecen al curso
        },
      },
      docente: true,
    },
  });
  return NextResponse.json({
    materia,
  });
}

export async function PUT(request, { params }) {
  const { materiaId } = await params;
  const data = await request.json(); // Datos a actualizar

  const materiaActualizada = await prisma.materia.update({
    where: { id: Number(materiaId) },
    data,
  });

  return NextResponse.json({
    message: "Materia actualizada",
    materia: materiaActualizada,
  });
}

export async function DELETE(request, { params }) {
  const { materiaId } = await params;

  const tareas = await prisma.tarea.findMany({
    where: {
      materiaId: Number(materiaId), // Usamos el cursoId que llega en la URL
    },
  });
  const tareaIds = tareas.map((t) => t.id);

  await prisma.calificacion.deleteMany({
    where: { tareaId: { in: tareaIds } },
  });

  await prisma.promedio.deleteMany({
    where: { materiaId: Number(materiaId) },
  });

  // Eliminar todas las tareas asociadas a las materias del curso
  await prisma.tarea.deleteMany({
    where: { materiaId: Number(materiaId) },
  });

  await prisma.materia.deleteMany({
    where: { id: Number(materiaId) },
  });

  return NextResponse.json({
    message:
      "materia eliminado junto con sus tareas, promedios y calificaciones correspondientes",
  });
}
