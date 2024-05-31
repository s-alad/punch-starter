import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Image,
  InputLeftAddon,
  Input,
  InputGroup,
  useColorModeValue,
  useTheme,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const router = useRouter();
  const { user, raiser, connect } = useAuth();
  const [search, setSearch] = useState("");

  const theme = useTheme();

  const accentColor = theme.colors.accent;
  const inputBgColor = useColorModeValue("black", "black");
  const textColor = useColorModeValue("white", "white");

  const logoSrc = useBreakpointValue({
    base: "/mobile-logo.png",
    md: "/logo.png",
  });

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
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
}
