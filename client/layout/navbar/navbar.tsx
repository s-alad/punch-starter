import React from "react";
import { useEffect, useState } from "react";
import { FaHandPointer, FaSearch, FaUser } from "react-icons/fa";

import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";

export default function Navbar() {
    const router = useRouter();
    const { user, raiser, connect } = useAuth()
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
        <nav className={"w-full bg-red-400"}>
            <div className={""}>
                <FaHandPointer />
                <div>Punchstarter</div>
            </div>
            <div className={""}>
                <input
                    type="text"
                    placeholder="Search for projects"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className={""}
                    onClick={lookup}
                ><FaSearch /></div>
            </div>
            <div className={""}>
                <div className={""}>
                    <FaUser />
                    <div>{"connect"}</div>
                </div>
            </div>
        </nav>
    )
}