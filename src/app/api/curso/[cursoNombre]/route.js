import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { cursoNombre } = await params;
  const curso = await prisma.curso.findFirst({
    where: {
      nombre: cursoNombre,
    },
  });
  const estudiantes = await prisma.estudiante.findMany({
    where: {
      cursoId: parseInt(curso.id), // Usamos el cursoId que llega en la URL
    },
    include: {
      familiares: true,
    },
  });
  const preceptor = await prisma.docente.findFirst({
    where: {
      id: parseInt(curso.docenteId), // Usamos el cursoId que llega en la URL
    },
  });
  const materias = await prisma.materia.findMany({
    where: {
      cursoId: parseInt(curso.id), // Usamos el cursoId que llega en la URL
    },
    include: {
      tareas: true, // Incluye las tareas relacionadas con cada materia
    },
  });
  return NextResponse.json({
    curso,
    estudiantes,
    preceptor,
    materias,
  });
}

export async function PUT(request, { params }) {
  const cursoNombre = params.cursoNombre;
  const data = await request.json(); // Datos a actualizar

  const curso = await prisma.curso.findFirst({
    where: { nombre: cursoNombre },
  });

  const cursoActualizado = await prisma.curso.update({
    where: { id: curso.id },
    data, // Se actualizan los campos enviados en el body
  });

  return NextResponse.json({
    message: "Curso actualizado (se actualizó su preceptor)",
    curso: cursoActualizado,
  });
}

export async function DELETE(request, { params }) {
  const cursoNombre = params.cursoNombre;
  const curso = await prisma.curso.findFirst({
    where: { nombre: cursoNombre },
  });

  const estudiantes = await prisma.estudiante.findMany({
    where: { cursoId: curso.id },
  });

  if (estudiantes.length) {
    return NextResponse.json(
      { error: "Hay alumnos en este curso" },
      { status: 400 }
    );
  }

  const materias = await prisma.materia.findMany({
    where: {
      cursoId: parseInt(curso.id), // Usamos el cursoId que llega en la URL
    },
  });
  const materiaIds = materias.map((m) => m.id);

  const tareas = await prisma.tarea.findMany({
    where: {
      materiaId: { in: materiaIds }, // Usamos el cursoId que llega en la URL
    },
  });
  const tareaIds = tareas.map((t) => t.id);

  await prisma.calificacion.deleteMany({
    where: { tareaId: { in: tareaIds } },
  });

  await prisma.promedio.deleteMany({
    where: { materiaId: { in: materiaIds } },
  });

  // Eliminar todas las tareas asociadas a las materias del curso
  await prisma.tarea.deleteMany({
    where: { materiaId: { in: materiaIds } },
  });

  await prisma.materia.deleteMany({
    where: { cursoId: curso.id },
  });

  await prisma.curso.delete({
    where: { id: curso.id },
  });

  return NextResponse.json({
    message:
      "Cursos, materias, tareas, calificaciones y proedios eliminados correctamente",
  });
}
