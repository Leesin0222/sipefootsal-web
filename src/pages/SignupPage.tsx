import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  validateInviteKey,
  registerSendEmail,
  register,
} from "@/api/users";
import type { Gender } from "@/types/api";

type Step = "invite" | "email" | "verify" | "info";

export function SignupPage() {
  const [step, setStep] = useState<Step>("invite");
  const [inviteKey, setInviteKey] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [residence, setResidence] = useState("");
  const [cohort, setCohort] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const validateKeyMutation = useMutation({
    mutationFn: () => validateInviteKey(inviteKey),
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: "유효한 초대 키입니다.", status: "success" });
        setStep("email");
      } else {
        toast({ title: res.message || "유효하지 않은 초대 키입니다.", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "초대 키 검증에 실패했습니다.", status: "error" });
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: () => registerSendEmail(email),
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: "인증번호가 발송되었습니다.", status: "success" });
        setStep("verify");
      } else {
        toast({ title: res.message || "발송 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "이메일 발송에 실패했습니다.", status: "error" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      register({
        email,
        name,
        gender,
        residence,
        cohort,
        inviteKey,
        verificationCode,
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: "회원가입이 완료되었습니다.", status: "success" });
        navigate("/app", { replace: true });
      } else {
        toast({ title: res.message || "회원가입 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "회원가입에 실패했습니다.", status: "error" });
    },
  });

  const handleValidateKey = () => {
    if (!inviteKey.trim()) {
      toast({ title: "초대 키를 입력하세요.", status: "warning" });
      return;
    }
    validateKeyMutation.mutate();
  };

  const handleSendEmail = () => {
    if (!email.trim()) {
      toast({ title: "이메일을 입력하세요.", status: "warning" });
      return;
    }
    sendEmailMutation.mutate();
  };

  const handleRegister = () => {
    if (!name.trim() || !residence.trim() || !cohort.trim()) {
      toast({ title: "모든 필수를 입력하세요.", status: "warning" });
      return;
    }
    if (!verificationCode.trim()) {
      toast({ title: "인증번호를 입력하세요.", status: "warning" });
      return;
    }
    registerMutation.mutate();
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
      <Card w="full" maxW="420px">
        <CardBody>
          <Heading size="md" mb={4}>
            회원가입
          </Heading>
          <Stack spacing={4}>
            {step === "invite" && (
              <>
                <FormControl>
                  <FormLabel>초대 키</FormLabel>
                  <Input
                    placeholder="초대 키 입력"
                    value={inviteKey}
                    onChange={(e) => setInviteKey(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  onClick={handleValidateKey}
                  isLoading={validateKeyMutation.isPending}
                >
                  검증
                </Button>
                <Button variant="ghost" size="sm" as={RouterLink} to="/login">
                  이미 계정이 있으신가요? 로그인
                </Button>
              </>
            )}
            {step === "email" && (
              <>
                <FormControl>
                  <FormLabel>이메일</FormLabel>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  onClick={handleSendEmail}
                  isLoading={sendEmailMutation.isPending}
                >
                  인증번호 발송
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("invite")}>
                  초대 키 단계로
                </Button>
              </>
            )}
            {step === "verify" && (
              <>
                <Text fontSize="sm" color="gray.600">
                  {email} 로 인증번호를 발송했습니다.
                </Text>
                <FormControl>
                  <FormLabel>인증번호</FormLabel>
                  <Input
                    placeholder="6자리 인증번호"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  onClick={() => setStep("info")}
                >
                  다음 (정보 입력)
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("email")}>
                  이메일 변경
                </Button>
              </>
            )}
            {step === "info" && (
              <>
                <FormControl isRequired>
                  <FormLabel>이름</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>성별</FormLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>거주지</FormLabel>
                  <Input
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    placeholder="거주지"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>참여 기수</FormLabel>
                  <Input
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value)}
                    placeholder="예: 1기, 2기"
                  />
                </FormControl>
                <Button
                  colorScheme="green"
                  onClick={handleRegister}
                  isLoading={registerMutation.isPending}
                >
                  회원가입 완료
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("verify")}>
                  이전
                </Button>
              </>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
