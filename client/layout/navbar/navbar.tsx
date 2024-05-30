import React from "react";
import { useEffect, useState } from "react";
import { FaHandPointer, FaSearch, FaUser } from "react-icons/fa";

import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import { Box } from "@chakra-ui/react";
export default function Navbar() {
  const router = useRouter();
  const { user, raiser, connect } = useAuth();
  const [search, setSearch] = useState("");
  async function lookup() {
    if (search) {
      // if not currently on /explore page, then navigate to explore with search query in url
      if (!router.pathname.includes("/explore")) {
        setSearch("");
        router.push(`/explore?search=${search}`);
      } else {
        // if currently on /explore page, then update the search query in url
        setSearch("");
        router.replace(`/explore?search=${search}`);
      }
    }
  }

  return (
    <nav>
      <div>
        <FaHandPointer />
        <div>Touched</div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search for projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div onClick={lookup}>
          <FaSearch />
        </div>
      </div>
      <div>
        <div>
          <FaUser />
          <div>{"connect"}</div>
        </div>
      </div>
    </nav>
  );
}
