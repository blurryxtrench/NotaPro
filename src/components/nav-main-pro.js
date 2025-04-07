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

export function NavMainPro({ items, setCurrentRol }) {
  const handleRolProf = async ({ rol, materia, curso }) => {
    const _materia = await axios.get(`./api/materia/${materia}`);
    setCurrentRol({
      rol,
      curso,
      materia: _materia.data.materia,
    });
  };

  if (items.length)
    return (
      <SidebarGroup>
        <SidebarGroupLabel>
          Profesor
          {/* <button
            onClick={() => setCurrentRol({ rol: "profesor", curso: "3°d" })}
          >
            aaa
          </button> */}
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
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
                              rol: "profesor",
                              curso: item.title,
                              materia: subItem.id,
                            })
                          }
                          asChild
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
}
