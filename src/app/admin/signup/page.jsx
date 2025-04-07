"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import * as React from "react";
import Carousel from "../../../components/carrousel.jsx";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 justify-between gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
          <i className="m-auto fa-solid font-medium fa-address-book" />
          Nota Pro
        </a>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <Carousel className=" max-w-xs " />
      </div>
    </div>
  );
}
