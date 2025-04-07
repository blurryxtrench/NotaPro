import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";

export async function GET() {
  const periodos = await prisma.periodo.findMany();

  return NextResponse.json(periodos);
}

export async function POST(request) {
  const data = await request.json();
  const nuevoPeriodo = await prisma.periodo.create({
    data,
  });
  return NextResponse.json(nuevoPeriodo);
}

export async function DELETE(request) {
  const data = await request.json();
  await prisma.periodo.delete({
    where: { id: data.periodoId },
  });
  return NextResponse.json({ message: "Eliminado correctamente" });
}
