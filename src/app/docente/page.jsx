"use client";
import { AppSidebar } from "../../components/app-sidebar-doc";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Separator } from "../../components/ui/separator";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import UpdateUser from "../../components/update-perfil.jsx";

import InsetProf from "../../components/insetProf.jsx";
import InsetInicio from "../../components/insetInicio.jsx";
import InsetPres from "../../components/insetPres.jsx";

export default function Page() {
  const [user, setUser] = useState([]);
  const [profesor, setProfesor] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(0);

  const [currentRol, setCurrentRol] = useState({
    rol: "inicio",
    curso: "",
    materia: {},
  });
  const [periodo, setPeriodo] = useState([]);

  const agregarCursoNombre = (materias, cursos) => {
    return materias.map((materia) => {
      const curso = cursos.find((curso) => curso.id === materia.cursoId);
      return {
        ...materia,
        cursoNombre: curso ? curso.nombre : "Curso no encontrado",
        estudiantes: curso ? curso.estudiantes : "Curso no encontrado",
      };
    });
  };
  const handleRol = (e) => {
    setCurrentRol(e);
  };
  const getUser = async () => {
    const response = await axios.get("./api/perfil");
    let _user = response.data.user;
    _user = _user.id;
    _user = await axios.get(`./api/docente/${_user}`);
    return _user.data;
  };

  const getMaterias = async (_user) => {
    let cursos = await axios.get(`./api/curso`);
    cursos = cursos.data;
    const materiasConCursoNombre = agregarCursoNombre(_user.materias, cursos);
    const _profesor = materiasConCursoNombre.reduce((acc, materia) => {
      const cursoNombre = materia.cursoNombre;
      let curso = acc.find((curso) => curso.nombre === cursoNombre);
      if (!curso) {
        curso = { nombre: cursoNombre, materias: [] };
        acc.push(curso);
      }
      curso.materias.push(materia);
      return acc;
    }, []);

    return _profesor;
  };
  const getPeriodo = async () => {
    const _periodo = await axios.get(`./api/periodo`);
    return _periodo.data;
  };
  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
        getMaterias(data).then((data) => {
          setProfesor(data);
        });
        getPeriodo(data)
          .then((data) => {
            setPeriodo(data);
          })
          .catch((error) => {
            setError(error);
          });
      })
      .then(() => setLoading(false))
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [change, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }
  return (
    <SidebarProvider>
      <AppSidebar
        info={{
          nombre: user.nombre,
          user: user.user,
          profesor: profesor,
          preceptor: user.cursos,
        }}
        setCurrentRol={setCurrentRol}
        currentrol={currentRol}
        setter={setChange}
      />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {/* bg-muted/50 */}

        <div className="flex flex-col gap-4 p-4 pt-0 w-full">
          {currentRol.rol == "inicio" ? (
            <div className="flex justify-center">
              <InsetInicio user={user} rol="docente" />
            </div>
          ) : currentRol.rol == "profesor" ? (
            <InsetProf currentrol={currentRol} periodo={periodo} />
          ) : currentRol.rol == "settings" ? (
            <>
              <UpdateUser rol="docente" user={user} setter={setLoading} />
            </>
          ) : (
            <InsetPres
              setChange={setChange}
              currentrol={currentRol}
              periodo={periodo}
              change={change}
              cursos={user.cursos}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
