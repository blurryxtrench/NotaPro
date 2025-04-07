import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma.js";

export async function GET(request, { params }) {
  const { userId } = await params;

  const admin = await prisma.admin.findUnique({
    where: { id: Number(userId) },
  });
  return NextResponse.json(admin);
}

export async function PUT(request, { params }) {
  const { userId } = await params;
  const data = await request.json();

  try {
    const adminActualizado = await prisma.admin.update({
      where: { id: parseInt(userId) },
      data,
    });
    return NextResponse.json({
      message: "admin actualizado correctamente",
      admin: adminActualizado,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          message: "datos mal enviados",
          field: error.meta?.target,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
export async function DELETE(request, { params }) {
  const { userId } = await params;

  try {
    const adminEliminado = await prisma.admin.delete({
      where: { id: parseInt(userId) },
    });
    return NextResponse.json({
      message: "admin eliminado correctamente",
      admin: adminEliminado,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({
          message: "datos mal enviados",
          field: error.meta?.target,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
