import { verify } from "jsonwebtoken";
import { prisma } from "../../../libs/prisma.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import argon2 from "argon2";

export async function GET() {
  const admin = await prisma.admin.findMany();
  if (admin.length == 0) {
    return NextResponse.json({ message: admin.length }, { status: 200 });
  } else {
    const cookieStore = await cookies();
    try {
      const userToken = cookieStore.get("userToken")?.value;
      const user = verify(userToken, process.env.SECRET_KEY);
      return NextResponse.json(
        { user, message: "ya ha iniciado sesión" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: "login", error }, { status: 200 });
    }
  }
}
//devuelve 200 si es esa la contraseña
export async function POST(request) {
  const data = await request.json();
  const { user, password } = data;
  const string = user.slice(-3);
  let rol =
    string == "est"
      ? "estudiante"
      : string == "doc"
      ? "docente"
      : string == "fam"
      ? "familiar"
      : "admin";
  try {
    // Buscar el usuario en la base de datos
    let account = await prisma[rol].findFirst({
      where: { user },
    });

    // Validar si el usuario existe
    if (!account) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }
    // Verificar la contraseña correctamente
    const isPasswordValid = await argon2.verify(account.password, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta." },
        { status: 401 }
      );
    }
    // const isPasswordValid = account.password == password;
    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.error("Contraseña incorrecta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

//cambia la contraseña, requiere contraseña actual
export async function PUT(request) {
  const data = await request.json();

  const { user, password, newPassword } = data;
  const string = user.slice(-3);
  let rol =
    string == "est"
      ? "estudiante"
      : string == "doc"
      ? "docente"
      : string == "fam"
      ? "familiar"
      : "admin";
  try {
    // Buscar el usuario en la base de datos
    let account = await prisma[rol].findFirst({
      where: { user },
    });

    // Validar si el usuario existe
    if (!account) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // Verificar la contraseña correctamente
    const isPasswordValid = await argon2.verify(account.password, password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta." },
        { status: 401 }
      );
    }
    const hashedPassword = await argon2.hash(newPassword);
    await prisma[rol].update({
      where: { id: parseInt(account.id) },
      data: { password: hashedPassword },
    });
    return NextResponse.json({
      message: "Contraseña actualizado correctamente",
    });
  } catch (error) {
    console.error("Contraseña incorrecta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
