import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  StackDivider,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { use, useEffect, useState } from "react";

import {emptyProject} from "@/utils/constant";

export function EditableProjectUI(inputProject: any) {
  const [project, setProject] = useState(emptyProject);

  useEffect(() => {
    if (inputProject) {
      console.log(inputProject);
      setProject(inputProject);
    }
  }, [inputProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: value,
    });
  };

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = project.milestones.map((milestone, i) =>
      i === index ? { ...milestone, [name]: value } : milestone
    );
    setProject({
      ...project,
      milestones: updatedMilestones,
    });
  };

  return (
    project && <Box maxW="4xl" mx="auto" p="4">
      <Heading as="h1" size="lg" mb="4">
        Edit Project
      </Heading>
      <VStack
        spacing="4"
        divider={<StackDivider borderColor="gray.200" />}
        align="stretch"
      >
        <FormControl>
          <FormLabel>Project Punchline</FormLabel>
          <Textarea
            name="projectpunchline"
            value={project.projectpunchline}
            onChange={handleInputChange}
            placeholder="Enter project punchline"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Project Description</FormLabel>
          <Textarea
            name="projectdescription"
            value={project.projectdescription}
            onChange={handleInputChange}
            placeholder="Enter project description"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Expiry Date</FormLabel>
          <Input
            type="date"
            name="expiry"
            value={project.expiry}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Funding Goal</FormLabel>
          <Input
            type="number"
            name="fundinggoal"
            value={project.fundinggoal}
            onChange={handleInputChange}
          />
        </FormControl>
        <Heading as="h2" size="md" mt="4" mb="2">
          Milestones
        </Heading>
        {project.milestones &&
          project.milestones.map((milestone, index) => (
            <Box key={index} p="4" borderWidth="1px" borderRadius="lg">
              <FormControl mb="2">
                <FormLabel>Milestone Name</FormLabel>
                <Input
                  type="text"
                  name="milestonename"
                  value={milestone.milestonename}
                  onChange={(e) => handleMilestoneChange(index, e)}
                  placeholder="Enter milestone name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Milestone Description</FormLabel>
                <Textarea
                  name="milestonedescription"
                  value={milestone.milestonedescription}
                  onChange={(e) => handleMilestoneChange(index, e)}
                  placeholder="Enter milestone description"
                />
              </FormControl>
            </Box>
          ))}
      </VStack>
    </Box>
  );
}

