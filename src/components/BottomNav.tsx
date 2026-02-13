import { Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/app", label: "홈", icon: "🏠" },
  { to: "/app/schedules", label: "일정", icon: "📅" },
  { to: "/app/gallery", label: "갤러리", icon: "🖼️" },
  { to: "/app/profile", label: "프로필", icon: "👤" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <Flex
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      h="56px"
      bg="white"
      borderTopWidth="1px"
      borderColor="gray.200"
      justify="space-around"
      align="center"
      zIndex={10}
      display={{ base: "flex", md: "none" }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.to || (item.to !== "/app" && location.pathname.startsWith(item.to));
        return (
          <ChakraLink
            key={item.to}
            as={RouterLink}
            to={item.to}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex={1}
            py={2}
            color={isActive ? "green.600" : "gray.600"}
            fontWeight={isActive ? "semibold" : "normal"}
            _active={{ bg: "gray.50" }}
          >
            <Text fontSize="xl" mb={0}>
              {item.icon}
            </Text>
            <Text fontSize="xs">{item.label}</Text>
          </ChakraLink>
        );
      })}
    </Flex>
  );
}
