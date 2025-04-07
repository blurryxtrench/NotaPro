import { useState } from "react";

import axios from "axios";
import { CardTitle } from "./ui/card";
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
import CalendarPicker from "./calendarPicker";

export default function DialogCloseButton({
  _tarea,
  setState,
  periodos,
  periodo,
}) {
  const [tarea, setTarea] = useState(_tarea);
  const [date, setDate] = useState(_tarea.fechaEntrega);
  const [select, setSelect] = useState(periodo);
  const handleChange = (e) => {
    setTarea({ ...tarea, [e.target.name]: e.target.value });
  };
  const handleCalendar = (fechaStr) => {
    setDate(fechaStr);
    const fecha = fechaStr.toUTCString(); // Ejemplo: "Sat, 29 Mar 2025 00:00:00 GMT"

    // Usamos replace() para capturar las partes de la fecha
    let dia, mesTexto, year, horas, minutos, segundos;

    fecha.replace(
      /(\w+), (\d+) (\w+) (\d+) (\d+):(\d+):(\d+)/,
      (_, __, _dia, _mesTexto, _year, _horas, _minutos, _segundos) => {
        dia = _dia;
        mesTexto = _mesTexto;
        year = _year;
        horas = _horas;
        minutos = _minutos;
        segundos = _segundos;
      }
    );
    const meses = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const mes = meses[mesTexto];

    // const fecha = "hola";
    const fechaFormateada = `${year}-${mes}-${dia}T${horas}:${minutos}:${segundos}.000Z`;

    setTarea({ ...tarea, fechaEntrega: fechaFormateada });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = tarea.id;
    try {
      await axios.put(`./api/tarea/${id}`, tarea);
    } catch (error) {
      console.log(error);
    }
    setState((prev) => prev + 1);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = tarea.id;
    try {
      await axios.delete(`./api/tarea/${id}`);
    } catch (error) {
      console.log(error);
    }
    setState((prev) => prev + 1);
  };
  const handleSelect = (per) => {
    tarea.periodoId = per.id;
    setSelect(per);
  };
  return (
    <div className="flex flex-col gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-row justify-center gap-0.5">
            <i className="fa-solid fa-pen-to-square"></i>Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar tarea</DialogTitle>
            <DialogDescription>
              Recuerda guardar los nuevos datos
            </DialogDescription>
          </DialogHeader>
          <CardTitle className="flex flex-col gap-2">
            <div>Nombre</div>
            <Input name="nombre" onChange={handleChange} value={tarea.nombre} />
            <div>Descripcion</div>
            <Input
              name="descripcion"
              onChange={handleChange}
              value={tarea.descripcion}
            />
          </CardTitle>
          <div>Cambiar fecha de entrega</div>
          <CalendarPicker date={date} setDate={handleCalendar} />
          <div>Cambiar Período</div>
          <div>Período</div>
          <div className="flex flex-row gap-1">
            {periodos.map((per, index) =>
              per == select ? (
                <div
                  onClick={() => handleSelect(per)}
                  key={index}
                  className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                >
                  {per.nombre}
                </div>
              ) : (
                <div
                  onClick={() => handleSelect(per)}
                  key={index}
                  className="p-2 text-sm border hover:bg-accent rounded w-auto"
                >
                  {per.nombre}
                </div>
              )
            )}
          </div>
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
          <Button variant="outline" className="flex-row justify-center gap-0.5">
            <i className="fa-solid fa-trash"></i>
            Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar tarea</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
          </DialogHeader>
          <CardTitle className="flex flex-col gap-2">
            Se eliminarán todas las calificaciones de esta tarea, ¿Estás seguro?
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
