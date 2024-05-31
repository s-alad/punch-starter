import React from "react";
import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react";
// interface DaoProps {
//   address: string;
// }

const Dao = () => {
  const address = "0x68d925A3542611E8d3B6fd9B655b008E69C0E44b"; // rootstock daofactory address

  return (
    <Box>
      <Heading>DAO</Heading>
      <Text>Address: {address}</Text>
    </Box>
  );
};

export default Dao;
