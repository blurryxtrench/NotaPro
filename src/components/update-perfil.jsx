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

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import UpdatePassword from "./update-password";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpdateUser({ setter, rol, user }) {
  const router = useRouter();

  const [array, setArray] = useState([]);
  const [credentials, setCredentials] = useState(
    rol !== "admin"
      ? {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password: user.password,
        }
      : { user: user.user, password: user.password }
  );
  const [password, setPassword] = useState({ password: "", newPassword: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [valid, setValidPassword] = useState(true);
  function ocultarPassword(string) {
    return "●".repeat(string?.length);
  }
  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`/api/${endpoint}`);
        setter(response.data);
      } catch (err) {
        console.error(`Error al obtener ${endpoint}:`, err);
        setError(err);
      }
    };
    const fetchAllData = async () => {
      setLoading(true);
      await fetchData(rol, setArray);
      setLoading(false);
    };
    if (rol !== "admin") fetchAllData();
  }, []);
  const handleLogOut = async () => {
    router.push("/login");
    await axios.post(
      "./api/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json", // Asegurar que se envía como JSON
        },
      }
    );
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handlePassword = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = user.id;
    const response = await axios.put(`./api/${rol}/${id}`, credentials);
    setter((prev) => (prev === false ? !prev : prev + 1));
  };
  const handleSubmitPassword = async () => {
    try {
      const response = await axios.put(`./api/perfil`, {
        user: user.user,
        password: password.password,
        newPassword: password.newPassword,
      });
      if (response.status == 200) handleLogOut();
      setter((prev) => (prev === false ? !prev : prev + 1));
    } catch (error) {
      setValidPassword(false);
    }
  };
  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }
  const checkEmail = array.find(
    (obj) => obj.id !== user.id && obj.email == credentials.email
  );
  //eliminar todo opcion
  return (
    <div className="flex flex-col gap-1 items-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Mi cuenta</TabsTrigger>
          <TabsTrigger value="password">Cambiar Contraseña</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Mi cuenta</CardTitle>
              <CardDescription>
                Actuliza los datos de tu cuenta y recuerda guardarlos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {rol !== "admin" ? (
                <div className="flex flex-col gap-1 items-center">
                  <CardContent className="w-full flex flex-col gap-5 p-2">
                    <CardTitle className="flex flex-col gap-4">
                      <div className="pl-1">Nombre</div>
                      <Input
                        onChange={handleChange}
                        name="nombre"
                        value={credentials.nombre}
                      />
                      <div className="pl-1">Apellido</div>
                      <Input
                        onChange={handleChange}
                        name="apellido"
                        value={credentials.apellido}
                      />
                      <div className="pl-1">E-mail</div>
                      <Input
                        onChange={handleChange}
                        name="email"
                        value={credentials.email}
                      />
                    </CardTitle>
                  </CardContent>
                </div>
              ) : (
                <div>
                  <span>Usuario</span>
                  <Input
                    onChange={handleChange}
                    name="user"
                    value={credentials.user}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {rol !== "admin" ? (
                <div>
                  {credentials.nombre &&
                  credentials.apellido &&
                  credentials.password &&
                  credentials.email &&
                  checkEmail == undefined ? (
                    <Button onClick={handleSubmit}>Guardar</Button>
                  ) : (
                    <Button disabled variant="secondary">
                      {checkEmail === undefined
                        ? "Aún debe llenar campos"
                        : "No se deben repetir emails"}
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {credentials.user ? (
                    <Button onClick={handleSubmit}>Guardar</Button>
                  ) : (
                    <Button disabled variant="secondary">
                      Aún debe llenar campos
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Contraseña</CardTitle>
              <CardDescription>
                Cambia tu contraseña aquí. Una vez que la guardas se cerrará la
                sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Actual contraseña</Label>
                <Input
                  id="current"
                  type="password"
                  name="password"
                  onChange={handlePassword}
                  value={password.password}
                />
              </div>{" "}
              <div className="space-y-1">
                <Label htmlFor="new">Nueva contraseña</Label>
                <Input
                  id="new"
                  type="password"
                  name="newPassword"
                  onChange={handlePassword}
                  value={password.newPassword}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button onClick={handleSubmitPassword}>Cambiar Contraseña</Button>
              <div className="h-5">
                {!valid ? (
                  <div className="text-red-700  hover:bg-red-100 rounded-md text-center">
                    Contraseña actual incorrecta
                  </div>
                ) : (
                  ""
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
