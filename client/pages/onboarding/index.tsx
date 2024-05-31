import React from "react";
import s from "./onboarding.module.scss"
import { useAuth } from "@/context/authcontext";

export default function Onboarding() {

    const { connect, puncher } = useAuth()

    return (
        <main className={s.onboarding}>
            <h1>Welcome to Touched!</h1>
            <p>we need some information to get you started</p>
        </main>
    )
}