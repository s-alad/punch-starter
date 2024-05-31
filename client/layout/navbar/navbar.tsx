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

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { user, raiser, connect } = useAuth();
  const [search, setSearch] = useState("");
  const [currentChain, setCurrentChain] = useState("");

  const theme = useTheme();

  const accentColor = theme.colors.accent;
  const inputBgColor = useColorModeValue("black", "black");
  const textColor = useColorModeValue("white", "white");

  const logoSrc = useBreakpointValue({
    base: "/mobile-logo.png",
    md: "/logo.png",
  });

  useEffect(() => {
    const updateCurrentChain = () => {
      if (router.pathname.includes("/stacks")) {
        setCurrentChain("stacks");
      } else if (router.pathname.includes("/stellar")) {
        setCurrentChain("stellar");
      } else if (router.pathname.includes("/sui")) {
        setCurrentChain("sui");
      } else {
        setCurrentChain("rootstock");
      }
    };

    updateCurrentChain();
  }, [router.pathname]);

  async function lookup() {
    if (search) {
      if (!router.pathname.includes("/explore")) {
        setSearch("");
        router.push(`/explore?search=${search}`);
      } else {
        setSearch("");
        router.replace(`/explore?search=${search}`);
      }
    }
  }

  console.log(router.pathname);
  return (
    <Box p="15px" width="100%" bg="black">
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent={{ base: "flex-start", md: "space-between" }}
        alignItems="center"
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width={{ base: "100%", md: "auto" }}
          mb={{ base: "15px", md: "0" }}
        >
          <Image src={logoSrc} height="25px" />

          <Box display={{ base: "block", md: "none" }} ml="auto">
            <ConnectButton />
          </Box>
        </Flex>

        <Box
          flex={{ base: "1" }}
          mx={{ base: "0", md: "50px" }} // Added margin for desktop view
          width={{ base: "100%", md: "auto" }}
        >
          <InputGroup height="30px" width="100%">
            <InputLeftAddon height="30px" bg={accentColor}>
              <SearchIcon height="30px" color="white" />
            </InputLeftAddon>
            <Input
              height="30px"
              placeholder="Search Punchstarter"
              bg={inputBgColor}
              color={textColor}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  lookup();
                }
              }}
              width="100%"
            />
          </InputGroup>
        </Box>

        <Box display={{ base: "none", md: "block" }} ml={{ md: "auto" }}>
          <Flex>
            <Button style={{marginRight: 20}} onClick={() => router.push("/import")}>New Project</Button>
            <ConnectButton />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
