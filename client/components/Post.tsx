import React from "react";
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Image,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

interface CardProps {
  projectName: string;
  author: string;
  description: string;
  image: string;
  upvoteCount: number;
  onUpvote: () => void;
}

const Post: React.FC<CardProps> = ({
  projectName,
  author,
  description,
  image,
  upvoteCount,
  onUpvote,
}) => {
  return (
    <Card borderRadius="lg" overflow="hidden" boxShadow="md" h="100%">
      <Box h="60%" overflow="hidden">
        <Image
          src={image}
          alt={projectName}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
      <CardBody h="40%" overflow="hidden">
        <Flex alignItems="center" mb={2}>
          <Heading size="sm">{projectName}</Heading>
          <Spacer />
          <IconButton
            aria-label="Upvote"
            icon={<ArrowUpIcon />}
            variant="ghost"
            size="sm"
            onClick={onUpvote}
          />
          <Text fontWeight="bold" ml={2} fontSize="sm">
            {upvoteCount}
          </Text>
        </Flex>
        <Text fontSize="xs" color="gray.500">
          by {author}
        </Text>
        <Text mt={2} fontSize="xs" noOfLines={2}>
          {description}
        </Text>
      </CardBody>
    </Card>
  );
};

export default Post;
