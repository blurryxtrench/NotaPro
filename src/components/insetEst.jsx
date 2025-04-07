import { useState, useEffect } from "react";
import { format } from "date-fns";

import Lists from "./list-task-est";
import axios from "axios";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { es } from "date-fns/locale";

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
import { CardTitle } from "./ui/card";
export default function InsetEst({ currentrol, periodo, estudianteId, notas }) {
  const { materia } = currentrol;
  const materiaId = materia.id;

  const [_calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState(0);
  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await axios.get(
          `/api/calificacion/${estudianteId}/${materiaId}`
        );
        setCalificaciones(response.data);
      } catch (err) {
        console.error("Error al obtener calificaciones:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, [currentrol, state]);
  const docenteNombre = materia.docente.nombre + " " + materia.docente.apellido;
  return loading ? (
    <div className="flex items-center h-[50vh] justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-4 flex-wrap w-full p-2">
      <CardTitle>
        <div className=" flex  justify-around font-medium">
          <div className="flex flex-1 justify-start gap-1">
            Materia: <span className="font-normal">{materia.title}</span>
          </div>
          <div className="flex gap-4 justify-end ">
            <div>
              Profesor: <span className="font-normal">{docenteNombre}</span>
            </div>
            <div>
              Email del profesor:{" "}
              <span className="font-normal">{materia.docente.email}</span>
            </div>
          </div>
        </div>
      </CardTitle>
      {materia.tareas.length !== 0 && (
        <Lists
          _calificaciones={_calificaciones}
          estudianteId={estudianteId}
          tags={materia.tareas}
          materiaNombre={materia.nombre}
          periodo={periodo}
          setState={setState}
          state={state}
        />
      )}
      {materia.tareas.length == 0 && <div>No hay tareas asignadas</div>}
      {materia.tareas.length !== 0 && (
        <div className="w-full">
          <ScrollArea className="whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    Nombre de la tarea
                  </TableHead>
                  <TableHead>Fecha de Publicacion</TableHead>
                  <TableHead>Fecha de Entrega</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead className="text-right">Período</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {_calificaciones.map(
                  (
                    {
                      nombre,
                      fechaEntrega,
                      fechaPublicacion,
                      periodoId,
                      calificaciones,
                    },
                    index
                  ) => {
                    let _periodo = periodo.find((per) => per.id == periodoId);
                    _periodo = _periodo.nombre;
                    let nota =
                      calificaciones.length === 0
                        ? { estado: "pendiente", calificacion: "Sin dato" }
                        : calificaciones[0];
                    nota.calificacion =
                      nota.calificacion === 0 ? "Sin dato" : nota.calificacion;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{nombre}</TableCell>
                        <TableCell>
                          {format(fechaPublicacion, "PPP", { locale: es })}
                        </TableCell>
                        <TableCell>
                          {format(fechaEntrega, "PPP", { locale: es })}
                        </TableCell>
                        <TableCell>{nota.estado}</TableCell>
                        <TableCell>{nota.calificacion}</TableCell>
                        <TableCell className="text-right">{_periodo}</TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
