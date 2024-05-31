import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Post from "@/components/Post";
import React from "react";

// find top post and display as card
export default function Top() {
  return (
    <Box alignItems={"center"} display={"flex"} flexDirection={"column"}>
      <Heading mb="7px" size="sm" fontWeight={"400"} textColor={"#d3d3d3"}>
        Punchstarter Featured
      </Heading>

      <Box maxW={"500px"} height={"500px"}>
        <Post
          projectName="BeFit"
          author="Xavier D'Mello & William Wang"
          description="BeFit revolutionizes fitness motivation by blending the spontaneity of BeReal with the accountability and rewards of exercising. At random times, BeFit prompts users to complete a specified exercise, using machine learning to verify completion via camera. Successfully performed exercises are rewarded with unique NFTs, creating a tangible record of achievements. Users can view friends' exercise accomplishments, fostering a community of support and motivation. "
          image="/befit.jpeg"
          upvoteCount={69}
          onUpvote={() => console.log("rahhhh")}
        />
      </Box>
    </Box>
  );
}
