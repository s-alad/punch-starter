import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ChatUI } from "@/pages/chat";
import Post from "@/components/Post";
import React from "react";
import { projectList } from "@/utils/constant";

// find top post and display as card
export default function Top() {
  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  const chat = ChatUI(project, creator);
  return (
    <Box alignItems={"center"} display={"flex"} flexDirection={"column"}>
      <Heading mb="7px" size="sm" fontWeight={"400"} textColor={"#d3d3d3"}>
        Punchstarter Featured
      </Heading>
      {project && creator && chat}
      <Box maxW={"500px"} height={"500px"}>
        {projectList &&
          projectList.map((elem, index) => {
            const project = elem.project;
            const creator = elem.creator;
            return (
              <div onClick={() => {
                setProject(project);
                setCreator(creator);
              }}>
                <Post
                  projectName={project.projectname}
                  author={creator.name}
                  description={project.projectdescription}
                  image={
                    project.projectimageurl ||
                    "https://picsum.photos/seed/picsum/800/500?random=" + index
                  }
                  upvoteCount={69}
                  onUpvote={() => console.log("rahhhh")}
                ></Post>
              </div>
            );
          })}
      </Box>
    </Box>
  );
}
