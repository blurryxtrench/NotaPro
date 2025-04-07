import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import axios from "axios";

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
import { useState, useEffect } from "react";
import { CardContent, CardTitle, Card } from "./ui/card";

export default function TablaCalificaciones({ materia, periodos, estudiante }) {
  const tareas = materia.tareas;
  let sin_corregir = 0;
  let entregadas = 0;
  let pendiente = 0;
  function calcularPromedios() {
    tareas.map((tar) => {
      console.log(tar.calificaciones);
      let calificacion =
        tar.calificaciones.length != 0 ? tar.calificaciones[0] : null;

      if (calificacion) {
        entregadas++;
        if (calificacion.calificacion == 0) sin_corregir++;
      } else {
        pendiente++;
      }
    });
    return {
      sin_corregir,
      pendiente,
      entregadas,
    };
  }

  let promedios = calcularPromedios();
  return <div className="m-0 p-0 w-full flex flex-col gap-4"></div>;
}
