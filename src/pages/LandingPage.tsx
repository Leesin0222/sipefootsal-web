import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getAccessToken } from "@/api/client";

const EXTERNAL_LINKS = [
  { label: "동아리 소개", href: "#" },
  { label: "회비 규칙", href: "#" },
  { label: "규칙", href: "#" },
];

export function LandingPage() {
  const token = getAccessToken();
  const isLoggedIn = !!token;

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" color="green.600" textAlign="center">
            사이풋살
          </Heading>
          <Text textAlign="center" color="gray.600">
            풋살 일정을 확인하고 참여 여부를 투표하세요.
          </Text>
          {!isLoggedIn && (
            <VStack spacing={3}>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="green"
                w="full"
                maxW="280px"
              >
                로그인
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                variant="outline"
                colorScheme="green"
                w="full"
                maxW="280px"
              >
                회원가입
              </Button>
            </VStack>
          )}
          {isLoggedIn && (
            <Button
              as={RouterLink}
              to="/app"
              colorScheme="green"
              w="full"
              maxW="280px"
              alignSelf="center"
            >
              앱으로 이동
            </Button>
          )}
          <Box pt={4}>
            <Text fontWeight="semibold" mb={2}>
              링크
            </Text>
            <VStack align="stretch" spacing={2}>
              {EXTERNAL_LINKS.map((link) => (
                <Button
                  key={link.label}
                  as="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="link"
                  colorScheme="green"
                  justifyContent="flex-start"
                >
                  {link.label}
                </Button>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
