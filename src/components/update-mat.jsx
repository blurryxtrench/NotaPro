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
import { Checkbox } from "./ui/checkbox";

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

export default function UpdateMat({ setChange, docente, materia, docentes }) {
  const [select, setSelect] = useState(docente);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [_docente, setDocente] = useState(docente);
  const [nombre, setNombre] = useState(materia.nombre);

  const handleChangeDocente = (e) => {
    e.preventDefault();
    setDocente(select);
  };
  const handleChangeNombre = (e) => {
    setNombre(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = materia.id;
    const response = await axios.put(`./api/materia/${id}`, {
      docenteId: _docente.id,
      nombre,
    });
    setChange((prev) => prev + 1);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = materia.id;
    const response = await axios.delete(`/api/materia/${id}`);
    setChange((prev) => prev + 1);
  };
  const handleSelect = (doc) => {
    setSelect(doc);
  };

  return (
    <div className="flex flex-row gap-1 justify-between flex-wrap">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 flex-row justify-center gap-1"
          >
            <i className="fa-solid fa-pen-to-square"></i> Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar materia</DialogTitle>
            <DialogDescription>
              puedes cambiar el profesor y el nombre
            </DialogDescription>
          </DialogHeader>
          <CardTitle className="flex flex-col gap-4">
            <div>Nombre</div>
            <Input onChange={handleChangeNombre} value={nombre} />
            <div>
              Docente Actual: {_docente.nombre} {_docente.apellido}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-row justify-center gap-0.5"
                >
                  <i className="fa-solid fa-pen-to-square"></i>Cambiar Profesor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cambiar de profesor</DialogTitle>
                </DialogHeader>
                <div className="flex flex-row flex-wrap gap-1">
                  {docentes.map((doc, index) =>
                    doc.id == select.id ? (
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
                    <form
                      onSubmit={handleChangeDocente}
                      className="flex items-center space-x-2"
                    >
                      <Button type="submit" variant="primary">
                        Guardar
                      </Button>
                    </form>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <form
                onSubmit={handleSubmit}
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
            className="flex-row flex-1 justify-center gap-1"
          >
            <i className="fa-solid fa-trash"></i> Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Materia</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <CardTitle className="flex flex-col gap-2">
            Se eliminarán todas las tareas junto con sus calificaciones de esta
            materia, ¿Estás seguro?
          </CardTitle>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <form
                onSubmit={handleDelete}
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
}
