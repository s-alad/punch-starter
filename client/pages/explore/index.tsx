import React, { useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Post from "@/components/Post";

interface Post {
  projectName: string;
  author: string;
  description: string;
  image: string;
  initialUpvoteCount: number;
}

const examplePosts: Post[] = [
  {
    projectName: "BeFit",
    author: "Xavier D'Mello & William Wang",
    description:
      "BeFit revolutionizes fitness motivation by blending the spontaneity of BeReal with the accountability and rewards of exercising. At random times, BeFit prompts users to",
    image: "./befit.jpeg",
    initialUpvoteCount: 71,
  },
  {
    projectName: "Movelo",
    author: "Colin, Wes, & Saad",
    description: "",
    image: "./movelo.png",
    initialUpvoteCount: 62,
  },
  {
    projectName: "ZkVote",
    author: "Colin",
    description:
      "A new way to commute. Pay for your morning coffee with your bike ride.",
    image: "/zkvote.png",
    initialUpvoteCount: 25,
  },
];

export default function Explore() {
  const [upvoteCounts, setUpvoteCounts] = useState<Record<number, number>>(
    examplePosts.reduce(
      (acc, post, index) => ({ ...acc, [index]: post.initialUpvoteCount }),
      {}
    )
  );

  const handleUpvote = (index: number) => {
    setUpvoteCounts((prevCounts) => ({
      ...prevCounts,
      [index]: prevCounts[index] + 1,
    }));
  };

  return (
    <Box>
      <Box mb="10px"></Box>
      <SimpleGrid
        columns={2}
        spacing={4}
        justifyItems="center"
        alignItems="center"
      >
        {examplePosts.map((post, index) => (
          <Box key={index} maxW={"350px"} height="450px">
            <Post
              projectName={post.projectName}
              author={post.author}
              description={post.description}
              image={post.image}
              upvoteCount={upvoteCounts[index]}
              onUpvote={() => handleUpvote(index)}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
