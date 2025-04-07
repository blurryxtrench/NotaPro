"use client";

import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { cn } from "./lib/utils";

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

export default function NavMainFam({ items, setCurrentRol, currentrol }) {
  const [menu, setMenu] = useState("");
  const handleRolProf = async ({ rol, estudiante }) => {
    setCurrentRol({
      rol,
      estudiante: {
        nombre: estudiante.title,
        apellido: estudiante.apellido,
        curso: estudiante.curso,
      },
    });
    setMenu(estudiante.title);
  };

  if (items.length)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Familiar</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() =>
                      handleRolProf({
                        rol: "preceptor",
                        estudiante: item,
                      })
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <span>{item.apellido}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200", // clases base
                        {
                          "rotate-90": menu === item.title, // Condición para rotar
                        }
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
}
