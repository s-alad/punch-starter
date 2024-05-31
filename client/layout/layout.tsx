import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";
import s from "./layout.module.scss"
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section className={s.layout}>
            <Navbar />
            <div style={{display: 'flex', width: '100%', height: '100%'}}>
                <Sidebar />
                <div className={s.children}>
                    {children}
                </div>
            </div>
        </section>
    )
}