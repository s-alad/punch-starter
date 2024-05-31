import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";
import { Box, Divider } from "@chakra-ui/react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box backgroundColor={"black"}>
      <Box maxWidth={"1000px"} margin="auto">
        <Navbar />
        <Divider />

        <Box display={"flex"} flexDirection={"row"}>
          <Sidebar />
          <Box px="20px" py="10px">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
