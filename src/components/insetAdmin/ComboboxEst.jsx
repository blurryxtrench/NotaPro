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
  _familiares,
  estudiantes,
  materias,
  cursos,
  estudiante,
  setState,
}) {
  const [familiares, setFamiliares] = useState([]);
  const [newFam, setNewFam] = useState({
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`/api/estudiante/${endpoint}`);
        setter(response.data.familiares);
      } catch (err) {
        console.error(`Error al obtener ${endpoint}:`, err);
        setError(err);
      }
    };
    fetchData(estudiante.id, setFamiliares);
    setLoading(false);
  }, [loading]);
  const [credentials, setCredentials] = useState({
    nombre: estudiante.nombre,
    email: estudiante.email,
    apellido: estudiante.apellido,
    cursoId: estudiante.cursoId,
  });
  const famArray = _familiares.filter((_fam) => {
    if (familiares.find((fam) => fam.id == _fam.id) == undefined) return true;
    if (familiares.find((fam) => fam.id == _fam.id) != undefined) return false;
  });

  const handleSubmitEst = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      `./api/estudiante/${estudiante.id}`,
      credentials
    );
    setState((prev) => prev + 1);
  };

  const handleSelect = (cur) => {
    setCredentials((prev) => ({
      ...prev,
      cursoId: cur.id,
    }));
  };
  const handleSetFam = async () => {
    const nuevosFamiliares = [...familiares, newFam];
    const familiaresIds = nuevosFamiliares.map((fam) => fam.id);
    const response = await axios.put(`./api/estudiante/${estudiante.id}`, {
      familiaresIds: familiaresIds,
    });
    setState((prev) => prev + 1);
  };
  const handleDelFam = async (e, fam) => {
    e.preventDefault();
    const nuevosFamiliares = familiares.filter((_fam) => _fam.id != fam.id);
    const familiaresIds = nuevosFamiliares.map((fam) => fam.id);

    const response = await axios.put(`./api/estudiante/${estudiante.id}`, {
      familiaresIds: familiaresIds,
    });
    setState((prev) => prev + 1);
  };

  const handleSelectFam = (fam) => {
    setNewFam(fam);
  };

  const handleChange = async (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleDelEst = async (e) => {
    e.preventDefault();
    const response = await axios.delete(
      `./api/estudiante/${estudiante.id}`,
      {}
    );
    setState((prev) => prev + 1);
  };

  const est_Control = estudiantes.find(
    (doc) => doc.email == credentials.email && doc.id != estudiante.id
  );
  let econtrol;
  if (est_Control) econtrol = false;
  if (!est_Control) econtrol = true;

  const handleOpen = (e) => {
    setOpen(!open);
  };
  const cursoNom = cursos.find((cur) => cur.id == estudiante.cursoId);
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
          {estudiante.nombre} {estudiante.apellido}
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
                <DialogTitle>Editar Estudiante</DialogTitle>
                <DialogDescription>
                  Cambie los datos del Estudiante
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
                <div>Cambiar de Curso:</div>
                <ScrollArea className="h-72 w-full p-1 rounded-md border">
                  {cursos.map((cur, index) => {
                    if (cur.id == credentials.cursoId)
                      return (
                        <div
                          onClick={() => handleSelect(cur)}
                          key={index}
                          className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                        >
                          {cur.nombre}
                        </div>
                      );
                    else
                      return (
                        <div
                          onClick={() => handleSelect(cur)}
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
                  {credentials.nombre &&
                  credentials.apellido &&
                  credentials.email &&
                  econtrol ? (
                    <form
                      onSubmit={handleSubmitEst}
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
                    onSubmit={handleDelEst}
                    className="flex items-center space-x-2"
                  >
                    <Button
                      type="submit"
                      className="bg-destructive  hover:underline hover:bg-destructive text-white hover:text-black"
                      variant="secondary"
                    >
                      Eliminar
                    </Button>

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
              {estudiante.nombre}
            </div>
            <div>
              <span className="text-black font-semibold">Usuario:</span>{" "}
              {estudiante.user}{" "}
            </div>
            <div>
              <span className="text-black font-semibold">Apellido:</span>{" "}
              {estudiante.apellido}{" "}
            </div>

            <div>
              <span className="text-black font-semibold">Email: </span>
              {estudiante.email}
            </div>
            <div>
              <span className="text-black font-semibold">Curso: </span>
              {cursoNom.nombre}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-1 justify-between items-center">
                <span className="text-black font-semibold">Familiares: </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-auto"
                    >
                      <i className="fa-solid fa-plus"></i>Vincular
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Vincular estudiante y familiar</DialogTitle>
                      <DialogDescription>
                        Presione el familiar que desea Vincular
                      </DialogDescription>
                    </DialogHeader>
                    <CardContent className="flex flex-col gap-2">
                      <ScrollArea className="h-72 w-full p-1 rounded-md border">
                        {famArray.map((fam, index) => {
                          if (fam.id == newFam.id)
                            return (
                              <div
                                onClick={() => handleSelectFam(fam)}
                                key={index}
                                className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                              >
                                {fam.nombre} {fam.apellido}
                              </div>
                            );
                          else
                            return (
                              <div
                                onClick={() => handleSelectFam(fam)}
                                key={index}
                                className="p-2 text-sm border hover:bg-accent rounded w-auto"
                              >
                                {fam.nombre} {fam.apellido}
                              </div>
                            );
                        })}
                      </ScrollArea>
                    </CardContent>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        {newFam.id != "" ? (
                          <Button
                            onClick={handleSetFam}
                            type="submit"
                            variant="secondary"
                          >
                            Guardar
                          </Button>
                        ) : (
                          <Button type="submit" disabled variant="secondary">
                            Seleccione el familiar
                          </Button>
                        )}
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {familiares.length != 0 &&
                familiares.map((fam, index) => (
                  <CardContent
                    key={index}
                    className="p-1 m-0 border rounded-lg items-center flex justify-between"
                  >
                    <div className="font-semibold text-black">
                      {fam.nombre} {fam.apellido}
                    </div>
                    <form onSubmit={(e) => handleDelFam(e, fam)}>
                      <Button variant="secondary" className="bg-accent">
                        <i className="fa-solid fa-trash"></i> Desvicular
                      </Button>
                    </form>
                  </CardContent>
                ))}
            </div>
          </div>
        </CardDescription>
        <Button
          onClick={(e) => {
            handleOpen(e);
          }}
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
