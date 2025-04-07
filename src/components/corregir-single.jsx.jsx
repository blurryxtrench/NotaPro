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

export default function CorregirSingle({ estudiante, tarea, setState }) {
  const [calificacion, setCalificacion] = useState();
  const handleChange = (e) => {
    setCalificacion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `./api/tarea/${tarea.id}/${estudiante.id}`,
      { calificacion: calificacion }
    );
    setState((prev) => prev + 1);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2"
        >
          <i className="fa-solid fa-plus"></i>Corregir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Corregir</DialogTitle>
          <DialogDescription>
            Ingrese la calificacion de {estudiante.nombre}
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>Calificacion</div>
            <Input
              name="calificacion"
              type="number"
              onChange={handleChange}
              value={calificacion}
              placeholder="Calificacion"
            />
          </div>
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {calificacion ? (
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
                {""}
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
