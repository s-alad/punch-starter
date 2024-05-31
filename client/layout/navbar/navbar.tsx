import React from "react";
import { useEffect, useState } from "react";
import { FaHandPointer, FaSearch, FaUser } from "react-icons/fa";
import s from "./navbar.module.scss"
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";

export default function Navbar() {
    const router = useRouter();
    const { puncher, connect } = useAuth()
    const [search, setSearch] = useState("");
    async function lookup() {
        if (search) {
            // if not currently on /explore page, then navigate to explore with search query in url
            if (!router.pathname.includes("/explore")) {
                setSearch("")
                router.push(`/explore?search=${search}`);
            } else {
                // if currently on /explore page, then update the search query in url
                setSearch("")
                router.replace(`/explore?search=${search}`);
            }
        }
    }

    return (
        <nav className={s.nav}>
            <div className={s.splash}>
                <FaHandPointer />
                <div>Touched</div>
            </div>
            <div className={s.search}>
                <input
                    type="text"
                    placeholder="Search for projects"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={s.magnify}
                    onClick={lookup}
                ><FaSearch /></div>
            </div>
            <div className={s.actions}>
                <Link href={'/connect'} className={s.connect}>
                    <FaUser />
                    <div>{"connect"}</div>
                </Link>
            </div>
        </nav>
    )
}