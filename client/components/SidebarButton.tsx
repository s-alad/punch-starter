// SidebarButton.tsx

import React from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

interface SidebarButtonProps {
  item: {
    name: string;
    href: string;
    icon: string | React.ReactElement;
  };
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ item }) => {
  return (
    <Link href={item.href}>
      <Button
        variant="ghost"
        textColor={"white"}
        _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
        leftIcon={
          typeof item.icon === "string" ? (
            <img src={item.icon} alt="icon" width="20px" />
          ) : (
            item.icon
          )
        }
        justifyContent="flex-start"
        px={4}
        py={2}
        w="100%"
      >
        {item.name}
      </Button>
    </Link>
  );
};

export default SidebarButton;
