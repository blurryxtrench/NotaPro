"use client";

import { cn } from "./lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "./ui/button";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
export function LoginForm({ className, ...props }) {
  const [credentials, setCredentials] = useState({
    user: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [correct, setCorrect] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPerfil()
      .then((data) => {
        const cookieSign = async () => {
          const { data } = await axios.post(
            "./api/auth",
            { rol: "signup" },
            {
              headers: {
                "Content-Type": "application/json", // Asegurar que se envía como JSON
              },
            }
          );
        };

        if (data.data.message == 0) cookieSign();
        return setStatus(data.data);
      })

      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    setLoadingButton(true);

    e.preventDefault();

    try {
      const { data } = await axios.post("./api/auth", credentials, {
        headers: {
          "Content-Type": "application/json", // Asegurar que se envía como JSON
        },
      });

      if (data.status == 200 && data.rol == "docente") router.push("./docente");
      if (data.status == 200 && data.rol == "estudiante")
        router.push("./estudiante");
      if (data.status == 200 && data.rol == "familiar")
        router.push("./familiar");
      if (data.status == 200 && data.rol == "admin") router.push("./admin");
    } catch (err) {
      setCorrect(false);
      setLoadingButton(false);
    }
  };
  const getPerfil = async () => {
    try {
      const response = await axios.get("/api/perfil");
      console.log(response.data);
      return response;
    } catch (error) {
      return error;
    }
  };

  const router = useRouter();
  const handleSingUp = async (e) => {
    e.preventDefault();
    setLoadingButton(true);
    router.push("/admin/signup");
  };
  // if (status === 205) router.push("./admin");
  if (!status)
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`./api/admin`);
      if (response.status == 200) handleLogOut();
    } catch (error) {
      console.log(error);
    }
  };
  return status.message == 0 ? (
    <div className="flex justify-center">
      <Card className="flex flex-col justify-around p-10">
        <CardTitle className="text-xl">Bienvenido a Nota Pro</CardTitle>
        <CardDescription>
          Para comenzar, debe registrar al administrador
        </CardDescription>
        <CardFooter>
          <form onSubmit={handleSingUp}>
            <Button
              variant="secondary"
              type="submit"
              className="hover:bg-background hover:border-accent hover:border-2 border-2 border-accent"
            >
              {loadingButton ? "Cargando..." : "Registrar al administrador"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia Sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa con tu nombre de usuario y contraseña para acceder a tu cuenta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Nombre de Usuario</Label>
          <Input
            id="email"
            name="user"
            placeholder="ejemplo_est"
            value={credentials.user}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loadingButton}>
          {loadingButton ? (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        <div className="h-5">
          {!correct ? (
            <div className="text-red-700  hover:bg-red-100 rounded-md text-center">
              Usuario o contraseña incorrectos
            </div>
          ) : (
            ""
          )}
        </div>

        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button> */}
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
}
