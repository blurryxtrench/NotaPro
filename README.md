# NotaPro

NotaPro es una aplicación web construida con Next.js para gestionar de forma eficiente las calificaciones en una escuela secundaria. Permite crear y administrar usuarios como docentes, estudiantes y familiares, centralizando la información académica de manera clara, rápida y accesible.

## Tecnologías utilizadas:

<div className="flex flex-col gap-1">
  <div>Next.js como framework principal</div>
  <div>Prisma como ORM para manejar la base de datos</div>
  <div>SQLite como motor de base de datos</div>
  <div>Tailwind CSS para el diseño responsivo</div>
  <div>ShadCN para una interfaz moderna y accesible</div>

</div>

## Posibles Futuras Mejoras

<div>En el futuro pueden agragarse más funciones como registrar asistencia, un calendario principal para en el inicio de cada perfil o incluso un chat privado entre los usuarios.
Otra idea puede ser la posibilidad de establecer las fechas de inicio y fin de los períodos lectivos y que cuando finalice el último se generen automátiamente planillas con los promedios de los estudiantes</div>

## 🚀 Paso a paso para inicializar el proyecto
  <ul>
          <li>1. **Descarga y descomprime** el proyecto.</li>
          <li>
            2. Abre una terminal en la carpeta del proyecto y ejecuta el
            siguiente comando para instalar las dependencias:
            <pre>```bash npm install --legacy-peer-deps ```</pre>
          </li>
          <li>
            3. Ejecuta el comando de construcción:
            <pre>```bash npm run build ```</pre>
          </li>
          <li>
            4. Abre el archivo .env y modifica la variable SECRET_KEY. Por
            seguridad, reemplaza el valor predeterminado mySecretKey por una
            cadena segura de al menos 10 caracteres que combine letras, números
            y símbolos.
          </li>
          <li>
            5. Ejecutar el proyecto con el comando
            <pre>```bash npm run dev ```</pre>
          </li>
        </ul>
