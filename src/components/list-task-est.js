import * as React from "react";
import { useState } from "react";

import axios from "axios";
import { Button } from "./ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function Lists({
  tags,
  periodo,
  _calificaciones,
  estudianteId,
  setState,
}) {
  const [calificaciones, setCalificaciones] = useState(_calificaciones);
  if (calificaciones != _calificaciones) setCalificaciones(_calificaciones);
  async function handleSubmit(e, tareaId) {
    e.preventDefault();
    try {
      await axios.put(`./api/tarea/${tareaId}/${estudianteId}`, {});
    } catch (error) {
      console.log(error);
    }
    setState((prev) => prev + 1);
  }

  // if (loading) return <div>cargando...</div>;
  // if (error) return <div>{error}</div>;

  return (
    <div className="w-full">
      <CardContent>
        <div>
          <div className="flex flex-col gap-3">
            <div className="">
              <h2 className="text-2xl font-bold mb-4 flex items-center"><i className="fa-solid fa-clipboard "></i> Tareas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag, index) => {
                  let entrega = calificaciones.find((cal) => {
                    if (!cal.calificaciones) return false;
                    if (cal.calificaciones[0]?.tareaId == tag.id) return true;
                  });
                  let fechaPublicacion = new Date(tag.fechaPublicacion);
                  let fechaEntrega = new Date(tag.fechaEntrega);
                  fechaPublicacion = fechaPublicacion.toLocaleDateString(
                    "es-ES",
                    {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    }
                  );
                  fechaEntrega = fechaEntrega.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  });

                  const _periodo = periodo.find(
                    ({ id }) => id == tag.periodoId
                  );
                  return (
                    <div
                      key={index}
                      className="bg-white p-1 rounded-lg hover:bg-accent flex flex-col gap-2"
                    >
                      <CardHeader className="flex pt-2 flex-row justify-between">
                        <CardTitle>{tag.nombre}</CardTitle>
                        {entrega == undefined ? (
                          <form onSubmit={(e) => handleSubmit(e, tag.id)}>
                            <Button
                              type="submit"
                              className="bg-accent text-black hover:text-accent"
                            >
                              <i className="fa-solid fa-file-import"></i>{" "}
                              Entregar
                            </Button>
                          </form>
                        ) : entrega.calificaciones[0].estado == "entregado" ? (
                          <Button
                            type="button"
                            className=" disabled bg-accent text-black hover:bg-accent"
                          >
                            Entregado
                          </Button>
                        ) : entrega.calificaciones[0].estado == "corregido" ? (
                          <Button
                            type="button"
                            className=" disabled bg-accent text-black hover:bg-accent"
                          >
                            Corregido: {entrega.calificaciones[0].calificacion}
                          </Button>
                        ) : (
                          ""
                        )}
                      </CardHeader>
                      <CardContent>{tag.descripcion}</CardContent>
                      <CardFooter className="flex justify-between">
                        <CardDescription>
                          <div className="flex flex-col">
                            <div>{_periodo.nombre}</div>
                            <div>Fecha de Publcación: {fechaPublicacion}</div>
                            <div>Fecha de Entrega: {fechaEntrega}</div>
                          </div>
                        </CardDescription>
                      </CardFooter>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
