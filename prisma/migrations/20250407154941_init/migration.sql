-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "oneTimeToken" TEXT,
    "tokenExpiresAt" DATETIME,
    CONSTRAINT "Estudiante_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Familiar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "oneTimeToken" TEXT,
    "tokenExpiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "oneTimeToken" TEXT,
    "tokenExpiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,
    CONSTRAINT "Curso_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    CONSTRAINT "Materia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Materia_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaPublicacion" DATETIME NOT NULL,
    "fechaEntrega" DATETIME NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "periodoId" INTEGER NOT NULL,
    CONSTRAINT "Tarea_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estudianteId" INTEGER NOT NULL,
    "tareaId" INTEGER NOT NULL,
    "calificacion" REAL NOT NULL,
    "estado" TEXT NOT NULL,
    CONSTRAINT "Calificacion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Calificacion_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Promedio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estudianteId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "periodoId" INTEGER NOT NULL,
    "promedio" REAL NOT NULL,
    CONSTRAINT "Promedio_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promedio_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promedio_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MensajesPreceptores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mensaje" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    CONSTRAINT "MensajesPreceptores_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MensajesPreceptores_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MensajesProfesores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mensaje" TEXT NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    CONSTRAINT "MensajesProfesores_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MensajesProfesores_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EstudiantesFamiliares" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EstudiantesFamiliares_A_fkey" FOREIGN KEY ("A") REFERENCES "Estudiante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EstudiantesFamiliares_B_fkey" FOREIGN KEY ("B") REFERENCES "Familiar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_key" ON "Admin"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_user_key" ON "Estudiante"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_email_key" ON "Estudiante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_oneTimeToken_key" ON "Estudiante"("oneTimeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_user_key" ON "Familiar"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_email_key" ON "Familiar"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_oneTimeToken_key" ON "Familiar"("oneTimeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_user_key" ON "Docente"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_email_key" ON "Docente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_oneTimeToken_key" ON "Docente"("oneTimeToken");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nombre_key" ON "Curso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_estudianteId_tareaId_key" ON "Calificacion"("estudianteId", "tareaId");

-- CreateIndex
CREATE UNIQUE INDEX "Promedio_estudianteId_materiaId_periodoId_key" ON "Promedio"("estudianteId", "materiaId", "periodoId");

-- CreateIndex
CREATE UNIQUE INDEX "_EstudiantesFamiliares_AB_unique" ON "_EstudiantesFamiliares"("A", "B");

-- CreateIndex
CREATE INDEX "_EstudiantesFamiliares_B_index" ON "_EstudiantesFamiliares"("B");
