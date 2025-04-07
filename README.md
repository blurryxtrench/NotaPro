# NotaPro

NotaPro es una aplicación web construida con Next.js para gestionar de forma eficiente las calificaciones en una escuela secundaria. Permite crear y administrar usuarios como docentes, estudiantes y familiares, centralizando la información académica de manera clara, rápida y accesible.

## Tecnologías utilizadas:

<ol className="flex flex-col gap-1">
  <li>Next.js como framework principal</li>
  <li>Prisma como ORM para manejar la base de datos</li>
  <li>SQLite como motor de base de datos</li>
  <li>Tailwind CSS para el diseño responsivo</li>
  <li>ShadCN para una interfaz moderna y accesible</li>

</ol>

## Posibles Futuras Mejoras

<div>En el futuro pueden agragarse más funciones como registrar asistencia, un calendario principal para en el inicio de cada perfil o incluso un chat privado entre los usuarios.
Otra idea puede ser la posibilidad de establecer las fechas de inicio y fin de los períodos lectivos y que cuando finalice el último se generen automátiamente planillas con los promedios de los estudiantes</div>

## 🚀 Paso a paso para inicializar el proyecto
  <ol>
          <li>Descarga y descomprime el proyecto.</li>
          <li>
            Abre una terminal en la carpeta del proyecto y ejecuta el
            siguiente comando para instalar las dependencias:
            <pre><code>npm install --legacy-peer-deps</code></pre>
          </li>
          <li>
            Ejecuta el comando de construcción:
          <pre><code>npm run build</code></pre>
          </li>
          <li>
            Abre el archivo .env y modifica la variable SECRET_KEY. Por
            seguridad, reemplaza el valor predeterminado mySecretKey por una
            cadena segura de al menos 10 caracteres que combine letras, números
            y símbolos.
          </li>
          <li>
            Ejecutar el proyecto con el comando
            <pre><code>npm run dev</code></pre>
          </li>
        </ol>
