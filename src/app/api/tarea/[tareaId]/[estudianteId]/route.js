import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { tareaId, estudianteId } = await params;
  const calificacion = await prisma.calificacion.findFirst({
    where: {
      tareaId: Number(tareaId),
      estudianteId: Number(estudianteId),
    },
  });
  return NextResponse.json(calificacion);
}

//subir nota de una tarea entregada
export async function POST(request, { params }) {
  const { tareaId, estudianteId } = await params;
  const { calificacion } = await request.json(); // Datos a actualizar
  let nota = await prisma.calificacion.findFirst({
    where: {
      tareaId: Number(tareaId),
      estudianteId: Number(estudianteId),
      estado: "entregado",
    },
  });

  let cal = await prisma.calificacion.update({
    where: { id: Number(nota.id) },
    data: { calificacion: Number(calificacion), estado: "corregido" },
  });

  return NextResponse.json({
    message: "",
    calificacion: cal,
  });
}

//entregar tarea
export async function PUT(request, { params }) {
  console.log(params);
  const { tareaId, estudianteId } = await params;

  const data = {
    estudianteId: Number(estudianteId),
    tareaId: Number(tareaId),
    calificacion: 0,
    estado: "entregado",
  };
  await prisma.calificacion.create({
    data,
  });

  return NextResponse.json({
    message: "tarea entregada",
    data,
  });
}
