import {
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/auth";
import { getAccessToken } from "@/api/client";

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = getAccessToken();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      if (!res.success || !res.data) throw new Error("Unauthorized");
      return res.data;
    },
    enabled: !!token,
  });

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Flex
      as="header"
      h="56px"
      px={4}
      align="center"
      justify="space-between"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
        <Heading size="md" color="green.600">
          사이풋살
        </Heading>
      </ChakraLink>
      <Flex align="center" gap={2}>
        {user ? (
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              fontWeight="medium"
            >
              {user.name}
            </MenuButton>
            <MenuList>
              <MenuItem as={RouterLink} to="/app/profile">
                프로필
              </MenuItem>
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button as={RouterLink} to="/login" variant="ghost" size="sm">
              로그인
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="green" size="sm">
              회원가입
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}
