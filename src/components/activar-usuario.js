"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
export default function ActivarUsuario() {
  const router = useRouter();

  const [token, setToken] = useState(false);
  const [user, setUser] = useState({});

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    // Cuando la página está lista, obtenemos el token
    const _token = searchParams.get("token");
    if (_token) setToken(_token);
    const getUser = async () => {
      const response = await axios.put("/api/activar-usuario", {
        token: _token,
      });
      return response.data;
    };
    getUser()
      .then((data) => setUser(data.usuario))
      .catch((error) => setError(error))
      .finally(() => setLoadingFetch(false));
  }, [searchParams]);
  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    console.log(error);
    return (
      <div className="w-full h-[100vh] flex flex-col justify-start items-center p-2">
        <div className="flex justify-center gap-2 md:justify-start pt-3">
          <i className="m-auto fa-solid font-medium fa-address-book" />
          <div className="font-normal">Nota Pro</div>
        </div>
        <Card className="w-[50%]  my-auto">
          {" "}
          <CardHeader>
            <CardTitle> El token no es válido o ya expiró</CardTitle>
            <CardDescription>
              {" "}
              Contáctate con el administrador para terminar con la activación de
              la cuenta
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("Por favor ingresa una nueva contraseña.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Realizar la solicitud POST al backend para cambiar la contraseña
      const response = await axios.post("/api/activar-usuario", {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setMessage("Contraseña cambiada con éxito.");
        // Opcional: Redirigir al login
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      setMessage("Hubo un error al cambiar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
      //router.pushlogin
    }
  };
  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };
  const string = user.user.slice(-3);
  let rol =
    string == "est"
      ? "estudiante"
      : string == "doc"
      ? "docente"
      : string == "fam"
      ? "familiar"
      : "admin";
  return (
    <div className="w-full h-[100vh] flex flex-col justify-start items-center p-2">
      <div className="flex justify-center gap-2 md:justify-start pt-3">
        <i className="m-auto fa-solid font-medium fa-address-book" />
        <div className="font-normal">Nota Pro</div>
      </div>
      <Card className="w-[50%] h-[50%] my-auto">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle className="text-xl text-center">
            Activar cuenta de {rol}
          </CardTitle>
          <CardDescription className="text-center">
            Bienvenido {user.nombre} {user.apellido}!, para activar tu cuenta
            debes ingresar tu contraseña. Después de este proceso, podrás
            iniciar sesión normalmente. Tienes tiempo hasta el{" "}
            <span className="text-normal font-medium">
              {new Date(user.tokenExpiresAt).toLocaleString("es-ES", {
                timeZone: "America/Argentina/Buenos_Aires",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Asegura formato 24 horas
              })}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 flex flex-col gap-4 h-full justify-around items-center">
          <div className="flex flex-col gap-2 w-[60%]">
            <div className="flex flex-row gap-2 w-[60%]">
              <div className="font-normal text-md">Tu usuario es:</div>
              {user.user}
            </div>
            <div className="font-normal text-md">Contraseña</div>
            <Input
              placeholder="contraseña"
              value={newPassword}
              onChange={handleChange}
              name="newPassword"
                type="password"
            />
          </div>

          {newPassword !== "" ? (
            <Button
              onClick={handleSubmit}
              className="bg-foreground text-accent"
            >
              {" "}
              {!loading ? (
                "Guardar Contraseña"
              ) : (
                <div className="flex items-center justify-center h-[100vh]">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                </div>
              )}{" "}
            </Button>
          ) : (
            <Button type="submit" disabled variant="secondary">
              Ingrese su contraseña
            </Button>
          )}
          {message && <p className="message">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
