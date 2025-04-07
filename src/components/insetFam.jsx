import { useState, useEffect } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "./lib/utils";
import axios from "axios";
import { Separator } from "@radix-ui/react-separator";
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
import { Button } from "./ui/button";
import TablaGen from "./promedios-table-gen.jsx";

export default function InsetFam({ currentrol, periodos, familiar, docentes }) {
  const { estudiante } = currentrol;
  const [materia, setMateria] = useState([]);
  const pres = docentes.find((doc) => doc.id == estudiante.curso.docenteId);

  function TablaCalificaciones({ materia }) {
    const tareas = materia.tareas;
    return (
      <div className="w-auto flex flex-col gap-4 justify-center border-0">
        <CardTitle className="flex flex-col gap-2 justify-start">
          <div className="flex gap-2 justify-center">
            <i className="fa-solid fa-clipboard "></i> Tareas
          </div>{" "}
          <Data materia={materia} component="tabla"></Data>
        </CardTitle>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className=" border">Tareas</TableHead>
              <TableHead className=" border">Estado</TableHead>
              <TableHead className=" border">Calificacion</TableHead>
              <TableHead className=" border">Periodo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tareas.map((tar, index) => {
              const periodo = periodos.find((per) => per.id == tar.periodoId);
              const estado =
                tar.calificaciones.length == 0
                  ? "sin entregar"
                  : tar.calificaciones[0].estado;
              const calificacion =
                tar.calificaciones.length == 0
                  ? "Sin Dato"
                  : tar.calificaciones[0].calificacion == 0
                  ? "Sin dato"
                  : tar.calificaciones[0].calificacion;
              return (
                <TableRow key={index}>
                  <TableCell className="p-2 border ">{tar.nombre}</TableCell>
                  <TableCell className="p-2 border ">{estado}</TableCell>
                  <TableCell className="p-2 border ">{calificacion}</TableCell>
                  <TableCell className="p-2 border ">
                    {periodo.nombre}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
  const Data = ({ materia, component }, index) => {
    let entregadas = 0;
    let corregidas = 0;
    let pendiente = 0;

    function calcularPromedios() {
      const tareas = materia.tareas;

      tareas.map((tar) => {
        console.log(tar.calificaciones);
        let calificacion =
          tar.calificaciones.length != 0 ? tar.calificaciones[0] : null;
        console.log(calificacion);
        if (calificacion) {
          if (calificacion.estado == "entregado") entregadas++;
          if (calificacion.estado == "corregido") corregidas++;
        } else {
          pendiente++;
        }
      });
      return {
        publicadas: materia.tareas.length,
        corregidas,
        entregadas,
        pendiente,
      };
    }
    console.log(materia);
    let promedios = materia.tareas == undefined ? null : calcularPromedios();
    return component == "tabla"
      ? promedios && (
          <div key={index} className="flex justify-between gap-2 flex-wrap">
            <p className="text-gray-600">
              Tareas sin entregar: {promedios.pendiente}
            </p>
            <p className="text-gray-600">
              Tareas corregidas: {promedios.corregidas}
            </p>
          </div>
        )
      : promedios && (
          <div key={index}>
            <p className="text-gray-600">
              Tareas publicadas: {promedios.publicadas}
            </p>
          </div>
        );
  };
  return (
    <div className="flex flex-col gap-0 flex-wrap p-1 w-[100%]">
      <CardTitle>
        <div className="flex justify-between font-medium">
          <div className="flex flex-col justify-center">
            <div className="flex gap-1 hover:bg-accent p-2 rounded-xl">
              Estudiante:{" "}
              <span className="font-normal">{estudiante.nombre}</span>
            </div>
          </div>
          <div className=" flex gap-2 ">
            <div className=" hover:bg-accent p-2 rounded-xl">
              Curso:{" "}
              <span className="font-normal">{estudiante.curso.nombre}</span>
            </div>
            <div className=" hover:bg-accent p-2 rounded-xl">
              Preceptor:{" "}
              <span className="font-normal">
                {pres.nombre} {pres.apellido}
              </span>
            </div>
            <div className=" hover:bg-accent p-2 rounded-xl">
              Email del Preceptor:{" "}
              <span className="font-normal">{pres.email}</span>
            </div>
          </div>
        </div>
      </CardTitle>
      <div className=" pt-5 flex flex-col gap-3 justify-center w-full">
        {estudiante.curso.materias.length != 0 ? (
          <div>
            <div className="flex flex-col gap-3">
              <div className="">
                <h2 className="text-2xl font-bold mb-4 flex gap-2 items-center">
                  <i className="fa-solid fa-book text-xl"></i> Materias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {estudiante.curso.materias.map((materia) => {
                    const doc = docentes.find(
                      (doc) => doc.id == materia.docenteId
                    );
                    return (
                      <div
                        key={materia.id}
                        className="bg-white p-4 rounded-lg hover:bg-accent flex flex-col gap-2"
                      >
                        <h3 className="text-lg font-semibold">
                          {materia.nombre}
                        </h3>
                        <p className="text-gray-600">
                          Profesor: {doc.nombre} {doc.apellido}
                        </p>
                        <p className="text-gray-600">Email: {doc.email}</p>
                        <Data materia={materia} component="card" />

                        <Dialog className="max-w-[800px]">
                          <DialogTrigger>
                            <span className="font-medium hover:cursor-pointer p-2 rounded-xl flex justify-start gap-2 items-center">
                              <i className="fa-solid fa-square-poll-vertical"></i>{" "}
                              Calificaciones
                            </span>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogTitle>
                              Calificaciones de {estudiante.nombre}
                            </DialogTitle>
                            <ScrollArea
                              className={cn(
                                "whitespace-nowrap rounded-md w-auto p-2",
                                estudiante.curso.materias.length == 1
                                  ? "h-[201px]"
                                  : estudiante.curso.materias == 2
                                  ? "h-[243px]"
                                  : estudiante.curso.materias == 3
                                  ? "h-[285px]"
                                  : "h-[285px]"
                              )}
                            >
                              {materia.tareas.length ? (
                                <div className="flex flex-col flex-wrap m-0 p-0 items-center gap-5">
                                  <div className="w-auto">
                                    <TablaCalificaciones materia={materia} />
                                  </div>
                                </div>
                              ) : (
                                <div className="px-5">No hay tareas aún</div>
                              )}
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator></Separator>
            </div>

            <TablaGen curso={estudiante.curso} periodos={periodos} />
          </div>
        ) : (
          <div className="my-5 text-black font-semibold text-lg">
            Bienvenido, aún no hay materias asignadas al curso de{" "}
            {estudiante.nombre}
          </div>
        )}{" "}
      </div>
    </div>
  );
}
