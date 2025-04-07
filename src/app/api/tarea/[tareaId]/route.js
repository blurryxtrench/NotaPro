import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { tareaId } = await params;
  const tarea = await prisma.tarea.findFirst({
    where: {
      id: Number(tareaId),
    },
    include: {
      calificaciones: true,
      materia: true,
    },
  });
  return NextResponse.json(tarea);
}

export async function PUT(request, { params }) {
  const { tareaId } = await params;
  let data = await request.json(); // Datos a actualizar
  delete data.calificaciones;
  console.log(data);
  const tareaActualizada = await prisma.tarea.update({
    where: { id: Number(tareaId) },
    data,
  });

  return NextResponse.json({
    message: "tarea actualizada",
    materia: tareaActualizada,
  });
}

//la tarea debe estar entregada
export async function POST(request, { params }) {
  const { tareaId } = await params;
  console.log(tareaId);
  const data = await request.json(); // Datos a actualizar
  console.log(data);
  data.array.map((a) => console.log(a.estudianteId));
  let calificaciones = await Promise.all(
    data.array.map(async ({ estudianteId, calificacion }) => {
      console.log(estudianteId, calificacion);
      const nota = await prisma.calificacion.findFirst({
        where: {
          tareaId: Number(tareaId),
          estudianteId: Number(estudianteId),
        },
      });
      console.log(nota);
      if (calificacion == 0) {
        await prisma.calificacion.update({
          where: {
            id: Number(nota.id),
          },
          data: {
            calificacion: Number(calificacion),
            estado: "entregado",
          },
        });
      } else {
        await prisma.calificacion.update({
          where: {
            id: Number(nota.id),
          },
          data: {
            calificacion: Number(calificacion),
            estado: "corregido",
          },
        });
      }
    })
  );
  calificaciones = await prisma.calificacion.findMany({
    where: {
      tareaId: Number(tareaId),
    },
  });
  return NextResponse.json(calificaciones);
}
export async function DELETE(request, { params }) {
  const { tareaId } = await params;
  console.log(tareaId);
  await prisma.calificacion.deleteMany({
    where: { tareaId: Number(tareaId) },
  });

  await prisma.tarea.delete({
    where: { id: Number(tareaId) },
  });

  return NextResponse.json({
    message: "tarea eliminada junto con sus calificaciones correspondientes",
  });
}
