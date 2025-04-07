import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { estudianteId, materiaId } = await params;
  const tareasConCalificaciones = await prisma.tarea.findMany({
    where: {
      materiaId: Number(materiaId),
    },
    include: {
      calificaciones: {
        where: {
          estudianteId: Number(estudianteId),
        },
      },
    },
  });
  return NextResponse.json(tareasConCalificaciones);
}
