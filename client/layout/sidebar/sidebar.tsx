import React from "react";
import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaHome} from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import s from "./sidebar.module.scss"
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";

export default function Sidebar() {
    const router = useRouter();
    const { user, raiser, connect } = useAuth()

    const feed = [
        {
            name: "Home",
            href: "/",
            icon: FaHome,
        },
        {
            name: "Explore",
            href: "/explore",
            icon: MdOutlineExplore
        },
    ]
    const subchains = [
        {
            name: "Stacks",
            href: "/c/stacks",
            icon: 'https://cryptologos.cc/logos/stacks-stx-logo.png',
        },
        {
            name: "Stellar",
            href: "/c/stellar",
            icon: 'https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png',
        },
        {
            name: "Sui",
            href: "/c/sui",
            icon: "https://cryptologos.cc/logos/sui-sui-logo.png"
        },
    ]
    
    return (
        <nav className={s.nav}>
            {
                feed.map((feed, index) => (
                    <Link key={index} href={feed.href}>
                        { <feed.icon />}
                        <div>{feed.name}</div>
                    </Link>))
            }
            <div className={s.divider}></div>
            {
                subchains.map((subchain, index) => (
                    <Link key={index} href={subchain.href}>
                        { <img src={subchain.icon} alt="icon" />}
                        <div>{subchain.name}</div>
                    </Link>))
            }
        </nav>
    )
}