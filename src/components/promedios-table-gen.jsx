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

export default function TablaGen({ curso, periodos }) {
  const promediosAll = curso.materias.map(({ tareas, nombre }) => {
    let tareasPorPeriodo = periodos.map((periodo) => {
      return {
        ...periodo,
        tareas: tareas.filter((tarea) => tarea.periodoId === periodo.id),
      };
    });

    function calcularPromedios() {
      return tareasPorPeriodo.map((periodo) => {
        let tareasPeriodo = periodo.tareas;
        let calificaciones = tareasPeriodo.filter(
          (tar) => tar.calificaciones.length != 0
        );
        calificaciones = calificaciones.flatMap(
          (tarea) => tarea.calificaciones[0].calificacion
        );
        let sin_corregir = 0;
        calificaciones.map((cal) => {
          if (cal == 0) sin_corregir++;
        });
        const pendiente = tareasPeriodo.length - calificaciones.length;

        let suma = calificaciones.reduce((acc, calif) => acc + calif, 0);
        let cantidad = calificaciones.filter((cal) => cal != 0).length;
        let promedio = cantidad > 0 ? (suma / cantidad).toFixed(2) : "Sin Dato";

        return {
          nombre: periodo.nombre,
          promedio,
          sin_corregir,
          pendiente,
        };
      });
    }

    let promedios = calcularPromedios();
    return {
      nombre,
      promedios,
    };
  });

  return (
    <Card className="w-full">
      <CardTitle className="flex justify-center">
        <div>Promedios Generales</div>
      </CardTitle>
      <CardContent>
        <ScrollArea className="whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" border">Materia</TableHead>
                {periodos.map((per, index) => (
                  <TableHead key={index}>{per.nombre}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {promediosAll.map((mat, index) => (
                <TableRow key={index}>
                  <TableCell className="p-2 border ">{mat.nombre}</TableCell>
                  {mat.promedios.map((pro, index) => (
                    <TableCell key={index} className="p-2 border ">
                      {pro.promedio}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Pendientes</TableCell>
              <TableCell className="text-right">faltan 4</TableCell>
            </TableRow>
          </TableFooter> */}
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
