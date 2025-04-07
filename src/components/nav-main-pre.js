"use client";

import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { cn } from "./lib/utils";

import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function NavMainPre({ items, setCurrentRol, currentrol }) {
  const [menu, setMenu] = useState("");
  useEffect(() => {
    if (currentrol.rol == "profesor") setMenu("");
  }, [currentrol]);

  const handleRolProf = async ({ rol, curso }) => {
    const _curso = await axios.get(`./api/curso/${curso}`);
    setCurrentRol({
      rol,
      curso: _curso.data,
    });
    setMenu(_curso.data.curso.nombre);
  };

  if (items.length)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Preceptor</SidebarGroupLabel>
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
                        curso: item.title,
                      })
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
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
