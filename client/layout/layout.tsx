import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import Sidebar from "./sidebar/sidebar";
import Leaderboard from "@/components/Leaderboard";
import { Box, Divider } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [leaderboardData, setLeaderboardData] = useState([
    {
      id: 1,
      projectName: "BeFit",
      upvoteCount: 71,
      thumbnailUrl: "/befit.jpeg",
    },
    {
      id: 2,
      projectName: "Movelo",
      upvoteCount: 62,
      thumbnailUrl: "/movelo.png",
    },
    {
      id: 3,
      projectName: "ZkVote",
      upvoteCount: 25,
      thumbnailUrl: "/zkvote.png",
    },
  ]);

  return (
    <Box backgroundColor={"black"}>
      <Box maxWidth={"1400px"} margin="auto">
        <Navbar />
        <Divider />

        <Box display={"flex"} flexDirection={"row"}>
          <Sidebar />
          <Box px="20px" py="5px" flex={1}>
            {children}
          </Box>
          <Leaderboard data={leaderboardData} />
        </Box>
      </Box>
    </Box>
  );
}
