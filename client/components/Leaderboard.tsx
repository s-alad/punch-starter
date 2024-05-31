import React from "react";
import { Box, Heading, Flex, Image, Text, Icon } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

interface LeaderboardProps {
  data: {
    id: number;
    projectName: string;
    upvoteCount: number;
    thumbnailUrl: string;
  }[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const sortedData = data.sort((a, b) => b.upvoteCount - a.upvoteCount);

  return (
    <Box
      borderLeft="1px"
      borderColor="#888b90"
      width={{ base: "80%", md: "20%" }}
    >
      <Box height="10px" />
      <Heading size={"sm"} fontWeight={"400"} color={"#d3d3d3"} ml={4} mb={4}>
        Leaderboard
      </Heading>
      {sortedData.map((item, index) => (
        <Flex
          key={item.id}
          alignItems="center"
          mb={3}
          ml={4}
          justifyContent={"space-between"}
          pr="30px"
          maxWidth={"250px"}
        >
          <Flex alignItems="center">
            <Text fontSize="md" fontWeight="bold" color="#d3d3d3" mr={2}>
              {index + 1}.
            </Text>
            <Image
              src={item.thumbnailUrl}
              alt={item.projectName}
              boxSize="30px"
              objectFit="cover"
              borderRadius="sm"
              mr={2}
            />
            <Text fontSize="sm" color="#d3d3d3">
              {item.projectName}
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={ArrowUpIcon} color="#d3d3d3" mr={1} />
            <Text fontSize="sm" fontWeight={"800"} color="#d3d3d3">
              {item.upvoteCount}
            </Text>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
};

export default Leaderboard;
