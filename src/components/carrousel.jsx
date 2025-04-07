"use client";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
import { Input } from "./ui/input";
import axios from "axios";

export default function CarouselAdmin() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  const [credentials, setCredentials] = useState({
    user: "",
    password: "",
  });
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);

  const [periodos, setPeriodos] = useState([]);
  const [newPeriodo, setNewPeriodo] = useState({
    nombre: "",
  });
  const handleChangePer = (e) => {
    setNewPeriodo({ ...newPeriodo, [e.target.name]: e.target.value });
  };
  const handleSubmitPer = (e) => {
    e.preventDefault();
    setPeriodos((prev) => [...prev, newPeriodo]);
    setNewPeriodo({
      nombre: "",
    });
  };
  const handleDelPer = (e, index) => {
    e.preventDefault();
    setPeriodos((prev) => prev.filter((p, i) => i !== index));
  };

  const [docentes, setDocentes] = useState([]);
  const [newDocente, setNewDocente] = useState({
    nombre: "",
    email: "",
    apellido: "",
  });
  const handleChangeDoc = (e) => {
    setNewDocente({ ...newDocente, [e.target.name]: e.target.value });
  };

  const handleSubmitDoc = (e) => {
    e.preventDefault();
    setDocentes((prev) => [...prev, newDocente]);
    setNewDocente({
      nombre: "",
      email: "",
      apellido: "",
    });
  };
  const handleDelDoc = (e, index) => {
    e.preventDefault();
    setCursos((prev) =>
      prev.filter((c, i) => c.docenteEmail !== docentes[index].email)
    );
    setDocentes((prev) => prev.filter((p, i) => i !== index));
  };
  const emailControl = docentes.find((doc) => doc.email == newDocente.email);
  let control;
  if (emailControl) control = false;
  if (!emailControl) control = true;

  const [cursos, setCursos] = useState([]);
  const [newCurso, setNewCurso] = useState({
    nombre: "",
    docenteEmail: "",
    docenteNom: "",
  });
  const handleChangeCur = (e) => {
    setNewCurso({ ...newCurso, [e.target.name]: e.target.value });
  };
  const handleSubmitCur = (e) => {
    e.preventDefault();
    setCursos((prev) => [...prev, newCurso]);
    setNewCurso({
      nombre: "",
      docenteEmail: "",
      docenteNom: "",
    });
  };
  const handleDelCur = (e, index) => {
    e.preventDefault();
    setCursos((prev) => prev.filter((p, i) => i !== index));
  };
  const handleSelect = (doc) => {
    setNewCurso({
      ...newCurso,
      docenteEmail: doc.email,
      docenteNom: doc.nombre + " " + doc.apellido,
    });
  };
  const nomControl = cursos.find((cur) => cur.nombre == newCurso.nombre);
  let curcontrol;
  if (nomControl) curcontrol = false;
  if (!nomControl) curcontrol = true;

  const login =
    credentials.user &&
    credentials.password &&
    docentes.length !== 0 &&
    periodos.length !== 0 &&
    cursos.length !== 0;
  //#region hola
  //#endregion hola
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { user, password } = credentials;
    try {
      const response = await axios.post("/api/admin/", {
        user,
        password,
      });
    } catch (error) {
      console.log(error);
    }
    periodos.map(({ nombre }) => postPer(nombre));
    const usersdoc = await Promise.all(
      docentes.map(({ nombre, apellido, email }) =>
        postDoc(nombre, apellido, email)
      )
    );
    await new Promise((res) => setTimeout(res, 500));

    await new Promise((res) => setTimeout(res, 700));
    cursos.map(({ nombre, docenteEmail }) =>
      postCurso(nombre, docenteEmail, usersdoc)
    );
    const { data } = await axios.post("/api/auth", credentials, {
      headers: {
        "Content-Type": "application/json", // Asegurar que se envía como JSON
      },
    });
    router.push("/login");
  };

  const postPer = async (nombre) => {
    try {
      const response = await axios.post("/api/periodo/", {
        nombre,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const postDoc = async (nombre, apellido, email) => {
    try {
      const _docentes = await getDocentes();
      const iniciales = obtenerIniciales(nombre);
      const data = {
        user: iniciales.toLowerCase() + apellido.toLowerCase() + "_" + "doc",
        password: randomComplexString(12),
        nombre: nombre.replace(/\b\w/g, (letra) => letra.toUpperCase()),
        apellido: apellido.replace(/\b\w/g, (letra) => letra.toUpperCase()),
        email: email,
      };
      let cont = 0;
      for (let i = 0; i < _docentes.length; i++) {
        const { email, user } = _docentes[i];

        if (user === data.user) {
          let newUser = data.user + cont;
          while (_docentes.some((est) => est.user === newUser)) {
            cont++; // Incrementamos el contador hasta que no haya coincidencia
            newUser = data.user + cont;
          }
          data.user = newUser; // Actualizamos el usuario con el nuevo valor
        }
      }
      const response = await axios.post("/api/docente/", data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const postCurso = async (nombre, email, usersdoc) => {
    const pres = usersdoc.find((doc) => doc.email == email);
    try {
      const response = await axios.post("/api/curso/", {
        nombre,
        docenteId: pres.id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //#region1

  const getDocentes = async () => {
    try {
      const _docentes = await axios.get(`/api/docente`);
      return _docentes.data;
    } catch (error) {
      console.log(error);
    }
  };
  function randomComplexString(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const obtenerIniciales = (str) => {
    return str
      .split(" ") // Separar en palabras
      .map((palabra) => palabra[0].toLowerCase()) // Tomar la primera letra en minúscula
      .join(""); // Unir las iniciales
  };
  //#endregion 1
  return (
    <div className="mx-auto max-w-[400px] p-2">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => {
            if (index == 0)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">Bienvenido</CardTitle>
                      <CardDescription>
                        Para comenzar establezcamos un usuario y contraseña para
                        el administrador
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 justify-center ">
                      <Input
                        placeholder="usuario"
                        value={credentials.user}
                        onChange={handleChange}
                        name="user"
                      />
                      <Input
                        placeholder="contraseña"
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        name="password"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 1)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">Períodos</CardTitle>
                      <CardDescription>
                        Ahora, establezcamos los períodos en los que se divide
                        el ciclo lectivo en su institución académica
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 justify-center ">
                      <Card className="w-[90%] p-2">
                        <CardHeader>
                          <div className="flex justify-center ">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-row justify-center gap-2 px-2"
                                >
                                  <i className="fa-solid fa-plus"></i>Crear
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Crear Período</DialogTitle>
                                  <DialogDescription>
                                    Ingrese los datos del período
                                  </DialogDescription>
                                </DialogHeader>
                                <CardContent className="flex flex-col gap-2">
                                  <div className="flex flex-col gap-2">
                                    <div>Nombre</div>
                                    <Input
                                      name="nombre"
                                      onChange={handleChangePer}
                                      value={newPeriodo.nombre}
                                      placeholder="Debe completar este campo"
                                    />
                                  </div>
                                </CardContent>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    {newPeriodo.nombre ? (
                                      <form
                                        onSubmit={handleSubmitPer}
                                        className="flex items-center space-x-2"
                                      >
                                        <Button
                                          type="submit"
                                          variant="secondary"
                                        >
                                          Guardar
                                        </Button>
                                      </form>
                                    ) : (
                                      <Button
                                        type="submit"
                                        disabled
                                        variant="secondary"
                                      >
                                        Aún debe llenar campos
                                      </Button>
                                    )}
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardHeader>
                        {periodos.length != 0 && (
                          <div className="flex flex-col gap-1">
                            {periodos.map((per, index) => (
                              <Card
                                className="flex flex-row justify-between items-center w-full h-auto p-0"
                                key={index}
                              >
                                <div className="px-3">
                                  <CardTitle>{per.nombre}</CardTitle>
                                </div>
                                <form onSubmit={(e) => handleDelPer(e, index)}>
                                  <Button type="submit" variant="secondary">
                                    <i className="fa-solid fa-trash"></i>
                                  </Button>
                                </form>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Card>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 2)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Tipos de Cuentas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 text-black font-normal text-md justify-center ">
                      <CardDescription className="flex flex-col gap-3">
                        <div>
                          Muy bien, ahora aclaremos cómo funcionan los roles de
                          usuario o tipos de cuentas.
                          <br />
                          <br /> Hay 3 tipos de cuentas además de su cuenta de
                          administrador: docentes, estudiantes y familiares. Los
                          docentes pueden ser preceptores al estar asociados con
                          cursos o bien profesores al estar asociados con
                          materias. Los familiares deben asociarse a los
                          estudiantes y pueden ver sus calificaciones.
                        </div>
                        <span className="text-black text-md">
                          {" "}
                          Un familiar puede estar asociado a muchos estudiantes
                          y, a su vez, un estudiante puede estar asciado a
                          muchos familiares
                        </span>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );

            if (index == 3)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">Crear cuentas</CardTitle>
                      <CardDescription className="flex flex-col gap-3">
                        <div>
                          Ahora, vamos a comenzar a crear cuentas para los
                          usuarios. Por ahora, comencemos con los docentes de su
                          institución.
                        </div>
                        <div className="text-black text-md">
                          {" "}
                          Los docentes puede ser profesores de materias o bien
                          preceptores de algunos curso. Ingrese nombre, apellido
                          y e-mail de ellos.
                        </div>
                        <div>
                          Más adelante podrá gestionar cuentas de estudiantes y
                          familiares también.
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 justify-center ">
                      <Card className="w-[90%] p-2">
                        <CardHeader>
                          <div className="flex justify-center ">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-row justify-center gap-2 px-2"
                                >
                                  <i className="fa-solid fa-plus"></i>Crear
                                  Docente
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Crear Usuario</DialogTitle>
                                  <DialogDescription>
                                    Ingrese los datos del docente
                                  </DialogDescription>
                                </DialogHeader>
                                <CardContent className="flex flex-col gap-2">
                                  <div>Nombre</div>
                                  <Input
                                    name="nombre"
                                    onChange={handleChangeDoc}
                                    value={newDocente.nombre}
                                    placeholder="Ej: Gabriel"
                                  />
                                  <div>Apellido</div>
                                  <Input
                                    name="apellido"
                                    onChange={handleChangeDoc}
                                    value={newDocente.apellido}
                                    placeholder="Ej: Pasternak"
                                  />
                                  <div>E-mail</div>
                                  <Input
                                    name="email"
                                    onChange={handleChangeDoc}
                                    value={newDocente.email}
                                    placeholder="Ej: gabriel@gmail.com"
                                  />
                                </CardContent>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    {newDocente.nombre &&
                                    newDocente.apellido &&
                                    control &&
                                    newDocente.email ? (
                                      <form
                                        onSubmit={handleSubmitDoc}
                                        className="flex items-center space-x-2"
                                      >
                                        <Button
                                          type="submit"
                                          variant="secondary"
                                        >
                                          Guardar
                                        </Button>
                                      </form>
                                    ) : (
                                      <Button
                                        type="submit"
                                        disabled
                                        variant="secondary"
                                      >
                                        {control
                                          ? "Aún debe llenar campos"
                                          : "no se deben repetir lo emails"}
                                      </Button>
                                    )}
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardHeader>
                        {docentes.length != 0 && (
                          <div className="flex flex-col gap-1">
                            {docentes.map((doc, index) => (
                              <Card
                                className="flex flex-row items-center justify-between gap-0 w-full h-auto p-0 pr-1"
                                key={index}
                              >
                                <div className="px-3 overflow-hidden">
                                  <CardTitle>
                                    <div className="py-3">
                                      <div className="">
                                        {doc.nombre} {doc.apellido}
                                      </div>{" "}
                                      <div className="text-sm font-light">
                                        {doc.email}
                                      </div>
                                    </div>
                                  </CardTitle>
                                </div>
                                <div className="h-full flex flex-col justify-center">
                                  <form
                                    onSubmit={(e) => handleDelDoc(e, index)}
                                  >
                                    <Button type="submit" variant="secondary">
                                      <i className="fa-solid fa-trash"></i>
                                    </Button>
                                  </form>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Card>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 5)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">Cursos</CardTitle>
                      <CardDescription>
                        <div>
                          Ahora vamos a crear a los distintos cursos. Los cursos
                          deben tener un preceptor, que será un docente a cargo.
                          Además tendrá materias y estudiantes asociados. Los
                          cursos organizan la gestón académica.
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 justify-center ">
                      <Card className="w-[90%] p-2">
                        <CardHeader>
                          <div className="flex justify-center ">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-row justify-center gap-2 px-2"
                                >
                                  <i className="fa-solid fa-plus"></i>Crear
                                  Curso
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Crear Curso</DialogTitle>
                                  <DialogDescription>
                                    Ingrese los datos del Curso
                                  </DialogDescription>
                                </DialogHeader>
                                <CardContent className="flex flex-col gap-2">
                                  <div>Nombre</div>
                                  <Input
                                    name="nombre"
                                    onChange={handleChangeCur}
                                    value={newCurso.nombre}
                                    placeholder="Ej: 3°d"
                                  />
                                  <div>Preceptor</div>
                                  <div className="flex flex-row gap-1">
                                    {docentes.map((doc, index) =>
                                      doc.email == newCurso.docenteEmail ? (
                                        <div
                                          onClick={() => handleSelect(doc)}
                                          key={index}
                                          className="p-1 text-sm border-4 hover:bg-accent  rounded w-auto"
                                        >
                                          {doc.nombre} {doc.apellido}
                                        </div>
                                      ) : (
                                        <div
                                          onClick={() => handleSelect(doc)}
                                          key={index}
                                          className="p-2 text-sm border hover:bg-accent rounded w-auto"
                                        >
                                          {doc.nombre} {doc.apellido}
                                        </div>
                                      )
                                    )}
                                    {docentes.length == 0 ? (
                                      <CardDescription>
                                        Debe crear docentes primero
                                      </CardDescription>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </CardContent>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    {newCurso.docenteEmail &&
                                    curcontrol &&
                                    newCurso.nombre ? (
                                      <form
                                        onSubmit={handleSubmitCur}
                                        className="flex items-center space-x-2"
                                      >
                                        <Button
                                          type="submit"
                                          variant="secondary"
                                        >
                                          Guardar
                                        </Button>
                                      </form>
                                    ) : (
                                      <Button
                                        type="submit"
                                        disabled
                                        variant="secondary"
                                      >
                                        {curcontrol
                                          ? "Aún debe llenar campos"
                                          : "no se deben repetir los nombres"}
                                      </Button>
                                    )}
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardHeader>
                        {cursos.length != 0 && (
                          <div className="flex flex-col gap-1">
                            {cursos.map((cur, index) => (
                              <Card
                                className="flex flex-row justify-between items-center w-full h-auto p-0"
                                key={index}
                              >
                                <div className="px-3 flex-1 overflow-hidden">
                                  <CardTitle>
                                    <div className="py-3 flex justify-between flex-1">
                                      <div className="">{cur.nombre}</div>{" "}
                                    </div>
                                  </CardTitle>
                                </div>
                                <form onSubmit={(e) => handleDelCur(e, index)}>
                                  <Button type="submit" variant="secondary">
                                    <i className="fa-solid fa-trash"></i>
                                  </Button>
                                </form>
                              </Card>
                            ))}
                          </div>
                        )}
                      </Card>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 4)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Activación de cuentas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 text-black font-normal text-md justify-center ">
                      <CardDescription className="flex flex-col gap-3">
                        <div className="text-black text-md">
                          Para garantizar la privacidad, la activación de la
                          cuenta debe ser realizada únicamente por el usuario.
                        </div>
                        Más adelante, podrá compartir un código QR que le
                        permitirá acceder al sistema, completar el proceso de
                        activación y establecer su contraseña. Tienen un tiempo
                        de 3 días para hacerlo, sino el qr expira.
                        <span>
                          <div className="text-black text-md">
                            Si usuarios no activaron su cuenta en el plazo de 3
                            días o bien se olvidaron la contraseña, usted como
                            administrador puede desactivar la cuenta y generar
                            un qr para que el usuario pueda activarla nuevamente
                          </div>{" "}
                        </span>
                        <span>
                          <div className="text-black font-semibold text-md">
                            Cabe aclarar que los nombres de usuario necesarios
                            para iniciar sesión se generan automáticamente y no
                            pueden ser modificados
                          </div>{" "}
                        </span>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 6)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Gestión académica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-2 text-black font-normal text-md justify-center ">
                      <CardDescription className="flex flex-col gap-3">
                        <div>
                          <span className="text-black text-md">Materias: </span>{" "}
                          Los preceptores o usted como administrador pueden
                          crear materias. Cada materia debe pertenecer a un
                          curso y tener un docente a cargo, el profesor.
                        </div>
                        <div>
                          <span className="text-black text-md">Tareas: </span>{" "}
                          Los profesores pueden crear tareas en las materias que
                          tienen a cargo. Pueden corregirlas una vez entregadas
                          por los estudiantes y la calificacion sera visible
                          para sus familiares y el mismo estudiante. Cada tarea
                          al ser creada es necesario que pertenezca a un
                          período.
                        </div>
                        <div>
                          <span className="text-black text-md">
                            Cálculo de Promedios:{" "}
                          </span>{" "}
                          El sistema calcula automáticamente el promedio de cada
                          estudiante en base a sus calificaciones registradas.
                          El promedio, puede ser visible por los preceptores,
                          estudiantes y familiares. Los promedios toman en
                          cuenta las calificaciones de las tareas en cada
                          período.
                        </div>{" "}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            if (index == 7 && login)
              return (
                <CarouselItem key={index}>
                  <Card className="aspect-square flex flex-col justify-around ">
                    <CardHeader>
                      <CardTitle className="text-xl">Iniciar sesión</CardTitle>
                      <CardDescription>
                        Bien, ya hemos establecido sus datos de administrador,
                        algunos cursos y docentes. Guarde los datos para acceder
                        a todas las funciones de administrador
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center gap-5">
                      <div className="flex flex-col gap-2">
                        <span>
                          Su usuario de administrador será{" "}
                          <span className="font-semibold text-primary">
                            {credentials.user}
                          </span>
                        </span>

                        <div className="flex items-center gap-2">
                          <span>Su contraseña:</span>

                          <div className="relative flex items-center border rounded-lg px-3 py-1 bg-muted">
                            <span className="text-sm font-normal">
                              {visible
                                ? credentials.password
                                : "•".repeat(credentials.password.length)}
                            </span>
                            <button
                              type="button"
                              onClick={toggleVisibility}
                              className="ml-2 text-muted-foreground hover:text-primary"
                            >
                              {visible ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>

                        <span>¿Está de acuerdo?</span>
                      </div>
                      <div className="w-full">
                        <form onSubmit={handleSubmit}>
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <Button
                              type="submit"
                              className="w-full hover:bg-accent-foreground hover:text-accent hover:cursor-pointer"
                              variant={"secondary"}
                            >
                              Iniciar Sesión
                            </Button>
                          )}
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
