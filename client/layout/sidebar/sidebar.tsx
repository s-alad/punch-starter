// Sidebar.tsx

import { Box, Divider, Heading } from "@chakra-ui/react";

import { FaHome } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import React from "react";
import SidebarButton from "@/components/SidebarButton"; // Import the new SidebarButton component

interface NavItem {
  name: string;
  href: string;
  icon: string | React.ReactElement;
}

const feed: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: <FaHome size={"20px"} />,
  },
  {
    name: "Explore",
    href: "/explore",
    icon: <MdOutlineExplore size={"20px"} />,
  },
];

const subchains: NavItem[] = [
  {
    name: "Stacks",
    href: "/",
    icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
  },
  {
    name: "Stellar",
    href: "/",
    icon: "https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png",
  },
  {
    name: "Sui",
    href: "/",
    icon: "https://cryptologos.cc/logos/sui-sui-logo.png",
  },
  {
    name: "Rootstock",
    href: "/",
    icon: "https://asset.brandfetch.io/idlHNCkrJa/idvZdDhAxY.jpeg",
  },
];

const Sidebar: React.FC = () => {
  return (
    <Box
      borderRight="1px"
      borderColor="#888b90"
      width={{ base: "80%", md: "20%" }}
    >
      <Box height="10px" /> {/* Spacer */}
      <Heading size={"sm"} fontWeight={"400"} color={"#d3d3d3"} ml={4} mb={1}>
        Feeds
      </Heading>
      <Box>
        {feed.map((item, index) => (
          <SidebarButton key={index} item={item} />
        ))}
      </Box>
      <Divider my={4} /> {/* Chakra Divider */}
      <Heading size={"sm"} fontWeight={"400"} color={"#d3d3d3"} ml={4} mb={1}>
        Platforms
      </Heading>
      <Box>
        {subchains.map((item, index) => (
          <SidebarButton key={index} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
