"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SquareTerminal } from "lucide-react";

import NavMainFam from "./nav-main-fam.jsx";
import { NavUser } from "./nav-user";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";

import { cn } from "./lib/utils";

import { ChevronRight } from "lucide-react";
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

// This is sample data.

export default function AppSidebar({
  info,
  setCurrentRol,
  currentrol,
  setter,
  ...props
}) {
  const router = useRouter();
  const { user, nombre, apellido, estudiantes } = info;

  const data = {
    user: {
      name: nombre,
      apellido: apellido,
      email: user,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Nota Pro",
        rol: "Familiar",
      },
    ],
    navPres: estudiantes.map(({ nombre, curso, id, apellido }) => {
      return {
        title: nombre,
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        curso,
        id,
        apellido,
      };
    }),
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
        <NavMainFam
          setCurrentRol={setCurrentRol}
          items={data.navPres}
          currentrol={currentrol}
        />
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
          rol="familiar"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
