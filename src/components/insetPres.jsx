import { useState, useEffect } from "react";

import CardMat from "./card-mat";
import CreateMat from "./create-mat.jsx";
import axios from "axios";
import TablaCalificaciones from "./promedios-table.jsx";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
export default function InsetPres({
  setChange,
  currentrol,
  periodo,
  change,
  cursos,
}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProm, setLoadingProm] = useState(false);
  const [state, setState] = useState({});
  const { curso } = currentrol;
  const [_curso, setCurso] = useState("");
  const [docentes, setDocentes] = useState([]);
  const [materia, setMateria] = useState(undefined);
  const [activeTab, setActiveTab] = useState("datos"); // Estado para controlar la pestaña activa
  const [tareas, setTareas] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    getCurso(curso)
      .then((data) => {
        setCurso(data);
        return getPreceptor();
      })
      .then((data) => setDocentes(data))
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [state, currentrol, change]);

  useEffect(() => {
    setMateria(undefined);
  }, [_curso]);

  useEffect(() => {
    setLoadingProm(true);
    if (materia !== undefined)
      getTareas()
        .then((data) => {
          setTareas(data);
        })
        .finally(() => setLoadingProm(false));
  }, [materia]);
  const getTareas = async () => {
    const response = await axios.get(`./api/materia/${materia.id}`);
    return response.data.materia.tareas;
  };
  const getPreceptor = async () => {
    const response = await axios.get(`./api/docente`);
    return response.data;
  };

  const getCurso = async (_curso) => {
    const response = await axios.get(`./api/curso/${_curso.curso.nombre}`);
    return response.data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }
  let estudiantes = curso.estudiantes;
  return (
    <div className="flex flex-1 flex-col items-start gap-4 flex-wrap p-1">
      <CardContent className="px-5 flex flex-col gap-3 w-full">
        <div className=" flex flex-row justify-between items-center flex-wrap">
          <div className="flex-1 flex justify-start items-center flex-wrap">
            <span className="text-2xl font-semibold mb-4 flex gap-2 ">
              <span className="">
                <i className="fa-solid fa-book text-xl"></i> Materias de
              </span>
              <span>{_curso.curso.nombre}</span>
            </span>
          </div>
          <CreateMat
            docentes={docentes}
            cursoId={_curso.curso.id}
            setChange={setChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {" "}
          {_curso.materias.map((mat, index) => (
            <CardMat
              key={index}
              materia={mat}
              docentes={docentes}
              setChange={setChange}
              className="flex-1 min-w-[120px] p-2 border rounded-lg bg-gray-100"
              setMateria={setMateria}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>
      </CardContent>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="px-5 max-w-[100%] flex flex-col self-start border-0 w-full rounded-xl pt-1"
      >
        <TabsContent value="datos">
          <div className="w-full py-1 flex flex-col items-start ">
            <CardTitle className="flex justify-start">
              <div className="flex-1 flex justify-start items-center flex-wrap">
                <span className="text-2xl font-semibold mb-4 flex gap-2">
                  <span>
                    <i className="fa-solid fa-user-graduate text-xl"></i>{" "}
                    Estudiantes de{" "}
                  </span>
                  <span>{_curso.curso.nombre}</span>
                </span>
              </div>
            </CardTitle>
            {estudiantes.length !== 0 ? (
              <CardContent>
                <ScrollArea className="whitespace-nowrap rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className=" border">Nombre</TableHead>
                        <TableHead className=" border">Apellido</TableHead>
                        <TableHead className=" border">Email</TableHead>
                        <TableHead className=" border">Usuario</TableHead>
                        <TableHead className=" text-center border">
                          <span>Familiares</span>
                          <div className="grid grid-cols-3">
                            <div className="p-1">Nombre</div>
                            <div className="p-1">Apellido</div>
                            <div className="p-1">Email</div>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estudiantes.map((estudiante, index) => (
                        <TableRow key={index}>
                          <TableCell className="p-2 border ">
                            {estudiante.nombre}
                          </TableCell>
                          <TableCell className="p-2 border ">
                            {estudiante.apellido}
                          </TableCell>
                          <TableCell className="p-2 border ">
                            {estudiante.email}
                          </TableCell>
                          <TableCell className="p-2 border ">
                            {estudiante.user}
                          </TableCell>
                          <TableCell className="m-0 p-0">
                            <div>
                              {estudiante.familiares.length !== 0 ? (
                                <Table className="m-0 p-0">
                                  <TableBody>
                                    {estudiante.familiares.map(
                                      ({ nombre, apellido, email }, index2) => {
                                        return (
                                          <TableRow key={index2 + "-" + index}>
                                            <TableCell>{nombre}</TableCell>
                                            <TableCell>{apellido}</TableCell>
                                            <TableCell>{email}</TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )}
                                  </TableBody>
                                </Table>
                              ) : (
                                <span className="p-1">
                                  No hay familiares asignados aún
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            ) : (
              <div>No hay estudiantes asignados aún</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="promedios">
          <div className="w-full py-1 flex flex-col items-start">
            <CardTitle className="flex justify-center">
              <div className="flex-1 flex justify-start items-start flex-wrap">
                <span className="text-2xl font-semibold mb-4 flex gap-2">
                  <span>
                    <i className="fa-solid fa-chart-simple text-xl"></i>{" "}
                    Promedios de{" "}
                  </span>
                  <span>{_curso.curso.nombre}</span>
                </span>
              </div>
            </CardTitle>
          </div>
          {materia !== undefined ? (
            <TablaCalificaciones
              materia={materia}
              cursos={cursos}
              curso={_curso}
              periodos={periodo}
              tareas={tareas}
              loading={loadingProm}
            />
          ) : (
            <div>
              {_curso.materias.length !== 0 ? (
                <span className="font-medium">Seleccione una materia</span>
              ) : (
                <span>No hay materias asignadas aún</span>
              )}{" "}
              <div className="flex flex-wrap">
                {_curso.materias.map((mat, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 hover:bg-accent border rounded"
                    onClick={() => setMateria(mat)}
                  >
                    {mat.nombre}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsList className="self-center grid min-w-[300px] auto-rows-fr gap-y-6 sm:grid-cols-1 md:grid-cols-2 max-h-[400px]">
          <TabsTrigger className="p-3" value="datos">
            Ver datos de los estudiantes
          </TabsTrigger>
          <TabsTrigger className="p-3" value="promedios">
            Ver promedios
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
