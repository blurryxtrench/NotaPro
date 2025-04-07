"use client";

import { ChevronRight } from "lucide-react";
import axios from "axios";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";

export function NavMainEst({ item, setCurrentRol }) {
  const handleRolProf = async ({ rol, materia }) => {
    const response = await axios.get(`./api/materia/${materia.id}`);

    materia.docente = response.data.materia.docente;
    setCurrentRol({
      rol,
      materia,
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Estudiante</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      onClick={() =>
                        handleRolProf({
                          rol: "estudiante",
                          materia: subItem,
                        })
                      }
                      asChild
                    >
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
                {item.items.length == 0 ? (
                  <SidebarMenuSubItem>
                    <span className="text-md">No hay materias aún</span>
                  </SidebarMenuSubItem>
                ) : (
                  ""
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
