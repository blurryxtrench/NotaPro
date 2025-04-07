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
  familiares,
  _estudiantes,
  materias,
  cursos,
  familiar,
  setState,
}) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [newEst, setNewEst] = useState({
    id: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`/api/familiar/${endpoint}`);
        setter(response.data.estudiantes);
      } catch (err) {
        console.error(`Error al obtener ${endpoint}:`, err);
        setError(err);
      }
    };
    fetchData(familiar.id, setEstudiantes);
    setLoading(false);
  }, [loading]);
  const [credentials, setCredentials] = useState({
    nombre: familiar.nombre,
    email: familiar.email,
    apellido: familiar.apellido,
  });
  const estArray = _estudiantes.filter((_est) => {
    if (estudiantes.find((est) => est.id == _est.id) == undefined) return true;
    if (estudiantes.find((est) => est.id == _est.id) != undefined) return false;
  });

  const handleSubmitFam = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      `./api/familiar/${familiar.id}`,
      credentials
    );
    setState((prev) => prev + 1);
  };

  const handleSetEst = async () => {
    const nuevosEstudiantes = [...estudiantes, newEst];
    const estudiantesIds = nuevosEstudiantes.map((est) => est.id);
    const response = await axios.put(`./api/familiar/${familiar.id}`, {
      estudiantesIds: estudiantesIds,
    });
    setState((prev) => prev + 1);
  };
  const handleDelEst = async (e, est) => {
    e.preventDefault();
    const nuevosEstudiantes = estudiantes.filter((_est) => _est.id != est.id);
    const estudiantesIds = nuevosEstudiantes.map((est) => est.id);

    const response = await axios.put(`./api/familiar/${familiar.id}`, {
      estudiantesIds: estudiantesIds,
    });
    setState((prev) => prev + 1);
  };

  const handleSelectEst = (est) => {
    setNewEst(est);
  };

  const handleChange = async (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleDelFam = async (e) => {
    e.preventDefault();
    const response = await axios.delete(`./api/familiar/${familiar.id}`, {});
    setState((prev) => prev + 1);
  };

  const fam_Control = familiares.find(
    (fam) => fam.email == credentials.email && fam.id != familiar.id
  );
  let econtrol;
  if (fam_Control) econtrol = false;
  if (!fam_Control) econtrol = true;

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
          {familiar.nombre} {familiar.apellido}
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
                <DialogTitle>Editar Familiar</DialogTitle>
                <DialogDescription>
                  Cambie los datos del Familiar
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
                      onSubmit={handleSubmitFam}
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
                    onSubmit={handleDelFam}
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
              {familiar.nombre}
            </div>
            <div>
              <span className="text-black font-semibold">Usuario:</span>{" "}
              {familiar.user}{" "}
            </div>
            <div>
              <span className="text-black font-semibold">Apellido:</span>{" "}
              {familiar.apellido}{" "}
            </div>

            <div>
              <span className="text-black font-semibold">Email: </span>
              {familiar.email}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row gap-1 justify-between items-center">
                <span className="text-black font-semibold">Estudiantes: </span>
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
                        Presione al estudiante que desea vincular
                      </DialogDescription>
                    </DialogHeader>
                    <CardContent className="flex flex-col gap-2">
                      <ScrollArea className="h-72 w-full p-1 rounded-md border">
                        {estArray.map((est, index) => {
                          if (est.id == newEst.id)
                            return (
                              <div
                                onClick={() => handleSelectEst(est)}
                                key={index}
                                className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                              >
                                {est.nombre} {est.apellido}
                              </div>
                            );
                          else
                            return (
                              <div
                                onClick={() => handleSelectEst(est)}
                                key={index}
                                className="p-2 text-sm border hover:bg-accent rounded w-auto"
                              >
                                {est.nombre} {est.apellido}
                              </div>
                            );
                        })}
                      </ScrollArea>
                    </CardContent>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        {newEst.id != "" ? (
                          <Button
                            onClick={handleSetEst}
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
              {estudiantes.length != 0 &&
                estudiantes.map((est, index) => (
                  <CardContent
                    key={index}
                    className="p-1 m-0 border rounded-lg items-center flex justify-between"
                  >
                    <div className="font-semibold text-black">
                      {est.nombre} {est.apellido}
                    </div>
                    <form onSubmit={(e) => handleDelEst(e, est)}>
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
