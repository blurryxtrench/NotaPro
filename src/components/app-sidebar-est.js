"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SquareTerminal } from "lucide-react";

import { NavMainEst } from "./nav-main-est";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
// This is sample data.
import { cn } from "./lib/utils";

import { ChevronRight } from "lucide-react";
export function AppSidebar({
  info,
  setCurrentRol,
  setter,
  currentrol,
  ...props
}) {
  const router = useRouter();
  const { user, nombre, curso, materias } = info;
  const data = {
    user: {
      name: nombre,
      email: user,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Nota Pro",
        rol: "docente",
      },
    ],
    navEst: {
      title: curso.nombre,
      icon: SquareTerminal,
      isActive: true,
      items: materias.map(({ nombre, id, tareas }) => {
        return {
          tareas: tareas,
          title: nombre,
          id: id,
        };
      }),
    },
  };
  const handleLogOut = async () => {
    router.push("/login");
    await axios.post(
      "./api/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json", // Asegurar que se envía como JSON
        },
      }
    );
  };
  const handleInicio = () => {
    setCurrentRol({ rol: "inicio" });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={handleInicio}>
        <div className="flex-row">
          <i className="m-auto fa-solid font-medium fa-address-book" />
          <span> Nota Pro</span>{" "}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMainEst setCurrentRol={setCurrentRol} item={data.navEst} />
        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible
              key="settings"
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="settings"
                    onClick={() =>
                      setCurrentRol({
                        rol: "settings",
                      })
                    }
                  >
                    <span>Actualizar Datos</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200", // clases base
                        {
                          "rotate-90": currentrol.rol === "settings", // Condición para rotar
                        }
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={data.user}
          handleLogOut={handleLogOut}
          setter={setter}
          rol="estudiante"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
