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

export default function createEst({ docentes, setState }) {
  const [credentialsDoc, setCredentialsDoc] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });
  const obtenerIniciales = (str) => {
    if (!str.includes(" ")) {
      return str[0].toUpperCase(); // Solo devuelve la primera letra en mayúscula
    }
    return str
      .split(" ") // Separar en palabras
      .map((palabra) => palabra[0].toLowerCase()) // Tomar la primera letra en minúscula
      .join(""); // Unir las iniciales
  };

  const handleChangeDoc = (e) => {
    setCredentialsDoc({ ...credentialsDoc, [e.target.name]: e.target.value });
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
  const handleSubmitDoc = async (e) => {
    e.preventDefault();
    const { nombre, apellido, email } = credentialsDoc;
    const iniciales = obtenerIniciales(nombre);
    const data = {
      user: iniciales.toLowerCase() + apellido.toLowerCase() + "_" + "doc",
      password: randomComplexString(12),
      nombre: nombre.replace(/\b\w/g, (letra) => letra.toUpperCase()),
      apellido: apellido.replace(/\b\w/g, (letra) => letra.toUpperCase()),
      email: email,
    };
    let checkMail = true;
    let checkUser = true;
    let cont = 0;
    for (let i = 0; i < docentes.length; i++) {
      const { email, user } = docentes[i];

      if (email === data.email) {
        checkMail = false; // Si el email ya existe, marcamos como false
      }

      if (user === data.user) {
        checkUser = false; // Si el usuario ya existe, marcamos como false
        // Ahora verificamos si existe un user similar con el contador
        let newUser = data.user + cont;
        while (docentes.some((est) => est.user === newUser)) {
          cont++; // Incrementamos el contador hasta que no haya coincidencia
          newUser = data.user + cont;
        }
        data.user = newUser; // Actualizamos el usuario con el nuevo valor
      }
    }
    const response = await axios.post("/api/docente/", data);
    setCredentialsDoc({
      nombre: "",
      apellido: "",
      email: "",
    });

    setState((prev) => prev + 1);
  };

  const emailControl = docentes.find(
    (doc) => doc.email == credentialsDoc.email
  );
  let doccontrol;
  if (emailControl) doccontrol = false;
  if (!emailControl) doccontrol = true;

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
          <DialogTitle>Crear Usuario de docente</DialogTitle>
          <DialogDescription>
            Ingrese los datos del nuevo docente
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div>Nombre</div>
          <Input
            placeholder="nombre"
            value={credentialsDoc.nombre}
            onChange={handleChangeDoc}
            name="nombre"
          />
          <div>Apellido</div>
          <Input
            placeholder="apellido"
            value={credentialsDoc.apellido}
            onChange={handleChangeDoc}
            name="apellido"
          />
          <div>Email</div>
          <Input
            placeholder="email"
            value={credentialsDoc.email}
            onChange={handleChangeDoc}
            name="email"
          />
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {credentialsDoc.nombre != "" &&
            credentialsDoc.email != "" &&
            doccontrol &&
            credentialsDoc.apellido != "" ? (
              <form
                onSubmit={(e) => handleSubmitDoc(e)}
                className="flex items-center space-x-2"
              >
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            ) : (
              <Button type="submit" disabled variant="secondary">
                {doccontrol
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
