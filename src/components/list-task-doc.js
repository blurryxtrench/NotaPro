import * as React from "react";

import { CardContent, CardDescription, CardTitle } from "./ui/card";

import UpdateTask from "./updateTask";
import CreateTask from "./createTask";

export default function Lists({ tags, setState, materiaId, periodo, materia }) {
  return (
    <div className="w-full">
      <CardContent>
        <div className=" flex flex-row justify-between items-center flex-wrap">
          <CardTitle className="flex justify-center">
            <div className="flex-1 flex justify-start items-center flex-wrap">
              <span className="text-2xl font-semibold mb-4 flex gap-2">
                <span>
                  <i className="fa-solid fa-clipboard text-xl"></i> Tareas de{" "}
                </span>
                <span>{materia.nombre},</span>
                <span>{materia.curso.nombre}</span>
              </span>
            </div>
          </CardTitle>
          <CreateTask
            setState={setState}
            materiaId={materiaId}
            periodos={periodo}
          />
        </div>

        {tags.length !== 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {tags.map((tag, index) => {
              let fechaPublicacion = new Date(tag.fechaPublicacion);
              let fechaEntrega = new Date(tag.fechaEntrega);
              fechaPublicacion = fechaPublicacion.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              });
              fechaEntrega = fechaEntrega.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              });

              const _periodo = periodo.find(({ id }) => id == tag.periodoId);
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg hover:bg-accent flex-1 flex flex-col gap-2"
                >
                  {" "}
                  <CardTitle>{tag.nombre}</CardTitle>
                  <CardContent>{tag.descripcion}</CardContent>
                  <CardDescription>
                    <div className="flex flex-col">
                      <div>{_periodo.nombre}</div>
                      <div>Fecha de Publcación: {fechaPublicacion}</div>
                      <div>Fecha de Entrega: {fechaEntrega}</div>
                    </div>
                  </CardDescription>
                  <UpdateTask
                    _tarea={tag}
                    setState={setState}
                    periodos={periodo}
                    periodo={_periodo}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
}
