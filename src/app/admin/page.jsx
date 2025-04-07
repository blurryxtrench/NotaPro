"use client";
import { AppSidebar } from "../../components/app-sidebar-admin.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { Separator } from "../../components/ui/separator.js";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import UpdateUser from "../../components/update-perfil.jsx";

import InsetInicio from "../../components/insetInicio.jsx";
import InsetAdmin from "../../components/insetAdmin/insetAdmin.jsx";
import ResetDatabase from "../../components/reset.jsx";

export default function Page() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentRol, setCurrentRol] = useState({
    rol: "inicio",
    list: "",
  });
  const [periodo, setPeriodo] = useState([]);

  const handleRol = (e) => {
    setCurrentRol(e);
  };
  const getUser = async () => {
    const response = await axios.get("./api/perfil");
    let _user = response.data.user;
    _user = _user.id;
    _user = await axios.get(`./api/admin/${_user}`);
    return _user.data;
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
      })
      .then(() => setLoading(false))
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
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
          nombre: user.user,
          user: user.user,
        }}
        setCurrentRol={setCurrentRol}
        currentrol={currentRol}
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
            <InsetInicio rol="admin" />
          ) : currentRol.list == "settings" ? (
            <UpdateUser rol="admin" user={user} setter={setLoading} />
          ) : currentRol.list == "resetDatabase" ? (
            <ResetDatabase user={user.user} />
          ) : (
            <InsetAdmin currentrol={currentRol} periodo={periodo} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
