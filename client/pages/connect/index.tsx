import React from "react";
import s from "./connect.module.scss"
import { useAuth } from "@/context/authcontext";

export default function Connect() {

    const { connect, puncher } = useAuth()

    return (
        <main className={s.connect}>
            <h1>Connect to Punch Starter!</h1>
            <button
                onClick={
                    async () => {
                        await connect('github')
                    }
                }
            >
                github
            </button>
            {puncher && puncher.email}
        </main>
    )
}