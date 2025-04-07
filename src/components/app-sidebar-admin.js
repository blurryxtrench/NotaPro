"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NavMainAdmin } from "./nav-main-admin";
import { ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
} from "./ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";

import { cn } from "./lib/utils";
// This is sample data.

export function AppSidebar({ info, setCurrentRol, currentrol, ...props }) {
  const router = useRouter();

  const { user } = info;
  const { isMobile } = useSidebar();
  const letter = user.charAt(0);
  const data = {
    user: {
      name: user,
      email: user,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Nota Pro",
        rol: "administrador",
      },
    ],
    items: ["Cursos", "Docentes", "Estudiantes", "Familiares", "Periodos"],
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
        <NavMainAdmin
          setCurrentRol={setCurrentRol}
          currentrol={currentrol}
          items={data.items}
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
                        rol: "administrador",
                        list: "settings",
                      })
                    }
                  >
                    <span>Actualizar mis datos</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200", // clases base
                        {
                          "rotate-90": currentrol.list === "settings", // Condición para rotar
                        }
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible
              key="resetDatabase"
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="resetDatabase"
                    onClick={() =>
                      setCurrentRol({
                        rol: "administrador",
                        list: "resetDatabase",
                      })
                    }
                  >
                    <span>Resetear base de datos</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200", // clases base
                        {
                          "rotate-90": currentrol.list === "resetDatabase", // Condición para rotar
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {letter.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.user} />
                      <AvatarFallback className="rounded-lg">
                        {letter.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuItem>
                  <div
                    className="flex items-center gap-2"
                    onClick={handleLogOut}
                  >
                    <LogOut />
                    Cerrar Sesión
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
