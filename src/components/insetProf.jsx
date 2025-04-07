import { useState, useEffect } from "react";

import Lists from "./list-task-doc";
import CorregirSingle from "./corregir-single.jsx";
import CorregirVarious from "./corregir-various.jsx";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
export default function InsetProf({ currentrol, periodo }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({});
  const { materia, curso } = currentrol;
  const [_materia, setMateria] = useState("");
  const getMateria = async (_materia) => {
    const response = await axios.get(`./api/materia/${_materia.id}`);
    return response.data;
  };
  function TablaCalificaciones({ materia }) {
    const estudiantes = _materia.curso.estudiantes;
    const tareas = _materia.tareas;

    return (
      <div className="w-full">
        <CardTitle className="flex flex-col justify-center">
          <div className="flex-1 flex justify-start items-center flex-wrap">
            <span className="text-2xl font-semibold mb-4 flex gap-2">
              <span>
                <i className="fa-solid fa-check text-xl"></i> Calificaciones
              </span>
            </span>
          </div>
          {tareas.length !== 0 && estudiantes.length !== 0 && (
            <CardDescription className="p-2">
              La opción "Corregir Varios" agiliza la corrección de múltiples
              estudiantes al mismo tiempo.
            </CardDescription>
          )}
        </CardTitle>
        <ScrollArea className="whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {estudiantes.length !== 0 && (
                  <TableHead className=" border">Estudiantes</TableHead>
                )}
                {tareas.map((tarea) => (
                  <TableHead key={tarea.id} className=" border p-2 ">
                    <div className=" flex flex-row justify-between items-center flex-wrap">
                      <div className="flex-1 flex justify-center items-center flex-wrap">
                        {tarea.nombre}
                      </div>
                      {estudiantes.length !== 0 && (
                        <CorregirVarious
                          tarea={tarea}
                          setState={setState}
                          estudiantes={estudiantes}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantes.map((estudiante) => (
                <TableRow key={estudiante.id}>
                  <TableCell className="p-2 border ">
                    {estudiante.nombre} {estudiante.apellido}
                  </TableCell>
                  {tareas.map((tarea) => {
                    const calificacion = tarea.calificaciones.find(
                      (cal) => cal.estudianteId === estudiante.id
                    );
                    return (
                      <TableCell
                        key={tarea.id}
                        className="p-2 text-center border"
                      >
                        {calificacion ? (
                          calificacion.calificacion == 0 ? (
                            <div className="flex flex-row justify-around items-center flex-wrap">
                              Entregado
                              <CorregirSingle
                                setState={setState}
                                estudiante={estudiante}
                                tarea={tarea}
                              />
                            </div>
                          ) : (
                            calificacion.calificacion
                          )
                        ) : (
                          "Pendiente"
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>{" "}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {tareas.length == 0 ? (
          <div className="flex flex-col justify-center mt-3 p-0">
            <CardContent className="">
              Aún no hay tareas creadas{" "}
              {estudiantes.length == 0 && "ni tampoco estudiantes asignados"}
            </CardContent>
          </div>
        ) : (
          estudiantes.length == 0 && (
            <div className="flex flex-col justify-center mt-3 p-0">
              <CardContent>No hay estudiantes asignados </CardContent>
            </div>
          )
        )}
      </div>
    );
  }

  useEffect(() => {
    setLoading(true);
    getMateria(materia)
      .then((data) => setMateria(data.materia))
      .then(() => setLoading(false))
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [state, currentrol]);

  if (loading) {
    return (
      <div className="flex items-center  h-[50vh] justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="flex flex-1 flex-col gap-4 flex-wrap  p-2">
      <div className="flex flex-1 flex-col gap-4 flex-wrap w-full p-2">
        <Lists
          tags={_materia.tareas}
          materiaId={_materia.id}
          materia={materia}
          setState={setState}
          periodo={periodo}
        />

        <TablaCalificaciones></TablaCalificaciones>
      </div>
    </div>
  );
}
