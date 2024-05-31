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
      upvoteCount: 100,
      thumbnailUrl:
        "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
    },
    {
      id: 2,
      projectName: "Glazed",
      upvoteCount: 90,
      thumbnailUrl:
        "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
    },
    {
      id: 3,
      projectName: "Cat",
      upvoteCount: 1,
      thumbnailUrl:
        "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
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
