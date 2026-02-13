import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendVerificationEmail, login } from "@/api/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [sentEmail, setSentEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/app";

  const sendEmailMutation = useMutation({
    mutationFn: () => sendVerificationEmail(email),
    onSuccess: (res) => {
      if (res.success) {
        setSentEmail(email);
        setStep("code");
        toast({ title: "인증번호가 발송되었습니다.", status: "success" });
      } else {
        toast({ title: res.message || "발송 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "이메일 발송에 실패했습니다.", status: "error" });
    },
  });

  const loginMutation = useMutation({
    mutationFn: () => login(email, code),
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: "로그인되었습니다.", status: "success" });
        navigate(from, { replace: true });
      } else {
        toast({ title: res.message || "로그인 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "로그인에 실패했습니다.", status: "error" });
    },
  });

  const handleSendCode = () => {
    if (!email.trim()) {
      toast({ title: "이메일을 입력하세요.", status: "warning" });
      return;
    }
    sendEmailMutation.mutate();
  };

  const handleLogin = () => {
    if (!code.trim()) {
      toast({ title: "인증번호를 입력하세요.", status: "warning" });
      return;
    }
    loginMutation.mutate();
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      bg="gray.50"
    >
      <Card w="full" maxW="400px">
        <CardBody>
          <Heading size="md" mb={4}>
            로그인
          </Heading>
          <Stack spacing={4}>
            {step === "email" && (
              <>
                <Box>
                  <Text mb={2}>이메일</Text>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Button
                  colorScheme="green"
                  onClick={handleSendCode}
                  isLoading={sendEmailMutation.isPending}
                >
                  인증번호 발송
                </Button>
              </>
            )}
            {step === "code" && (
              <>
                <Text fontSize="sm" color="gray.600">
                  {sentEmail} 로 인증번호를 발송했습니다. 인증번호를 입력하고
                  로그인하세요.
                </Text>
                <Box>
                  <Text mb={2}>인증번호</Text>
                  <Input
                    placeholder="6자리 인증번호"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </Box>
                <Button
                  colorScheme="green"
                  onClick={handleLogin}
                  isLoading={loginMutation.isPending}
                >
                  로그인
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("email")}
                >
                  이메일 변경
                </Button>
              </>
            )}
          </Stack>
          <Text mt={4} fontSize="sm" color="gray.500">
            계정이 없으신가요?{" "}
            <Button as={RouterLink} to="/signup" variant="link" size="sm">
              회원가입
            </Button>
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
