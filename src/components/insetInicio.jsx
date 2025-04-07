import * as React from "react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function insetInicio({ user, rol }) {
  if (rol == "admin")
    return (
      <div className="pt-10 flex flex-col gap-15  w-full">
        <CardTitle className="text-2xl flex justify-center">
          Bienvenido, administrador
        </CardTitle>
        <CardContent className="flex justify-center">
          Elija entre las opciones del menu para continuar
        </CardContent>
      </div>
    );

  return (
    <div className="pt-10 flex flex-col gap-15  w-full">
      <CardTitle className="text-2xl flex justify-center">
        Bienvenido, {user.nombre}
      </CardTitle>
      <CardContent className="flex justify-center">
        <div className="flex flex-col items-center px-10">
          <div className="flex gap-1">
            <span className="font-medium">Nombre: </span>
            <span>{user.nombre}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Apellido: </span>
            {user.apellido}
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Email: </span>
            {user.email}
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Usuario: </span>
            {user.user}
          </div>
          {rol == "estudiante" && <span>Curso: {user.curso.curso.nombre}</span>}
          {rol == "estudiante" &&
            user.familiares.map((mat, key) => (
              <span key={key}>Familiar de {mat.nombre}</span>
            ))}
          <div className="flx flex-col gap-1">
            {rol == "docente" && (
              <div>
                {user.cursos.map((cur, key) => (
                  <div key={key}>
                    <span className="font-medium">Preceptor de </span>
                    {cur.nombre}
                  </div>
                ))}
              </div>
            )}
            {rol == "docente" &&
              user.materias.map((mat, key) => (
                <div key={key}>
                  <span className="font-medium">Profesor de </span>
                  {mat.nombre}
                </div>
              ))}{" "}
            {rol == "familiar" &&
              user.estudiantes.map((mat, key) => (
                <div key={key}>
                  <span className="font-medium">Familiar de </span>
                  {mat.nombre}
                </div>
              ))}
          </div>
        </div>
        {/* Calendar */}
      </CardContent>
    </div>
  );
}
