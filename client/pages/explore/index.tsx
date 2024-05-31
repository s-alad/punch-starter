import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Post from "@/components/Post";

interface Post {
  projectName: string;
  author: string;
  description: string;
  image: string;
  upvoteCount: number;
  onUpvote: () => void;
}

const examplePosts: Post[] = [
  {
    projectName: "BeFit",
    author: "Xavier D'Mello & William Wang",
    description:
      "BeFit revolutionizes fitness motivation by blending the spontaneity of BeReal with the accountability and rewards of exercising. At random times, BeFit prompts users to",
    image: "./befit.jpeg",
    upvoteCount: 71,
    onUpvote: () => console.log("Upvoted Project 1"),
  },
  {
    projectName: "Movelo",
    author: "Colin, Wes, & Saad",
    description: "",
    image: "./movelo.png",
    upvoteCount: 62,
    onUpvote: () => console.log("Upvoted Project 2"),
  },
  {
    projectName: "ZkVote",
    author: "Colin",
    description:
      "A new way to commute. Pay for your morning coffee with your bike ride.",
    image: "/zkvote.png",
    upvoteCount: 25,
    onUpvote: () => console.log("Upvoted Project 2"),
  },
];

export default function Explore() {
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
          <Box maxW={"350px"} height="450px">
            <Post
              key={index}
              projectName={post.projectName}
              author={post.author}
              description={post.description}
              image={post.image}
              upvoteCount={post.upvoteCount}
              onUpvote={post.onUpvote}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
