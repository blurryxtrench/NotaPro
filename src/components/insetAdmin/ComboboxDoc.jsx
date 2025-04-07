import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  CardContent,
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function ComboboxDemo({
  curso,
  docentes,
  materias,
  cursos,
  docente,
  setState,
}) {
  const [credentials, setCredentials] = useState({
    nombre: docente.nombre,
    email: docente.email,
    apellido: docente.apellido,
  });
  const [loading, setLoading] = useState(true);
  const handleSubmitDoc = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      `./api/docente/${docente.id}`,
      credentials
    );
    setState((prev) => prev + 1);
  };

  const handleChange = async (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleDelDoc = async (e) => {
    e.preventDefault();
    const response = await axios.delete(`./api/docente/${docente.id}`, {});
    setState((prev) => prev + 1);
  };

  const doc_Control = docentes.find(
    (doc) => doc.email == credentials.email && doc.id != docente.id
  );
  let econtrol;
  if (doc_Control) econtrol = false;
  if (!doc_Control) econtrol = true;

  const doc_curs = cursos.filter((cur) => cur.docenteId == docente.id);
  const doc_mats = materias.filter((mat) => mat.docenteId == docente.id);

  let doccontrol;
  if (doc_curs.length == 0 && doc_mats.length == 0) {
    doccontrol = true;
  } else {
    doccontrol = false;
  }
  const handleOpen = (e) => {
    setOpen(!open);
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant={"secondary"}
          className="w-full border-0 p-0 m-0 flex justify-center"
        >
          {docente.nombre} {docente.apellido}
          <ChevronsUpDown className="h-[80%] w-[10%] shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Card className="w-[300px] flex flex-row justify-between items-center gap-0 m-0 p-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
              >
                <i className="fa-solid fa-pen-to-square"></i>Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Docente</DialogTitle>
                <DialogDescription>
                  Cambie los datos del docente
                </DialogDescription>
              </DialogHeader>
              <CardContent className="flex flex-col gap-2">
                <div>Nombre</div>
                <Input
                  placeholder="nombre"
                  value={credentials.nombre}
                  onChange={handleChange}
                  name="nombre"
                />
                <div>Apellido</div>
                <Input
                  placeholder="apellido"
                  value={credentials.apellido}
                  onChange={handleChange}
                  name="apellido"
                />
                <div>Email</div>
                <Input
                  placeholder="email"
                  value={credentials.email}
                  onChange={handleChange}
                  name="email"
                />
              </CardContent>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  {credentials.nombre &&
                  credentials.apellido &&
                  credentials.email &&
                  econtrol ? (
                    <form
                      onSubmit={handleSubmitDoc}
                      className="flex items-center space-x-2"
                    >
                      <Button type="submit" variant="secondary">
                        Guardar
                      </Button>
                    </form>
                  ) : (
                    <Button type="submit" disabled variant="secondary">
                      {econtrol
                        ? "Aún debe llenar campos"
                        : "no pede repetir el e-mail con otros usuarios"}
                    </Button>
                  )}
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
              >
                <i className="fa-solid fa-trash"></i>Eliminar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Eliminar Usuario</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <CardTitle className="flex flex-col gap-2">{}</CardTitle>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <form
                    onSubmit={handleDelDoc}
                    className="flex items-center space-x-2"
                  >
                    {doccontrol ? (
                      <Button
                        type="submit"
                        className="bg-destructive  hover:underline hover:bg-destructive text-white hover:text-black"
                        variant="secondary"
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-accent disabled:bg-accent font-medium disabled:cursor-not-allowed whitespace-normal h-auto max-w-[200px] text-center hover:underline "
                        variant="secondary"
                        disabled
                      >
                        No se puede eliminar porque aún hay materias o cursos a
                        cargo de él
                      </Button>
                    )}
                    <Button
                      type="button"
                      className=" hover:underline text-black "
                      variant="secondary"
                    >
                      Cancelar{" "}
                    </Button>
                  </form>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
        <CardDescription className="p-1 flex flex-col gap-1">
          <div className="flex justify-between flex-col items-center gap-1">
            <div>
              <span className="text-black font-semibold">Nombre:</span>{" "}
              {docente.nombre}
            </div>
            <div>
              <span className="text-black font-semibold">Usuario:</span>{" "}
              {docente.user}{" "}
            </div>
            <div>
              <span className="text-black font-semibold">Apellido:</span>{" "}
              {docente.apellido}{" "}
            </div>

            <div>
              <span className="text-black font-semibold">Email: </span>
              {docente.email}
            </div>
            {doc_curs.length ? (
              <div className="flex flex-col gap-1">
                {doc_curs.map((cur, index) => (
                  <div className="flex gap-1 flex-wrap" key={index}>
                    <div className="text-black font-semibold">
                      Preceptor de:{" "}
                    </div>
                    <div>{cur.nombre}</div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            {doc_mats.length ? (
              <div className="flex flex-col gap-1">
                {doc_mats.map((mat, index) => {
                  const curse = cursos.find((cur) => cur.id == mat.cursoId);
                  return (
                    <div className="flex gap-1 flex-wrap" key={index}>
                      <div className="text-black font-semibold">
                        Profesor de:{" "}
                      </div>
                      <div className="flex gap-1 flex-col">
                        <div>
                          {mat.nombre} en {curse.nombre}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
        </CardDescription>
        <Button
          onClick={handleOpen}
          aria-expanded={open}
          variant={"secondary"}
          className="w-full border-0 p-0 m-0 flex justify-center"
        >
          Cerrar
        </Button>
      </PopoverContent>
    </Popover>
  );
}
