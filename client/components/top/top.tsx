import React from "react";
import { useEffect, useState } from "react";

import s from "./top.module.scss"

export default function Top() {
    return (
        <div className={s.top}>
            <h1>Most Touched Today!</h1>
            <div>
                <img src="https://cdn.pixabay.com/photo/2018/01/18/07/31/bitcoin-3089728_1280.jpg" />
                <h2>Project Name</h2>
                <h3>author: xyz</h3>
                <p className={s.description}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident sint, 
                    ipsam totam officiis praesentium, voluptates aut consectetur commodi doloribus dicta debitis, 
                    sapiente corrupti rerum autem consequuntur doloremque incidunt. Impedit, minima.
                </p>
            </div>
        </div>
    )
}