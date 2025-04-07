import { useState } from "react";

import axios from "axios";
import { CardContent } from "./ui/card";

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

export default function CreateTask({ setState, materiaId, periodos }) {
  const [select, setSelect] = useState("");
  const [tarea, setTarea] = useState({
    nombre: "",
    descripcion: "",
    fechaEntrega: "",
    materiaId,
  });
  const [date, setDate] = useState(tarea.fechaEntrega);

  const handleChange = (e) => {
    setTarea({ ...tarea, [e.target.name]: e.target.value });
  };

  const handleCalendar = (fechaStr) => {
    setDate(fechaStr);
    const fecha = fechaStr.toUTCString(); // Ejemplo: "Sat, 29 Mar 2025 00:00:00 GMT"
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
    const fechaFormateada = `${year}-${mes}-${dia}T${horas}:${minutos}:${segundos}.000Z`;
    setTarea({ ...tarea, fechaEntrega: fechaFormateada });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tarea.nombre) return console.log("debe llenar el campo");
    if (!tarea.descripcion) return console.log("debe llenar el campo");
    if (!tarea.fechaEntrega) tarea.fechaEntrega = new Date();
    if (select == {}) return console.log("debe llenar el campo");

    try {
      await axios.post(`./api/tarea`, tarea);
    } catch (error) {
      console.log(error);
    }
    setTarea({
      nombre: "",
      descripcion: "",
      fechaEntrega: "",
      materiaId,
    });
    setDate("");
    setSelect("");
    setState(e);
  };
  const handleSelect = (per) => {
    tarea.periodoId = per.id;
    setSelect(per);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2"
        >
          <i className="fa-solid fa-plus"></i>Nueva Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Crear tarea</DialogTitle>
          <DialogDescription>
            Ingrese los datos de la nueva tarea
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>Nombre</div>
            <Input
              name="nombre"
              onChange={handleChange}
              value={tarea.nombre}
              placeholder="Debe completar este campo"
            />
            <div>Descripcion</div>
            <Input
              name="descripcion"
              onChange={handleChange}
              value={tarea.descripcion}
              placeholder="debe completar este campo"
            />
          </div>
          <div>Fecha de entrega</div>
          <CalendarPicker date={date} setDate={handleCalendar} />
          <div>Período</div>
          <div className="flex flex-row gap-1 flex-wrap">
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
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {tarea.nombre !== "" &&
            tarea.descripcion !== "" &&
            tarea.fechaEntrega &&
            select !== "" ? (
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
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
