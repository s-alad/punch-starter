import React from "react";
import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaHome, FaRegUserCircle} from "react-icons/fa";
import s from "./top.module.scss"

export default function Top() {
    return (
        <div className={s.top}>
            <h1>Most Touched Today!</h1>
            <div className={s.card}>
                <img src="https://cdn.pixabay.com/photo/2018/01/18/07/31/bitcoin-3089728_1280.jpg" />
                <div  className={s.progress}>
                    <span></span>
                </div>
                <div className={s.info}>
                    <div className={s.left}>
                        <FaRegUserCircle />
                    </div>
                    <div className={s.right}>
                        <h2>The Bitcoin Layer X</h2>
                        <h3>randomartist007</h3>
                    </div>
                </div>
                <p className={s.description}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sint, 
                    ipsam totam officiis praesentium, voluptates aut consectetur commodi doloribus dicta debitis, 
                    sapiente corrupti rerum autem consequuntur doloremque incidunt. Impedit, minima.
                </p>
            </div>
        </div>
    )
}