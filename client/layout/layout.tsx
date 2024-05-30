import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";
import {Dashboard}  from "@/components/dashboard"
import { TooltipProvider } from "@/components/ui/tooltip";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TooltipProvider>
            <Dashboard></Dashboard>
            </TooltipProvider>
     
        </>
    )
}