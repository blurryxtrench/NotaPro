import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma.js";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import argon2 from "argon2";

export async function POST(request) {
  const data = await request.json();
  if (data.rol == "signup") {
    const { rol } = data;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        rol,
      },
      process.env.SECRET_KEY
    );
    const serialized = serialize("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 100 * 60 * 60 * 24 * 30,
      path: "/",
    });

    const response = NextResponse.json({
      status: 200,
      message: "Token for sign up successfully",
      rol,
    });
    response.headers.set("Set-Cookie", serialized);
    return response;
  }
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
    // const isPasswordValid = account.password == password;

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta." },
        { status: 401 }
      );
    }

    // Generar token JWT con los datos del usuario
    const { id } = account;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
        user,
        id,
        rol,
      },
      process.env.SECRET_KEY
    );

    // Configurar la cookie con el token
    const serialized = serialize("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 100 * 60 * 60 * 24 * 30,
      path: "/",
    });

    const response = NextResponse.json({
      status: 200,
      message: "Login successfully",
      rol,
    });
    response.headers.set("Set-Cookie", serialized);
    return response;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
