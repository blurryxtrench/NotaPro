import { Copy } from "lucide-react";
import { useState, useEffect } from "react";

import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";

export default function createEst({ cursos, setState, estudiantes }) {
  const [credentialsEst, setCredentialsEst] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cursoId: "",
  });
  const handleChangeEst = (e) => {
    setCredentialsEst({ ...credentialsEst, [e.target.name]: e.target.value });
  };
  const obtenerIniciales = (str) => {
    if (!str.includes(" ")) {
      return str[0].toUpperCase(); // Solo devuelve la primera letra en mayúscula
    }
    return str
      .split(" ") // Separar en palabras
      .map((palabra) => palabra[0].toLowerCase()) // Tomar la primera letra en minúscula
      .join(""); // Unir las iniciales
  };
  function randomComplexString(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const handleSubmitEst = async (e) => {
    e.preventDefault();
    const { nombre, apellido, email, cursoId } = credentialsEst;
    const iniciales = obtenerIniciales(nombre);
    const data = {
      user: iniciales.toLowerCase() + apellido.toLowerCase() + "_" + "est",
      password: randomComplexString(12),
      nombre: nombre.replace(/\b\w/g, (letra) => letra.toUpperCase()),
      apellido: apellido.replace(/\b\w/g, (letra) => letra.toUpperCase()),
      email: email,
      cursoId: cursoId,
    };
    let checkMail = true;
    let checkUser = true;
    let cont = 0;
    for (let i = 0; i < estudiantes.length; i++) {
      const { email, user } = estudiantes[i];

      if (email === data.email) {
        checkMail = false; // Si el email ya existe, marcamos como false
      }

      if (user === data.user) {
        checkUser = false; // Si el usuario ya existe, marcamos como false
        // Ahora verificamos si existe un user similar con el contador
        let newUser = data.user + cont;
        while (estudiantes.some((est) => est.user === newUser)) {
          cont++; // Incrementamos el contador hasta que no haya coincidencia
          newUser = data.user + cont;
        }
        data.user = newUser; // Actualizamos el usuario con el nuevo valor
      }
    }
    const response = await axios.post("/api/estudiante/", data);
    console.log(response);
    setCredentialsEst({
      nombre: "",
      apellido: "",
      email: "",
      cursoId: "",
    });

    setState((prev) => prev + 1);
  };
  let estcontrol;

  const emailControl2 = estudiantes.find(
    (est) => est.email == credentialsEst.email
  );
  if (emailControl2) estcontrol = false;
  if (!emailControl2) estcontrol = true;
  const handleSelectEst = (cur) => {
    setCredentialsEst((prev) => ({
      ...prev,
      cursoId: cur.id,
    }));
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
        >
          <i className="fa-solid fa-plus"></i>Crear
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Usuario de Estudiante</DialogTitle>
          <DialogDescription>
            Ingrese los datos del nuevo estudiante
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div>Nombre</div>
          <Input
            placeholder="nombre"
            value={credentialsEst.nombre}
            onChange={handleChangeEst}
            name="nombre"
          />
          <div>Apellido</div>
          <Input
            placeholder="apellido"
            value={credentialsEst.apellido}
            onChange={handleChangeEst}
            name="apellido"
          />
          <div>Email</div>
          <Input
            placeholder="email"
            value={credentialsEst.email}
            onChange={handleChangeEst}
            name="email"
          />
          <div>Curso</div>
          <ScrollArea className="h-72 w-full p-1 rounded-md border">
            {cursos.map((cur, index) => {
              if (cur.id == credentialsEst.cursoId)
                return (
                  <div
                    onClick={() => handleSelectEst(cur)}
                    key={index}
                    className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                  >
                    {cur.nombre}
                  </div>
                );
              else
                return (
                  <div
                    onClick={() => handleSelectEst(cur)}
                    key={index}
                    className="p-2 text-sm border hover:bg-accent rounded w-auto"
                  >
                    {cur.nombre}
                  </div>
                );
            })}
          </ScrollArea>
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {credentialsEst.nombre != "" &&
            credentialsEst.email != "" &&
            estcontrol &&
            credentialsEst.apellido != "" ? (
              <form
                onSubmit={(e) => handleSubmitEst(e)}
                className="flex items-center space-x-2"
              >
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            ) : (
              <Button type="submit" disabled variant="secondary">
                {estcontrol
                  ? "Aún debe llenar campos"
                  : "no se deben repetir los emails"}
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
