import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { estudianteId } = await params;
  const calificaciones = await prisma.calificacion.findMany({
    where: {
      estudianteId: Number(estudianteId),
    },
    include: {
      tarea: true,
    },
  });
  return NextResponse.json(calificaciones);
}
