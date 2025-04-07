import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { periodoId, cursoId } = await params;
  try {
    const tareas = await prisma.tarea.findMany({
      where: {
        periodoId: Number(periodoId),
        materia: {
          cursoId: Number(cursoId),
        },
      },
      include: {
        materia: true, // Incluye detalles de la materia
        calificaciones: true, // Incluye las calificaciones del estudiante
      },
    });

    return NextResponse.json(tareas);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
