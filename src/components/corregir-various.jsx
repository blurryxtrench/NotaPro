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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function CorregirVarious({ tarea, setState, estudiantes }) {
  const [calificaciones, setCalificaciones] = useState(tarea.calificaciones);
  const [count, setCount] = useState(0);

  // const [estudiante, setEstudiante] = useState({});
  // if (calificaciones.length != 0) {
  //   setCalificaciones(tarea.calificaciones);
  // }

  const handleInput = (e) => {
    const { value, name } = e.target;
    if (value == "") {
      setCalificaciones((prevCalificaciones) =>
        prevCalificaciones.map((cal) =>
          cal.estudianteId === Number(e.target.name)
            ? { ...cal, estado: "entregado", calificacion: 0 } // Modifica solo esta propiedad
            : cal
        )
      );
    } else {
      setCalificaciones((prevCalificaciones) =>
        prevCalificaciones.map((cal) =>
          cal.estudianteId === Number(e.target.name)
            ? { ...cal, calificacion: e.target.value } // Modifica solo esta propiedad
            : cal
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const array = calificaciones.map((cal) => {
      const { id, tareaId, estado, ...resto } = cal; // Elimina 'calificacion'
      return resto; // Devuelve el objeto sin esa propiedad
    });
    const response = await axios.post(`./api/tarea/${tarea.id}/`, {
      array,
    });

    setState((prev) => prev + 1);
  };
  console.log(calificaciones);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2"
        >
          <i className="fa-solid fa-plus"></i>Corregir Varios
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Corregir Varios</DialogTitle>
          <DialogDescription>
            Ingrese o actualice la calificacion de varios estudiantes
            <span className="font-normal">
              {" "}
              Si deseas eliminar tu correccion, puedes presionar la calificacion
              y presionar la letra e
            </span>
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <Table>
            {/* <TableCaption>Holaaaa</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Estudiante</TableHead>

                <TableHead className="">{tarea.nombre}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantes.map((estudiante) => {
                let cal = calificaciones.find(
                  (_cal) => _cal.estudianteId === estudiante.id
                );

                return (
                  <TableRow key={estudiante.id}>
                    <TableCell className=" p-2">
                      {estudiante.nombre} {estudiante.apellido}{" "}
                    </TableCell>

                    <TableCell className=" p-2">
                      {cal !== undefined ? (
                        cal.calificacion == 0 ? (
                          <Input
                            name={estudiante.id}
                            placeholder="entregado"
                            onChange={handleInput}
                            value="entregado"
                          />
                        ) : (
                          <Input
                            name={estudiante.id}
                            value={cal.calificacion}
                            onChange={handleInput}
                            type="number"
                          />
                        )
                      ) : (
                        "Pendiente"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Pendientes</TableCell>
            <TableCell className="text-right">faltan 4</TableCell>
          </TableRow>
        </TableFooter> */}
          </Table>
        </CardContent>
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
  );
}
