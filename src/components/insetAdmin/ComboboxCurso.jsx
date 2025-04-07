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

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function ComboboxDemo({
  curso,
  docentes,
  cursos,
  setState,
  estudiantes,
}) {
  const [credentials, setCredentials] = useState({
    docenteId: curso.docenteId,
  });
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(true);

  const [materias, setMaterias] = useState([]);
  const [selectProf, setSelectProf] = useState(null);

  const handleSelectProf = (doc) => {
    setSelectProf(doc);
  };

  const [credentialsMat, setCredentialsMat] = useState({
    nombre: "",
    docenteId: "",
    cursoId: curso.id,
  });
  const handleSelectMat = (doc) => {
    setCredentialsMat((prev) => ({
      ...prev,
      docenteId: doc.id,
    }));
  };
  const handleChangeMat = (e) => {
    setCredentialsMat((prev) => ({
      ...prev,
      nombre: e.target.value,
    }));
  };
  const handleSubmitMat = async (e) => {
    e.preventDefault();
    const response = await axios.post(`./api/materia`, credentialsMat);
    setCredentialsMat({
      nombre: "",
      docenteId: "",
    });
    setState((prev) => prev + 1);
  };
  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`/api/curso/${endpoint}`);
        setter(response.data.materias);
      } catch (err) {
        console.error(`Error al obtener ${endpoint}:`, err);
        setError(err);
      }
    };

    fetchData(curso.nombre, setMaterias);

    setLoading(false);
  }, [loading]);
  const handleSubmitCur = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      `./api/curso/${curso.nombre}`,
      credentials
    );
    setState((prev) => prev + 1);
  };
  const handleEditMat = async (e, mat) => {
    e.preventDefault();
    const response = await axios.put(`./api/materia/${mat.id}`, {
      docenteId: selectProf ? selectProf.id : mat.docenteId,
    });
    setState((prev) => prev + 1);
    setSelectProf(null);
  };
  const handleDelMat = async (e, mat) => {
    e.preventDefault();
    const response = await axios.delete(`./api/materia/${mat.id}`, {});
    setState((prev) => prev + 1);
  };
  const handleSelect = (doc) => {
    setCredentials((prev) => ({
      ...prev,
      docenteId: doc.id,
    }));
  };

  const estControl = estudiantes.find((est) => est.cursoId == curso.id);
  let curcontrol;
  if (estControl) curcontrol = false;
  if (!estControl) curcontrol = true;
  const handleDelCur = async (e, index) => {
    e.preventDefault();
    const response = await axios.delete(`./api/curso/${curso.nombre}`);
    setState((prev) => prev + 1);
  };

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
          <ChevronsUpDown className="h-[80%] w-[10%] shrink-0 opacity-50" />
          <div className="text-xl">{curso.nombre}</div>
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
                <DialogTitle>Editar Curso: {curso.nombre}</DialogTitle>
                <DialogDescription>
                  Cambie el preceptor a cargo
                </DialogDescription>
              </DialogHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <div>Actualizar Preceptor:</div>
                  <ScrollArea className="h-72 w-full p-1 rounded-md border">
                    {docentes.map((doc, index) => {
                      if (doc.id == credentials.docenteId)
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
                  {curso.nombre ? (
                    <form
                      onSubmit={handleSubmitCur}
                      className="flex items-center space-x-2"
                    >
                      <Button type="submit" variant="secondary">
                        Guardar
                      </Button>
                    </form>
                  ) : (
                    <Button type="submit" disabled variant="secondary">
                      Aún debe llenar campos
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
                <DialogTitle>Eliminar Curso</DialogTitle>
                <DialogDescription>{""}</DialogDescription>
              </DialogHeader>
              <CardTitle className="flex flex-col gap-2">
                Se eliminarán todas las materias y tareas junto con sus
                calificaciones de este curso, ¿Estás seguro?
              </CardTitle>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <form
                    onSubmit={handleDelCur}
                    className="flex items-center space-x-2"
                  >
                    {curcontrol ? (
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
                        No se puede eliminar porque aún hay estudiantes en él
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-row justify-center gap-2 whitespace-normal  h-auto max-w-[200px] text-center px-2 border-0 hover:bg-accent w-[30%]"
              >
                <i className="fa-solid fa-newspaper"></i>Actualizar materias
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  Materias de {curso.nombre}{" "}
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
                        <DialogTitle>Crear Materia</DialogTitle>
                        <DialogDescription>
                          Ingrese los datos de la nueva materia
                        </DialogDescription>
                      </DialogHeader>
                      <CardContent className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <div>Nombre</div>
                          <Input
                            placeholder="nombre"
                            value={credentialsMat.nombre}
                            onChange={handleChangeMat}
                            name="nombre"
                          />
                          <div>Profesor</div>
                          <ScrollArea className="h-72 w-full p-1 rounded-md border">
                            {docentes.map((doc, index) => {
                              if (doc.id == credentialsMat.docenteId)
                                return (
                                  <div
                                    onClick={() => handleSelectMat(doc)}
                                    key={index}
                                    className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                                  >
                                    {doc.nombre} {doc.apellido}
                                  </div>
                                );
                              else
                                return (
                                  <div
                                    onClick={() => handleSelectMat(doc)}
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
                          {credentialsMat.nombre != "" &&
                          credentialsMat.docenteId != "" ? (
                            <form
                              onSubmit={(e) => handleSubmitMat(e)}
                              className="flex items-center space-x-2"
                            >
                              <Button type="submit" variant="secondary">
                                Guardar
                              </Button>
                            </form>
                          ) : (
                            <Button type="submit" disabled variant="secondary">
                              Aún debe llenar campos
                            </Button>
                          )}
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </DialogTitle>
                <DialogDescription>Cree y elimine materias </DialogDescription>
              </DialogHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <ScrollArea className="h-72 w-full p-1 rounded-md border">
                    {materias.map((mat, index) => {
                      const prof = docentes.find(
                        (doc) => doc.id == mat.docenteId
                      );
                      return (
                        <div
                          key={index}
                          className="p-1 text-sm  hover:bg-accent rounded w-auto flex justify-between items-center"
                        >
                          <div className="flex-1 flex justify-center">
                            {mat.nombre}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Elegir nuevo profesor para: {mat.nombre}
                                </DialogTitle>
                                <DialogDescription>
                                  <span className="flex gap-1">
                                    Actual Profesor:{" "}
                                    <span className="flex gap-1">
                                      <span>{prof.nombre}</span>
                                      <span>{prof.apellido}</span>
                                    </span>
                                  </span>
                                </DialogDescription>
                              </DialogHeader>
                              <CardContent className="flex flex-col gap-2">
                                <ScrollArea className="h-72 w-full p-1 rounded-md border">
                                  {docentes.map((doc, index) => {
                                    if (
                                      doc.id ==
                                      (selectProf
                                        ? selectProf.id
                                        : mat.docenteId)
                                    )
                                      return (
                                        <div
                                          onClick={() => handleSelectProf(doc)}
                                          key={index}
                                          className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                                        >
                                          {doc.nombre} {doc.apellido}
                                        </div>
                                      );
                                    else
                                      return (
                                        <div
                                          onClick={() => handleSelectProf(doc)}
                                          key={index}
                                          className="p-2 text-sm border hover:bg-accent rounded w-auto"
                                        >
                                          {doc.nombre} {doc.apellido}
                                        </div>
                                      );
                                  })}
                                </ScrollArea>
                              </CardContent>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <form
                                    onSubmit={(e) => handleEditMat(e, mat)}
                                    className="flex items-center space-x-2"
                                  >
                                    <Button type="submit" variant="secondary">
                                      Guardar
                                    </Button>
                                  </form>
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
                                <i className="fa-solid fa-trash"></i>
                                Eliminar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Eliminar Materia</DialogTitle>
                                <DialogDescription>{""}</DialogDescription>
                              </DialogHeader>
                              <CardTitle className="flex flex-col gap-2">
                                Se eliminarán todas las tareas junto con las
                                calificaciones de esta materia, ¿Estás seguro?
                              </CardTitle>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <form
                                    onSubmit={(e) => handleDelMat(e, mat)}
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
                        </div>
                      );
                    })}
                  </ScrollArea>
                </div>
              </CardContent>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  {curso.nombre ? (
                    <form
                      onSubmit={handleSubmitCur}
                      className="flex items-center space-x-2"
                    >
                      <Button type="submit" variant="secondary">
                        Guardar
                      </Button>
                    </form>
                  ) : (
                    <Button type="submit" disabled variant="secondary">
                      Aún debe llenar campos
                    </Button>
                  )}
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
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
