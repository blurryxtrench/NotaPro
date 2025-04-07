import * as React from "react";

import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import UpdateMat from "./update-mat.jsx";

export default function CardMat({
  materia,
  docentes,
  setChange,
  setMateria,
  setActiveTab,
  index,
}) {
  let docente = docentes.find((doc) => doc.id === materia.docenteId);
  const handleButton = (e) => {
    e.preventDefault();
    setMateria(materia);
    setActiveTab("promedios");
  };
  return (
    <div
      key={index}
      className="bg-white p-3 rounded-lg hover:bg-accent flex-1 flex flex-col gap-2"
    >
      <CardHeader>
        <CardTitle> {materia.nombre} </CardTitle>
        <CardDescription>
          {materia.tareas.length} Tareas publcacadas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <CardTitle>
          Profesor:{" "}
          <span className="font-light">
            {docente.nombre} {docente.apellido}
          </span>
        </CardTitle>
        <CardTitle>
          Email del profesor:{" "}
          <span className="font-light">{docente.email}</span>
        </CardTitle>
        <UpdateMat
          materia={materia}
          docente={docente}
          docentes={docentes}
          setChange={setChange}
        />
        <form onSubmit={handleButton}>
          <Button type="submit" variant="outline">
            Ver Promedios
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
