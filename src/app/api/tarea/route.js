import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";

export async function GET() {
  const tareas = await prisma.tarea.findMany();
  return NextResponse.json(tareas);
}

export async function POST(request) {
  const data = await request.json();
  data.fechaPublicacion = new Date();

  console.log(data);
  const nuevaTarea = await prisma.tarea.create({
    data,
  });
  return NextResponse.json(nuevaTarea);
}
