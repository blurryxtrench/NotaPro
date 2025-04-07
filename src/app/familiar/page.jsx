"use client";
import AppSidebar from "../../components/app-sidebar-fam.js";
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
import InsetFam from "../../components/insetFam.jsx";

export default function Page() {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRol, setCurrentRol] = useState({
    rol: "inicio",
    curso: "",
    materia: {},
  });
  const [periodo, setPeriodo] = useState([]);
  const [docentes, setDocentes] = useState([]);

  const handleRol = (e) => {
    setCurrentRol(e);
  };
  const getUser = async () => {
    const response = await axios.get("./api/perfil");
    let _user = response.data.user;
    _user = _user.id;
    _user = await axios.get(`./api/familiar/${_user}`);
    _user = _user.data;
    const estudiantesActualizados = await Promise.all(
      _user.estudiantes.map(async (est) => {
        try {
          const response = await axios.get(`./api/estudiante/${est.id}`);
          return response.data; // Retorna la información actualizada
        } catch (error) {
          console.error(`Error al obtener datos de ${est.id}:`, error);
          return est; // Si falla, mantiene el estudiante original
        }
      })
    );
    _user.estudiantes = estudiantesActualizados;
    return _user;
  };
  const getDocentes = async () => {
    const response = await axios.get("./api/docente");
    return response.data;
  };
  const getPeriodo = async () => {
    const _periodo = await axios.get(`./api/periodo`);
    return _periodo.data;
  };
  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
        getPeriodo(data)
          .then((data) => {
            setPeriodo(data);
          })
          .catch((error) => {
            setError(error);
          });
        getDocentes(data)
          .then((data) => {
            setDocentes(data);
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
  }, [loading]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] ">
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
          apellido: user.apellido,
          user: user.user,
          estudiantes: user.estudiantes,
        }}
        setCurrentRol={setCurrentRol}
        currentrol={currentRol}
        setter={setLoading}
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
              <InsetInicio user={user} rol="familiar" />
            </div>
          ) : currentRol.rol == "settings" ? (
            <UpdateUser rol="familiar" user={user} setter={setLoading} />
          ) : (
            <InsetFam
              currentrol={currentRol}
              periodos={periodo}
              familiar={user}
              docentes={docentes}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
