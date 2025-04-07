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
import { CardContent, CardTitle, Card, CardDescription } from "./ui/card";
import { memo } from "react";
const TablaCalificaciones = memo(
  ({ materia, cursos, periodos, tareas, loading }) => {
    if (loading) return <div> Cargando...</div>;

    let estudiantes = cursos.find((cur) => cur.id == materia.cursoId);
    estudiantes = estudiantes.estudiantes;
    let tareasPorPeriodo = periodos.map((periodo) => {
      return {
        ...periodo,
        tareas: tareas.filter((tarea) => tarea.periodoId === periodo.id),
      };
    });

    function calcularPromedios() {
      return tareasPorPeriodo.map((periodo) => {
        return {
          nombre: periodo.nombre,
          estudiantes: estudiantes.map((estudiante) => {
            // Filtrar tareas del periodo
            let tareasPeriodo = periodo.tareas;

            // Obtener todas las calificaciones del estudiante en ese periodo
            let calificaciones = tareasPeriodo.flatMap(
              (tarea) =>
                tarea.calificaciones
                  .filter((calif) => calif.estudianteId === estudiante.id)
                  .map((calif) => calif.calificacion) // Aquí extraemos solo la propiedad
            );
            let sin_corregir = 0;
            calificaciones.map((cal) => {
              if (cal == 0) sin_corregir++;
            });
            const pendiente = tareasPeriodo.length - calificaciones.length;

            let suma = calificaciones.reduce((acc, calif) => acc + calif, 0);
            let cantidad = calificaciones.filter((cal) => cal != 0).length;
            let promedio = cantidad > 0 ? (suma / cantidad).toFixed(2) : "N/A";
            return {
              id: estudiante.id,
              nombre: estudiante.nombre,
              promedio,
              sin_corregir,
              pendiente,
            };
          }),
        };
      });
    }

    let promedios = calcularPromedios();

    return (
      <div className="w-full py-1 flex gap-3 flex-col border-0">
        <CardTitle className="flex justify-center">
          <div className="text-lg">Promedios de {materia.nombre}</div>
        </CardTitle>
        {estudiantes.length !== 0 ? (
          <CardContent>
            <ScrollArea className="whitespace-nowrap rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" border ">Estudiante</TableHead>
                    {periodos.map((per, index) => (
                      <TableHead key={index} className=" border p-2 ">
                        <div className=" flex flex-row justify-between items-center flex-wrap">
                          <div className="flex-1 flex justify-center items-center flex-wrap">
                            {per.nombre}
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudiantes.map((estudiante, index) => (
                    <TableRow key={index}>
                      <TableCell className="p-2 border ">
                        {estudiante.nombre} {estudiante.apellido}
                      </TableCell>
                      {promedios.map((periodo, index2) => {
                        const { promedio, sin_corregir, pendiente } =
                          periodo.estudiantes.find(
                            (est) => est.id === estudiante.id
                          );
                        return (
                          <TableCell key={index2}>
                            <div className="p-2 text-center  flex-col  justify-between">
                              <div>
                                Promedio:{" "}
                                {promedio != "N/A" ? promedio : "Sin dato"}
                              </div>
                              <div>Tareas sin corregir: {sin_corregir}</div>
                              <div>Tareas pendientes: {pendiente}</div>
                            </div>
                          </TableCell>
                        );
                      })}
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
        ) : (
          <div>No hay estudiantes asignados aún</div>
        )}

        <CardDescription className=" text-center">
          <div className="items-center">
            Si desea ver otra materia presione en "Ver Promedios" disponible en
            las materias listadas más arriba
          </div>
        </CardDescription>
      </div>
    );
  }
);
export default TablaCalificaciones;
