// pages/api/activar-docente.js
import { prisma } from "../../../libs/prisma.js";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const data = await request.json();
  console.log(data.id, data.user);

  const password = await argon2.hash(uuidv4().slice(0, 12));
  const oneTimeToken = uuidv4();
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 72);
  //   tokenExpiresAt.setMinutes(tokenExpiresAt.getMinutes() + 1);
  let updatedUsuario;
  try {
    if (data.user.includes("_doc")) {
      updatedUsuario = await prisma.docente.update({
        where: { id: data.id },
        data: {
          oneTimeToken,
          tokenExpiresAt,
          password,
        },
      });
    } else if (data.user.includes("_est")) {
      updatedUsuario = await prisma.estudiante.update({
        where: { id: data.id },
        data: {
          oneTimeToken,
          tokenExpiresAt,
          password,
        },
      });
    } else if (data.user.includes("_fam")) {
      updatedUsuario = await prisma.familiar.update({
        where: { id: data.id },
        data: {
          oneTimeToken,
          tokenExpiresAt,
          password,
        },
      });
    }

    if (!updatedUsuario) {
      return new NextResponse(
        JSON.stringify({ message: "Token inválido o expirado." }),
        { status: 400 }
      );
    }
    // Obtener host dinámicamente del request
    const host = request.nextUrl.origin;
    const activationURL = `${host}/activar-usuario?token=${oneTimeToken}`;

    console.log("URL de activación generada:", activationURL); // ← Para depuración

    return NextResponse.json({ ...updatedUsuario, activationURL });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
// export async function PUT(request) {
//   const { token } = await request.json();
//   let rol = "";
//   try {
//     // Buscar al usuario en las tres tablas posibles (Docente, Estudiante, Familiar)
//     let usuario = await prisma.docente.findUnique({
//       where: { oneTimeToken: token },
//     });
//     if (!usuario) {
//       usuario = await prisma.estudiante.findUnique({
//         where: { oneTimeToken: token },
//       });
//     }

//     if (!usuario) {
//       usuario = await prisma.familiar.findUnique({
//         where: { oneTimeToken: token },
//       });
//     }

//     if (!usuario) {
//       return new NextResponse(
//         JSON.stringify({ message: "Token inválido o expirado." }),
//         { status: 400 }
//       );
//     }
//     console.log(usuario);
//     return NextResponse.json(
//       { message: "Contraseña cambiada con éxito.", usuario },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return new NextResponse(
//       JSON.stringify({ message: "Error al activar cuenta." }),
//       { status: 500 }
//     );
//   }
// }
