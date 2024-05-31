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
    projectName: "Project 1",
    author: "Author 1",
    description: "Description of Project 1",
    image:
      "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
    upvoteCount: 10,
    onUpvote: () => console.log("Upvoted Project 1"),
  },
  {
    projectName: "Project 2",
    author: "Author 2",
    description: "Description of Project 2",
    image:
      "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
    upvoteCount: 20,
    onUpvote: () => console.log("Upvoted Project 2"),
  },
  {
    projectName: "Project 2",
    author: "Author 2",
    description: "Description of Project 2",
    image:
      "https://chumley.barstoolsports.com/union/2024/04/19/zuck-beard.e8aec17b.jpeg?fit=bounds&format=pjpg&auto=webp&quality=85%2C75",
    upvoteCount: 20,
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
          <Box width={"350px"}>
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
