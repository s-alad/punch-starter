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

        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          <Sidebar />
          {children}
        </div>
      </Box>
    </Box>
  );
}
