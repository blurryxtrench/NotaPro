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

import { Button } from "./ui/button";
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
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePassword({ setter }) {
  const [credentialsPas, setCredentialsPas] = useState({
    contraseña: "",
    nuevaContraseña: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(true);
  function ocultarPassword(string) {
    return "●".repeat(string?.length);
  }
  const samePasword =
    credentialsPas.contraseña == credentialsPas.nuevaContraseña;

  const handleChangePas = (e) => {
    setCredentialsPas({ ...credentialsPas, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setter(credentialsPas.contraseña);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-row justify-center gap-2 px-2"
        >
          <i className="fa-solid fa-pen-to-square"></i> Cambiar Contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Ingrese la nueva contraseña junto con su confirmacion
          </DialogDescription>
        </DialogHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Nueva Contraseña"
              type={!showNewPassword ? "text" : "password"}
              value={credentialsPas.contraseña}
              onChange={handleChangePas}
              name="contraseña"
            ></Input>
            <Input
              placeholder="Repetir Nueva Contraseña"
              type={!showNewPassword ? "text" : "password"}
              value={credentialsPas.nuevaContraseña}
              onChange={handleChangePas}
              name="nuevaContraseña"
            ></Input>
            <div className="flex-1 flex justify-center ">
              <Button
                variant="ghost"
                size="sm"
                className="p-3 m-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {samePasword ? (
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <Button type="submit" variant="secondary">
                  Guardar
                </Button>
              </form>
            ) : (
              <Button type="submit" disabled variant="secondary">
                Las contraseñas no coinciden
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
