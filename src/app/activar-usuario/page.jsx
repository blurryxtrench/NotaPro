"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import * as React from "react";
import ActivarUsuario from "../../components/activar-usuario.js";
import { Suspense } from "react";
export default function Page() {
  return (
    <div className="flex flex-col flex-1 justify-between gap-4 ">
      <div className="flex-1 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[100vh]">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            </div>
          }
        >
          <ActivarUsuario className=" max-w-xs " />
        </Suspense>
      </div>
    </div>
  );
}
