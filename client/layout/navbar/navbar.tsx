import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  useBreakpointValue,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaHandPointer, FaSearch, FaUser, FaPlus } from "react-icons/fa";
import s from "./navbar.module.scss"
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import Link from "next/link";
import Image from "next/image";

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
                <Image src="/fire.svg" width={50} height={50} alt="logo"/>
                <>Punch Starter</>
            </div>

            <div className={s.right}>
                <div className={s.search}>
                    <div className={s.magnify}
                        onClick={lookup}
                    ><FaSearch /></div>
                    <input
                        type="text"
                        placeholder="Search for projects"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={s.actions}>
                    <Link href={
                        puncher ? "/punch" : '/connect'} className={s.create}>
                        <FaPlus />
                        <div>
                            create
                        </div>
                    </Link>
                    <Link href={
                        puncher ? "/profile" : '/connect'} className={s.connect}>
                        <FaUser />
                        <div>
                            {puncher ? puncher.username : "Connect"}
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
