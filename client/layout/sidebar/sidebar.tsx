// Sidebar.tsx

import React from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { Box, Divider } from "@chakra-ui/react";
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
    href: "/c/stacks",
    icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
  },
  {
    name: "Stellar",
    href: "/c/stellar",
    icon: "https://static-00.iconduck.com/assets.00/stellar-cryptocurrency-icon-512x508-6qztyo0f.png",
  },
  {
    name: "Sui",
    href: "/c/sui",
    icon: "https://cryptologos.cc/logos/sui-sui-logo.png",
  },
];

const Sidebar: React.FC = () => {
  return (
    <Box borderRight="1px" borderColor="#888b90">
      <Box height="10px" /> {/* Spacer */}
      <Box>
        {feed.map((item, index) => (
          <SidebarButton key={index} item={item} />
        ))}
      </Box>
      <Divider my={4} /> {/* Chakra Divider */}
      <Box>
        {subchains.map((item, index) => (
          <SidebarButton key={index} item={item} />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
