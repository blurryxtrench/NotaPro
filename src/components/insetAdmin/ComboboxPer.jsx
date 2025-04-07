import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  CardContent,
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function ComboboxDemo({ periodo, periodos, setState }) {
  const [credentials, setCredentials] = useState({
    nombre: periodo.nombre,
  });
  const [change, setChange] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [tareas, setTareas] = useState([]);
  const handleOpen = (e) => {
    setOpen(!open);
  };
  useEffect(() => {
    const fetchData = async (setter) => {
      try {
        const response = await axios.get(`/api/tarea`);
        setter(response.data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetchData(setTareas);
    setLoading(false);
  }, [loading]);
  const nomControl = periodos.find(
    (per) => per.nombre == credentials.nombre && periodo.id !== per.id
  );

  const tareasPeriodo = tareas.filter((tar) => tar.periodoId == periodo.id);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant={"secondary"}
          className="w-full border-0 p-0 m-0 flex justify-center"
        >
          <ChevronsUpDown className="h-[80%] w-[10%] shrink-0 opacity-50" />
          <div className="text-xl">{periodo.nombre}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Card className="w-[300px] flex flex-row justify-center items-center gap-0 m-0 p-1">
          {tareasPeriodo.length !== 0 && (
            <CardTitle className="p-3">
              Hay {tareasPeriodo.length} tareas asignadas en este período
            </CardTitle>
          )}
          {tareasPeriodo.length == 0 && (
            <CardTitle className="p-3">
              No hay tareas asignadas en este período aún
            </CardTitle>
          )}
        </Card>
        <Button
          onClick={handleOpen}
          aria-expanded={open}
          variant={"secondary"}
          className="w-full border-0 p-0 m-0 flex justify-center"
        >
          Cerrar
        </Button>
      </PopoverContent>
    </Popover>
  );
}
