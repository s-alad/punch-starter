import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Sidebar />
        {children}
      </div>
    </>
  );
}
