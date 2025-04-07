"use client";

import { ChevronRight } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
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
import { cn } from "./lib/utils";

export function NavMainAdmin({ items, setCurrentRol, currentrol }) {
  const [selectedRol, setSelectedRol] = useState(null);

  useEffect(() => {
    if (selectedRol) {
      setCurrentRol(selectedRol);
    }
  }, [selectedRol]);
  const handleRol = async ({ rol, list }) => {
    setSelectedRol({
      rol,
      list,
    });
  };
  if (items.length)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Administrador</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item}
              asChild
              defaultOpen={false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item}
                    onClick={() =>
                      handleRol({
                        rol: "administrador",
                        list: item,
                      })
                    }
                  >
                    <span>{item}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200", // clases base
                        {
                          "rotate-90": currentrol.list === item, // Condición para rotar
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
