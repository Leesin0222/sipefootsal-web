import { Box, Flex, Link as ChakraLink, VStack } from "@chakra-ui/react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

const navItems = [
  { to: "/app", label: "홈" },
  { to: "/app/schedules", label: "일정" },
  { to: "/app/gallery", label: "갤러리" },
  { to: "/app/profile", label: "프로필" },
];

export function MainLayout() {
  const location = useLocation();

  return (
    <Flex minH="100vh" direction="column" bg="gray.50">
      <AppHeader />
      <Flex flex={1} direction={{ base: "column", md: "row" }} minH={0}>
        <Box
          as="aside"
          w={{ base: 0, md: "200px" }}
          minW={{ md: "200px" }}
          display={{ base: "none", md: "block" }}
          bg="white"
          borderRightWidth="1px"
          borderColor="gray.200"
          py={4}
        >
          <VStack align="stretch" spacing={1} px={3}>
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/app" && location.pathname.startsWith(item.to));
              return (
                <ChakraLink
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  px={3}
                  py={2}
                  borderRadius="md"
                  bg={isActive ? "green.50" : "transparent"}
                  color={isActive ? "green.700" : "gray.700"}
                  fontWeight={isActive ? "semibold" : "normal"}
                  _hover={{ bg: isActive ? "green.100" : "gray.100" }}
                >
                  {item.label}
                </ChakraLink>
              );
            })}
          </VStack>
        </Box>
        <Box
          as="main"
          flex={1}
          p={4}
          overflow="auto"
          pb={{ base: "72px", md: 4 }}
        >
          <Outlet />
        </Box>
      </Flex>
      <BottomNav />
    </Flex>
  );
}
