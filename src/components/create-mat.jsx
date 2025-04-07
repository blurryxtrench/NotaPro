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
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import CalendarPicker from "./calendarPicker";

export default function CreateMat({ cursoId, docentes, setChange }) {
  const [select, setSelect] = useState(undefined);
  const [materia, setMateria] = useState({
    nombre: "",
    docenteId: undefined,
    cursoId: cursoId,
  });

  const handleChangeNombre = (e) => {
    setMateria({ ...materia, [e.target.name]: e.target.value });
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    setMateria({
      nombre: "",
      docenteId: undefined,
      cursoId: undefined,
    });
    setSelect("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (materia.nombre == "") return console.log("debe llenar el campo");
    if (!materia.docenteId) return console.log("debe llenar el campo");

    const response = await axios.post(`/api/materia`, materia);
    setMateria({
      nombre: "",
      docenteId: undefined,
      cursoId: undefined,
    });
    setSelect("");
    setChange((prev) => prev + 1);
  };
  const handleSelect = (doc) => {
    setMateria((prevMateria) => ({
      ...prevMateria,
      docenteId: doc.id,
    }));
    setSelect(doc);
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-row justify-center gap-2 px-2"
          >
            <i className="fa-solid fa-plus"></i>Nueva Materia
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Materia</DialogTitle>
            <DialogDescription>
              Ingrese los datos de la nueva Materia
            </DialogDescription>
          </DialogHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div>Nombre</div>
              <Input
                name="nombre"
                onChange={handleChangeNombre}
                value={materia.nombre}
                placeholder="Debe completar este campo"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-row justify-center gap-0.5"
                  >
                    <div className="flex justify-start flex-1 items-center">
                      <div className="min-w-[20%] ">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </div>
                      {select == undefined ? (
                        "Elegir Profesor"
                      ) : (
                        <div className="flex gap-2">
                          <div>Profesor:</div>
                          {select.nombre} {select.apellido}
                        </div>
                      )}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Elegir profesor</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-row flex-wrap gap-1">
                    {docentes.map((doc, index) =>
                      doc.id == materia.docenteId ? (
                        <div
                          onClick={() => handleSelect(doc)}
                          key={index}
                          className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                        >
                          {doc.nombre} {doc.apellido}
                        </div>
                      ) : (
                        <div
                          onClick={() => handleSelect(doc)}
                          key={index}
                          className="p-2 text-sm border hover:bg-accent rounded w-auto"
                        >
                          {doc.nombre} {doc.apellido}
                        </div>
                      )
                    )}
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      {materia.docenteId ? (
                        <Button type="button" variant="secondary">
                          Guardar
                        </Button>
                      ) : (
                        <Button type="submit" disabled variant="secondary">
                          Elija el docente
                        </Button>
                      )}
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="flex justify-around flex-1">
                {materia.nombre && select != undefined ? (
                  <form
                    onSubmit={handleSubmit}
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
                <form onSubmit={handleCancel}>
                  <Button type="submit" variant="secondary">
                    Cancelar
                  </Button>
                </form>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
