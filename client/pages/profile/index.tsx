import React from "react";
import s from "./profile.module.scss";
import { useAuth } from "@/context/authcontext";


export default function Profile() {

    const {session, puncher, disconnect, connect} = useAuth()

    return (
        <div className={s.profile}>
            <h2>Profile</h2>
            <div className={s.username}>
                <h3>Username</h3>
                <p>{puncher?.username}</p>
            </div>
            <div className={s.email}>
                <h3>Email</h3>
                <p>{session?.user.email}</p>
            </div>
            <button onClick={disconnect}>Logout</button>
        </div>
    )
}