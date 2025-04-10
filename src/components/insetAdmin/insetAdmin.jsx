import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import domtoimage from "dom-to-image";
import Lists from "../list-task-est";
import axios from "axios";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { es } from "date-fns/locale";
import CreateEst from "./createEst";
import CreateDoc from "./createDoc";
import CreateCur from "./createCur.jsx";
import CreateFam from "./createFam";
import ComboboxPer from "./ComboboxPer";
import ComboboxCur from "./ComboboxCurso";
import ComboboxFam from "./ComboboxFam";
import ComboboxDoc from "./ComboboxDoc";
import ComboboxEst from "./ComboboxEst";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  CardContent,
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardFooter,
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
export default function InsetAdmin({ currentrol }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [familiares, setFamiliares] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const qrRef = useRef(null);

  const handleRecuperar = async (id, user) => {
    const response = await axios.post("/api/recuperar-usuario/", { id, user });
    console.log(response);
    setState((prev) => prev + 1);
  };

  const [credentialsPer, setCredentialsPer] = useState({
    nombre: "",
  });

  const handleChangePer = (e) => {
    setCredentialsPer({ ...credentialsPer, [e.target.name]: e.target.value });
  };
  const handleSubmitPer = async (e) => {
    e.preventDefault();

    const response = await axios.post("/api/periodo/", credentialsPer);
    console.log(response);
    setCredentialsPer({
      nombre: "",
    });

    setState((prev) => prev + 1);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState(0);

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
      await Promise.all([
        fetchData("estudiante", setEstudiantes),
        fetchData("docente", setDocentes),
        fetchData("curso", setCursos),
        fetchData("familiar", setFamiliares),
        fetchData("periodo", setPeriodos),
        fetchData("materia", setMaterias),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [state]);
  const docentesActivos = docentes.filter((doc) => doc.oneTimeToken === null); // O cualquier otra condición para activados
  const docentesInactivos = docentes.filter((doc) => doc.oneTimeToken !== null);
  const estudiantesActivos = estudiantes.filter(
    (doc) => doc.oneTimeToken === null
  ); // O cualquier otra condición para activados
  const estudiantesInactivos = estudiantes.filter(
    (doc) => doc.oneTimeToken !== null
  );
  const familiaresActivos = familiares.filter(
    (doc) => doc.oneTimeToken === null
  ); // O cualquier otra condición para activados
  const familiaresInactivos = familiares.filter(
    (doc) => doc.oneTimeToken !== null
  );

  const nomPeriodo = periodos.find(
    (per) => per.nombre == credentialsPer.nombre
  );
  let percontrol;
  if (nomPeriodo) percontrol = false;
  if (!nomPeriodo) percontrol = true;

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
      </div>
    );

  if (currentrol.list == "Cursos") {
    return (
      <Card className="p-2 flex flex-col justify-start gap-3 h-[90vh] ">
        <CardHeader className="p-3">
          <CardTitle className="flex justify-between">
            {" "}
            <span className="text-xl">
              {" "}
              <i className="fa-solid fa-school text-md"></i> Cursos
            </span>
            <CreateCur
              docentes={docentes}
              cursos={cursos}
              setState={setState}
            ></CreateCur>
          </CardTitle>
          <CardDescription>
            Seleccione un curso para ver sus datos o actualizarlos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cursos.length != 0 && (
            <ScrollArea className="h-[70vh] w-full p-2 border rounded-2xl ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cursos.map((cur, index) => {
                  const pres = docentes.find((doc) => doc.id == cur.docenteId);
                  return (
                    <Card
                      className="flex flex-row justify-between items-center w-full h-auto p-2 text-xl"
                      key={index}
                    >
                      <div className="p-3 flex-1">
                        <CardTitle>
                          <div className="flex flex-row items-center">
                            <div className="min-w-[30%] ">
                              <ComboboxCur
                                cursos={cursos}
                                docentes={docentes}
                                curso={cur}
                                setState={setState}
                                estudiantes={estudiantes}
                                className="w-full"
                              />
                            </div>
                            <div className="text-sm font-light flex-1 flex justify-end">
                              Preceptor: {pres.nombre} {pres.apellido}
                            </div>
                          </div>
                        </CardTitle>
                      </div>
                      {/* <form onSubmit={(e) => handleDelCur(e, index)}>
                    <Button type="submit" variant="secondary">
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </form> */}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}{" "}
        </CardContent>
      </Card>
    );
  }

  if (currentrol.list == "Docentes") {
    return (
      <Card className="p-2 h-[90vh] flex flex-col justify-between gap-3 ">
        <CardHeader className="p-3">
          <CardTitle className="flex justify-between">
            {" "}
            <span className="text-xl">
              {" "}
              <i className="fa-solid fa-chalkboard-user"></i> Docente
            </span>
            <CreateDoc docentes={docentes} setState={setState}></CreateDoc>
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>
              Seleccione a un docente para ver sus datos o actualizarlos.
            </span>
            <span className="font-medium">
              {" "}
              Las cuentas inactivas se activan al acceder al escanear el código
              Qr y establecer la contraseña
            </span>
            <span className="font-medium">
              Si un usuario no recuerda su contraseña, la opción Restaurar
              Contraseña desactiva al usuario y brina un nuevo Qr para
              establecer una nueva contraseña
            </span>
          </CardDescription>
        </CardHeader>
        <div className="h-full">
          {docentes.length !== 0 && (
            <ScrollArea className="h-[65vh] flex-1">
              <CardContent className="flex flex-row justify-between  flex-wrap">
                <div className=" max-w-[700px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas activas
                  </CardTitle>
                  <ScrollArea className="h-[60vh] w-auto p-2 ">
                    <div className="flex justify-center flex-wrap">
                      {docentesActivos.map((doc, index) => {
                        return (
                          <Card
                            className="flex flex-col justify-between  min-w-[250px] gap-0 h-auto p-2 text-xl"
                            key={index}
                          >
                            <CardTitle className="flex justify-start">
                              <div className="flex flex-row items-center p-1">
                                <div className="mi-w-[30%] ">
                                  <ComboboxDoc
                                    cursos={cursos}
                                    docentes={docentes}
                                    docente={doc}
                                    setState={setState}
                                    className="w-full"
                                    materias={materias}
                                  />
                                </div>
                              </div>
                            </CardTitle>

                            <CardFooter className="flex justify-start">
                              <div className="text-sm font-light flex-1 gap-2 flex flex-col justify-between flex-wrap">
                                Usuario: {doc.user}{" "}
                                <Button
                                  variant="secondary"
                                  className="hover:bg-accent-foreground hover:text-accent"
                                  onClick={() =>
                                    handleRecuperar(doc.id, doc.user)
                                  }
                                >
                                  Reestablecer contraseña
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
                <div className="min-w-[300px] max-w-[400px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas Inactivas
                  </CardTitle>

                  <ScrollArea className="h-[60vh] w-full p-2  rounded-2xl ">
                    {docentesInactivos.map((doc, index) => {
                      const now = new Date();
                      const isExpired =
                        new Date(doc.tokenExpiresAt) < now ? true : false;

                      const handleClip = () => {
                        const qrElement = document.getElementById(
                          `qr-${index}`
                        ); // Buscar el QR en el DOM

                        if (qrElement) {
                          domtoimage.toBlob(qrElement).then((blob) => {
                            const clipboardItem = new ClipboardItem({
                              "image/png": blob,
                            });
                            navigator.clipboard.write([clipboardItem]).then(
                              () => alert("QR copiado al portapapeles"),
                              () => alert("Error al copiar al portapapeles")
                            );
                          });
                        } else {
                          alert("No se encontró el QR");
                        }
                      };

                      return (
                        <Card
                          className="flex flex-col justify-between items-center  w-full gap-0 h-auto p-2 text-xl"
                          key={index}
                        >
                          <CardTitle className="flex justify-start">
                            <div className="flex flex-row items-center p-1">
                              <div className="">
                                <ComboboxDoc
                                  cursos={cursos}
                                  docentes={docentes}
                                  docente={doc}
                                  setState={setState}
                                  className="w-full"
                                  materias={materias}
                                />
                              </div>
                            </div>
                          </CardTitle>
                          {/* <form onSubmit={(e) => handleDelCur(e, index)}>
                    <Button type="submit" variant="secondary">
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </form> */}
                          <CardFooter className="flex flex-col justify-center">
                            <div className="text-sm font-light flex-1 flex flex-col gap-2 pb-3">
                              <div>Usuario: {doc.user}</div>{" "}
                              {/* Estado de autenticación */}
                              {isExpired ? (
                                <div className="flex flex-col gap-3 items-start justify-between">
                                  <span className="text-black text-sm font-light">
                                    Token expirado
                                  </span>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={() =>
                                      handleRecuperar(doc.id, doc.user)
                                    }
                                  >
                                    Regenerar Qr
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col flex-1 gap-5 text-sm font-light">
                                  <div>Pendiente de activación</div>
                                  <div id={`qr-${index}`}>
                                    <QRCodeCanvas
                                      value={doc.activationURL}
                                      size={200}
                                    />
                                  </div>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={handleClip}
                                  >
                                    Copiar Qr
                                  </Button>
                                  <span className="text-normal font-medium">
                                    Expira:{" "}
                                    {new Date(
                                      doc.tokenExpiresAt
                                    ).toLocaleString("es-ES", {
                                      timeZone:
                                        "America/Argentina/Buenos_Aires",
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false, // Asegura formato 24 horas
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </div>
              </CardContent>
            </ScrollArea>
          )}
        </div>
      </Card>
    );
  }
  if (currentrol.list == "Estudiantes") {
    return (
      <Card className="p-2 h-[90vh] flex flex-col justify-start gap-3 ">
        <CardHeader className="p-3">
          <CardTitle className="flex justify-between">
            {" "}
            <span className="text-xl">
              {" "}
              <i className="fa-solid fa-user-graduate text-md"></i> Estudiantes
            </span>
            <CreateEst
              cursos={cursos}
              estudiantes={estudiantes}
              setState={setState}
            ></CreateEst>
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>
              Seleccione a un estudiante para ver sus datos o actualizarlos
            </span>
            <span className="font-medium">
              {" "}
              Las cuentas inactivas se activan al acceder al escanear el código
              Qr y establecer la contraseña
            </span>
            <span className="font-medium">
              Si un usuario no recuerda su contraseña, la opción Restaurar
              Contraseña desactiva al usuario y brina un nuevo Qr para
              establecer una nueva contraseña
            </span>
          </CardDescription>
        </CardHeader>
        <div className="h-full">
          {estudiantes.length !== 0 && (
            <ScrollArea className="h-[65vh] flex-1">
              <CardContent className="flex flex-row justify-between  flex-wrap">
                <div className=" max-w-[700px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas activas
                  </CardTitle>
                  <ScrollArea className="h-[60vh] w-autp p-2  rounded-2xl">
                    <div className=" flex justify-center flex-wrap">
                      {estudiantesActivos.map((est, index) => {
                        return (
                          <Card
                            className="flex flex-col justify-between  min-w-[250px] gap-0 h-auto p-2 text-xl"
                            key={index}
                          >
                            <CardTitle className="flex justify-start">
                              <div className="flex flex-row items-center p-1">
                                <div className="mi-w-[30%] ">
                                  <ComboboxEst
                                    cursos={cursos}
                                    estudiantes={estudiantes}
                                    estudiante={est}
                                    setState={setState}
                                    className="w-full"
                                    materias={materias}
                                    _familiares={familiares}
                                  />
                                </div>
                              </div>
                            </CardTitle>

                            <CardFooter className="flex justify-start">
                                <div className="text-sm font-light flex-1 gap-2 flex flex-col justify-between flex-wrap">
                                  Usuario: {est.user}{" "}
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={() =>
                                      handleRecuperar(est.id, est.user)
                                    }
                                  >
                                    Reestablecer contraseña
                                  </Button>
                                </div>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
                <div className="min-w-[300px] max-w-[400px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas Inactivas
                  </CardTitle>

                  <ScrollArea className="h-[60vh] w-full p-2  rounded-2xl ">
                    {estudiantesInactivos.map((est, index) => {
                      const now = new Date();
                      const isExpired =
                        new Date(est.tokenExpiresAt) < now ? true : false;

                      const handleClip = () => {
                        const qrElement = document.getElementById(
                          `qr-${index}`
                        ); // Buscar el QR en el DOM

                        if (qrElement) {
                          domtoimage.toBlob(qrElement).then((blob) => {
                            const clipboardItem = new ClipboardItem({
                              "image/png": blob,
                            });
                            navigator.clipboard.write([clipboardItem]).then(
                              () => alert("QR copiado al portapapeles"),
                              () => alert("Error al copiar al portapapeles")
                            );
                          });
                        } else {
                          alert("No se encontró el QR");
                        }
                      };

                      return (
                        <Card
                          className="flex flex-col justify-between items-center  w-full gap-0 h-auto p-2 text-xl"
                          key={index}
                        >
                          <CardTitle className="flex justify-start">
                            <div className="flex flex-row items-center p-1">
                              <div className="">
                                <ComboboxEst
                                  cursos={cursos}
                                  estudiantes={estudiantes}
                                  estudiante={est}
                                  setState={setState}
                                  className="w-full"
                                  materias={materias}
                                  _familiares={familiares}
                                />
                              </div>
                            </div>
                          </CardTitle>
                          {/* <form onSubmit={(e) => handleDelCur(e, index)}>
                    <Button type="submit" variant="secondary">
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </form> */}
                          <CardFooter className="flex flex-col justify-center">
                            <div className="text-sm font-light flex-1 flex flex-col gap-2 pb-3">
                              <div>Usuario: {est.user}</div>{" "}
                              {/* Estado de autenticación */}
                              {isExpired ? (
                                <div className="flex flex-col gap-3 items-start justify-between">
                                  <span className="text-black text-sm font-light">
                                    Token expirado
                                  </span>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={() =>
                                      handleRecuperar(est.id, est.user)
                                    }
                                  >
                                    Regenerar Qr
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col flex-1 gap-5 text-sm font-light">
                                  <div>Pendiente de activación</div>
                                  <div id={`qr-${index}`}>
                                    <QRCodeCanvas
                                      value={est.activationURL}
                                      size={200}
                                    />
                                  </div>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={handleClip}
                                  >
                                    Copiar Qr
                                  </Button>
                                  <span className="text-normal font-medium">
                                    Expira:{" "}
                                    {new Date(
                                      est.tokenExpiresAt
                                    ).toLocaleString("es-ES", {
                                      timeZone:
                                        "America/Argentina/Buenos_Aires",
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false, // Asegura formato 24 horas
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </div>
              </CardContent>
            </ScrollArea>
          )}
        </div>
      </Card>
    );
  }
  if (currentrol.list == "Familiares") {
    return (
      <Card className="p-2 h-[90vh] flex flex-col justify-start gap-3 ">
        <CardHeader className="p-3">
          <CardTitle className="flex justify-between">
            {" "}
            <span className="text-xl">
              {" "}
              <i className="fa-solid fa-users text-md"></i> Familiares
            </span>
            <CreateFam familiares={familiares} setState={setState}></CreateFam>
          </CardTitle>
          <CardDescription className="flex flex-col">
            <span>
              Seleccione a un familiar para ver sus datos o actualizarlos
            </span>
            <span className="font-medium">
              {" "}
              Las cuentas inactivas se activan al acceder al escanear el código
              Qr y establecer la contraseña
            </span>
            <span className="font-medium">
              Si un usuario no recuerda su contraseña, la opción Restaurar
              Contraseña desactiva al usuario y brina un nuevo Qr para
              establecer una nueva contraseña
            </span>
          </CardDescription>
        </CardHeader>
        <div className="h-full">
          {familiares.length !== 0 && (
            <ScrollArea className="h-[65vh] flex-1">
              <CardContent className="flex flex-row justify-between  flex-wrap">
                <div className=" max-w-[700px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas activas
                  </CardTitle>
                  <ScrollArea className="h-[60vh] w-autp p-2  rounded-2xl">
                    <div className=" flex justify-center flex-wrap">
                      {familiaresActivos.map((fam, index) => {
                        return (
                          <Card
                            className="flex flex-col justify-between  min-w-[250px] gap-0 h-auto p-2 text-xl"
                            key={index}
                          >
                            <CardTitle className="flex justify-start">
                              <div className="flex flex-row items-center p-1">
                                <div className="">
                                  <ComboboxFam
                                    cursos={cursos}
                                    _estudiantes={estudiantes}
                                    familiar={fam}
                                    setState={setState}
                                    className="w-full"
                                    materias={materias}
                                    familiares={familiares}
                                  />
                                </div>
                              </div>
                            </CardTitle>

                            <CardFooter className="flex justify-start">
                           
                                <div className="text-sm font-light flex-1 gap-2 flex flex-col justify-between flex-wrap">
                                  Usuario: {fam.user}{" "}
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={() =>
                                      handleRecuperar(fam.id, fam.user)
                                    }
                                  >
                                    Reestablecer contraseña
                                  </Button>
                                </div>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
                <div className="min-w-[300px] max-w-[400px] flex flex-col gap-2">
                  <CardTitle className="text-center m-0 p-0  flex flex-col justify-center text-xl">
                    Cuentas Inactivas
                  </CardTitle>

                  <ScrollArea className="h-[60vh] w-full p-2  rounded-2xl ">
                    {familiaresInactivos.map((fam, index) => {
                      const now = new Date();
                      const isExpired =
                        new Date(fam.tokenExpiresAt) < now ? true : false;

                      const handleClip = () => {
                        const qrElement = document.getElementById(
                          `qr-${index}`
                        ); // Buscar el QR en el DOM

                        if (qrElement) {
                          domtoimage.toBlob(qrElement).then((blob) => {
                            const clipboardItem = new ClipboardItem({
                              "image/png": blob,
                            });
                            navigator.clipboard.write([clipboardItem]).then(
                              () => alert("QR copiado al portapapeles"),
                              () => alert("Error al copiar al portapapeles")
                            );
                          });
                        } else {
                          alert("No se encontró el QR");
                        }
                      };

                      return (
                        <Card
                          className="flex flex-col justify-between items-center  w-full gap-0 h-auto p-2 text-xl"
                          key={index}
                        >
                          <CardTitle className="flex justify-start">
                            <div className="flex flex-row items-center p-1">
                              <div className="">
                                <ComboboxFam
                                  cursos={cursos}
                                  _estudiantes={estudiantes}
                                  familiar={fam}
                                  setState={setState}
                                  className="w-full"
                                  materias={materias}
                                  familiares={familiares}
                                />
                              </div>
                            </div>
                          </CardTitle>
                          {/* <form onSubmit={(e) => handleDelCur(e, index)}>
                    <Button type="submit" variant="secondary">
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </form> */}
                          <CardFooter className="flex flex-col justify-center">
                            <div className="text-sm font-light flex-1 flex flex-col gap-2 pb-3">
                              <div>Usuario: {fam.user}</div>{" "}
                              {/* Estado de autenticación */}
                              {isExpired ? (
                                <div className="flex flex-col gap-3 items-start justify-between">
                                  <span className="text-black text-sm font-light">
                                    Token expirado
                                  </span>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={() =>
                                      handleRecuperar(fam.id, fam.user)
                                    }
                                  >
                                    Regenerar Qr
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col flex-1 gap-5 text-sm font-light">
                                  <div>Pendiente de activación</div>
                                  <div id={`qr-${index}`}>
                                    <QRCodeCanvas
                                      value={fam.activationURL}
                                      size={200}
                                    />
                                  </div>
                                  <Button
                                    variant="secondary"
                                    className="hover:bg-accent-foreground hover:text-accent"
                                    onClick={handleClip}
                                  >
                                    Copiar Qr
                                  </Button>
                                  <span className="text-normal font-medium">
                                    Expira:{" "}
                                    {new Date(
                                      fam.tokenExpiresAt
                                    ).toLocaleString("es-ES", {
                                      timeZone:
                                        "America/Argentina/Buenos_Aires",
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false, // Asegura formato 24 horas
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </ScrollArea>
                </div>
              </CardContent>
            </ScrollArea>
          )}
        </div>
      </Card>
    );
  }
  if (currentrol.list == "Periodos") {
    return (
      <Card className="p-2 h-[90vh] flex flex-col justify-start gap-3 ">
        <CardHeader className="p-3">
          <CardTitle className="flex justify-between">
            <span className="text-xl">
              {" "}
              <i className="fa-solid fa-timeline text-md"></i> Periodos
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-row justify-center gap-2 px-2 border-0 hover:bg-accent w-[30%]"
                >
                  <i className="fa-solid fa-plus"></i>Crear
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Periodo</DialogTitle>
                  <DialogDescription>
                    Ingrese los datos del nuevo periodo
                  </DialogDescription>
                </DialogHeader>
                <CardContent className="flex flex-col gap-2">
                  <div>Nombre</div>
                  <Input
                    placeholder="nombre"
                    value={credentialsPer.nombre}
                    onChange={handleChangePer}
                    name="nombre"
                  />
                </CardContent>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    {credentialsPer.nombre != "" && percontrol ? (
                      <form
                        onSubmit={(e) => handleSubmitPer(e)}
                        className="flex items-center space-x-2"
                      >
                        <Button type="submit" variant="secondary">
                          Guardar
                        </Button>
                      </form>
                    ) : (
                      <Button type="submit" disabled variant="secondary">
                        {percontrol
                          ? "Aún debe llenar campos"
                          : "no se deben repetir los nombres"}
                      </Button>
                    )}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] w-full p-2 border rounded-2xl ">
            {periodos.length != 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {periodos.map((per, index) => {
                  return (
                    <Card
                      className="flex flex-col justify-between  w-full gap-0 h-auto p-2 text-xl"
                      key={index}
                    >
                      <CardTitle className="flex justify-start">
                        <ComboboxPer
                          setState={setState}
                          periodo={per}
                          periodos={periodos}
                        ></ComboboxPer>
                      </CardTitle>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
}
