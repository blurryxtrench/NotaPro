"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SquareTerminal } from "lucide-react";

import { NavMainPro } from "./nav-main-pro";
import { NavMainPre } from "./nav-main-pre";
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
  currentrol,
  setter,
  ...props
}) {
  const router = useRouter();
  const { user, nombre, profesor = [], preceptor = [] } = info;

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
    navProf: profesor.map(({ id, nombre, materias }) => {
      return {
        title: nombre,
        id: id,
        icon: SquareTerminal,
        isActive: true,
        items: materias.map(({ nombre, id }) => {
          return {
            title: nombre,
            id: id,
          };
        }),
      };
    }),
    navPres: preceptor.map(({ nombre }) => {
      return {
        title: nombre,
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "a",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
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
        <NavMainPro setCurrentRol={setCurrentRol} items={data.navProf} />
        <NavMainPre
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
          rol="docente"
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
