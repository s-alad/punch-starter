import React from "react";
import { useEffect, useState } from "react";
import Post from "@/components/Post";
import { Box, Heading } from "@chakra-ui/react";
// find top post and display as card
export default function Top() {
  return (
    <Box alignItems={"center"} display={"flex"} flexDirection={"column"}>
      <Heading mb="7px" size="sm" fontWeight={"400"} textColor={"#d3d3d3"}>
        Punchstarter Featured
      </Heading>

      <Box maxW={"500px"} height={"500px"}>
        <Post
          projectName="googly googly"
          author="rfk"
          description="googly boogly oogly loogly. googly boogly oogly loogly.googly boogly oogly loogly.googly boogly oogly loogly.googly boogly oogly loogly.googly boogly oogly loogly.googly boogly oogly loogly."
          image="https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75"
          upvoteCount={69}
          onUpvote={() => console.log("rahhhh")}
        />
      </Box>
    </Box>
  );
}
