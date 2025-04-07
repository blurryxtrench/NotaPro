import { Copy } from "lucide-react";
import { useState, useEffect } from "react";

import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import UpdatePassword from "./update-password";
import { Eye, EyeOff } from "lucide-react";

export default function Reset({ user }) {
  const router = useRouter();
  // const [array, setArray] = useState([]);
  // const [credentials, setCredentials] = useState(
  //   rol !== "admin"
  //     ? {
  //         nombre: user.nombre,
  //         apellido: user.apellido,
  //         email: user.email,
  //         password: user.password,
  //       }
  //     : { user: user.user, password: user.password }
  // );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correct, setCorrect] = useState(undefined);

  // const [showPassword, setShowPassword] = useState(false);
  // function ocultarPassword(string) {
  //   return "●".repeat(string?.length);
  // }

  const handleLogOut = async () => {
    await axios.post(
      "./api/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json", // Asegurar que se envía como JSON
        },
      }
    );
    router.push("/login");
  };
  const handleChange = (e) => {
    setPassword(e.target.value);
    setCorrect(undefined);
  };
  // const handlePassword = (e) => {
  //   setPassword({ ...password, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    const data = {
      user,
      password,
    };
    const id = user.id;
    try {
      const response = await axios.post(`./api/perfil`, data);
      if (response.status == 200) setCorrect(true);
      handleDelete();
    } catch (error) {
      setError(error.message);
      setCorrect(false);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`./api/admin`);
      if (response.status == 200) handleLogOut();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col gap-1 items-center">
      <CardContent className="w-[40%] flex flex-col gap-5 p-2">
        <CardHeader>
          <CardTitle className="text-xl">Resetar Base de datos</CardTitle>
          <CardDescription>
            Si así lo desea, se borrarán todos los datos, incluyendo los suyos
            como administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="pl-1">Contraseña actual</div>
            <Input onChange={handleChange} name="password" value={password} />
            {password == "" ? (
              <Button type="button" disabled variant="destructive">
                <div className="flex w-full ">
                  <div className="flex-1">Resetear base de datos</div>
                </div>
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="hover:text-black"
                onClick={handleSubmit}
              >
                {" "}
                Resetear base de datos
              </Button>
            )}
            <div className="h-5">
              {correct == undefined || password == "" ? (
                ""
              ) : correct == true ? (
                <div className="text-black  hover:bg-accent rounded-md text-center">
                  Contraseña correcta, borrando datos
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : (
                <div className="text-red-700  hover:bg-red-100 rounded-md text-center">
                  Contraseña incorrecta
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </CardContent>
    </div>
  );
}
