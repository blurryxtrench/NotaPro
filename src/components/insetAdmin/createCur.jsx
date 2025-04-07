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

export default function createCur({ docentes, setState, cursos }) {
  const [credentialsCur, setCredentialsCur] = useState({
    nombre: "",
    docenteId: "",
  });
  const handleSelect = (doc) => {
    setCredentialsCur((prev) => ({
      ...prev,
      docenteId: doc.id,
    }));
  };

  const handleChange = (e) => {
    setCredentialsCur((prev) => ({
      ...prev,
      nombre: e.target.value,
    }));
  };
  const handleSubmitCur = async (e) => {
    e.preventDefault();
    const response = await axios.post(`./api/curso`, credentialsCur);
    setCredentialsCur({
      nombre: "",
      docenteId: "",
    });
    setState((prev) => prev + 1);
  };
  const nomControl = cursos.find((cur) => cur.nombre == credentialsCur.nombre);
  let curcontrol;
  if (nomControl) curcontrol = false;
  if (!nomControl) curcontrol = true;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="text-lg">Crear</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Curso</DialogTitle>
          <DialogDescription>
            Ingrese los datos del nuevo curso
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>Nombre</div>
            <Input
              placeholder="nombre"
              value={credentialsCur.nombre}
              onChange={handleChange}
              name="nombre"
            />
            <div>Preceptor</div>
            <ScrollArea className="h-72 w-full p-1 rounded-md border">
              {docentes.map((doc, index) => {
                if (doc.id == credentialsCur.docenteId)
                  return (
                    <div
                      onClick={() => handleSelect(doc)}
                      key={index}
                      className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                    >
                      {doc.nombre} {doc.apellido}
                    </div>
                  );
                else
                  return (
                    <div
                      onClick={() => handleSelect(doc)}
                      key={index}
                      className="p-2 text-sm border hover:bg-accent rounded w-auto"
                    >
                      {doc.nombre} {doc.apellido}
                    </div>
                  );
              })}
            </ScrollArea>
          </div>
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {credentialsCur.nombre != "" &&
            curcontrol &&
            credentialsCur.docenteId != "" ? (
              <form
                onSubmit={(e) => handleSubmitCur(e)}
                className="flex items-center space-x-2"
              >
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            ) : (
              <Button type="submit" disabled variant="secondary">
                {curcontrol
                  ? "Aún debe llenar campos"
                  : "no se deben repetir los nombres"}
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
