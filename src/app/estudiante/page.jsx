"use client";
import { AppSidebar } from "../../components/app-sidebar-est.js";
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

import InsetInicio from "../../components/insetInicio.jsx";
import InsetEst from "../../components/insetEst.jsx";

export default function Page() {
  const [user, setUser] = useState({});
  const [calificaciones, setCalificaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRol, setCurrentRol] = useState({
    rol: "inicio",
    curso: "",
    materia: {},
  });
  const [periodo, setPeriodo] = useState([]);

  const handleRol = (e) => {
    setCurrentRol(e);
  };
  const getUser = async () => {
    const response = await axios.get("./api/perfil");
    let _user = response.data.user;
    _user = _user.id;
    _user = await axios.get(`./api/estudiante/${_user}`);
    _user = _user.data;
    let _cursoNom = await axios.get(`./api/curso`);
    let cursoObj = _cursoNom.data.find(({ nombre, id }) => id == _user.cursoId);
    let _curso = await axios.get(`./api/curso/${cursoObj.nombre}`);
    _user.curso = _curso.data;
    return _user;
  };

  const getCalificaciones = async (_user) => {
    let _calificaciones = await axios.get(`./api/calificacion/${_user.id}`);
    return _calificaciones.data;
  };
  const getPeriodo = async () => {
    const _periodo = await axios.get(`./api/periodo`);
    return _periodo.data;
  };
  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
        getCalificaciones(data)
          .then((data) => {
            setCalificaciones(data);
          })
          .catch((error) => {
            setError(error);
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
  }, [loading]); // El segundo argumento vacío [] asegura que esto solo se ejecute una vez
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
          curso: user.curso.curso,
          materias: user.curso.materias,
        }}
        setCurrentRol={setCurrentRol}
        setter={setLoading}
        currentrol={currentRol}
      />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {/* bg-muted/50 */}

        <div className="flex flex-col gap-4 p-4 pt-0">
          {currentRol.rol == "inicio" ? (
            <div className="flex justify-center">
              <InsetInicio user={user} rol="estudiante" />
            </div>
          ) : currentRol.rol == "settings" ? (
            <UpdateUser rol="estudiante" user={user} setter={setLoading} />
          ) : (
            <InsetEst
              currentrol={currentRol}
              periodo={periodo}
              notas={calificaciones}
              estudianteId={user.id}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
