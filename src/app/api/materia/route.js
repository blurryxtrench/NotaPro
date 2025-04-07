import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";

export async function GET() {
  const materias = await prisma.materia.findMany();

  return NextResponse.json(materias);
}

export async function POST(request) {
  const data = await request.json();
  console.log(data);
  const nuevaMateria = await prisma.materia.create({
    data,
  });
  return NextResponse.json(nuevaMateria);
}
