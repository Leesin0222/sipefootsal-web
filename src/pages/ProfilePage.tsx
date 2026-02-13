import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  Heading,
  Input,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { getMe } from "@/api/auth";
import { updateMe as updateMeUser } from "@/api/users";
import { getMyBadges } from "@/api/badges";
import { getFirstVoteHistory, getFlexibleVoteHistory } from "@/api/votes";
import {
  getMySettlementHistories,
  getPendingSettlements,
  completeSettlement,
  getSettlementStatistics,
} from "@/api/settlements";
import { getCurrentCohort } from "@/api/users";
import { BADGE_GRADE_LABELS } from "@/types/api";
import type { BadgeResponse } from "@/types/api";

const FUTSAL_LEVEL_LABELS: Record<string, string> = {
  ROOKIE: "루키",
  PLAYMAKER: "플레이메이커",
  STRIKER: "스트라이커",
  MAESTRO: "마에스트로",
  LEGEND: "레전드",
};

export function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [editName, setEditName] = useState("");
  const [editResidence, setEditResidence] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: meRes } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      if (!res.success || !res.data) throw new Error("Unauthorized");
      return res.data;
    },
  });

  const { data: badgesRes } = useQuery({
    queryKey: ["badges", "my"],
    queryFn: () => getMyBadges(),
    enabled: !!meRes?.id,
  });

  const { data: firstHistoryRes } = useQuery({
    queryKey: ["votes", "first-vote-history"],
    queryFn: () => getFirstVoteHistory(),
  });

  const { data: flexHistoryRes } = useQuery({
    queryKey: ["votes", "flexible-vote-history"],
    queryFn: () => getFlexibleVoteHistory(),
  });

  const { data: settlementsRes } = useQuery({
    queryKey: ["settlements", "my"],
    queryFn: () => getMySettlementHistories({ page: 0, size: 20 }),
  });

  const { data: pendingRes } = useQuery({
    queryKey: ["settlements", "pending"],
    queryFn: () => getPendingSettlements(),
  });

  const { data: statsRes } = useQuery({
    queryKey: ["settlements", "statistics"],
    queryFn: () => getSettlementStatistics(),
  });

  const { data: membersRes } = useQuery({
    queryKey: ["users", "current-cohort"],
    queryFn: () => getCurrentCohort(),
  });

  const updateMutation = useMutation({
    mutationFn: (body: { name?: string; residence?: string }) =>
      updateMeUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
      toast({ title: "정보가 수정되었습니다.", status: "success" });
    },
    onError: () => toast({ title: "수정에 실패했습니다.", status: "error" }),
  });

  const completeSettlementMutation = useMutation({
    mutationFn: (settlementId: number) => completeSettlement(settlementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      toast({ title: "정산 완료 처리되었습니다.", status: "success" });
    },
    onError: () => toast({ title: "처리에 실패했습니다.", status: "error" }),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const user = meRes;
  const badges = badgesRes?.data ?? [];
  const firstHistory = firstHistoryRes?.data ?? [];
  const flexHistory = flexHistoryRes?.data ?? [];
  const settlementPage = settlementsRes?.data;
  const settlementList = settlementPage?.content ?? [];
  const pendingList = pendingRes?.data ?? [];
  const stats = statsRes?.data as {
    totalSettlementCount?: number;
    totalPenaltyCount?: number;
    averageAmount?: number;
    totalPenaltyAmount?: number;
  } | undefined;
  const members = membersRes?.data ?? [];

  const handleStartEdit = () => {
    setEditName(user?.name ?? "");
    setEditResidence(user?.residence ?? "");
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateMutation.mutate({ name: editName, residence: editResidence });
  };

  if (!user) {
    return (
      <Box>
        <Skeleton height="200px" borderRadius="md" />
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        프로필
      </Heading>

      <Tabs>
        <TabList>
          <Tab>내 정보</Tab>
          <Tab>뱃지</Tab>
          <Tab>투표 히스토리</Tab>
          <Tab>정산</Tab>
          <Tab>회원 목록</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Card mb={4}>
              <CardBody>
                {!isEditing ? (
                  <>
                    <Text fontWeight="medium">{user.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {user.maskedEmail ?? user.email}
                    </Text>
                    <Text fontSize="sm">
                      거주지: {user.residence} · {FUTSAL_LEVEL_LABELS[user.futsalLevel] ?? user.futsalLevel} · {user.cohort}기
                    </Text>
                    <Button size="sm" mt={2} onClick={handleStartEdit}>
                      수정
                    </Button>
                  </>
                ) : (
                  <>
                    <Box mb={2}>
                      <Text fontSize="sm" mb={1}>이름</Text>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="sm"
                      />
                    </Box>
                    <Box mb={2}>
                      <Text fontSize="sm" mb={1}>거주지</Text>
                      <Input
                        value={editResidence}
                        onChange={(e) => setEditResidence(e.target.value)}
                        size="sm"
                      />
                    </Box>
                    <Button
                      size="sm"
                      colorScheme="green"
                      mr={2}
                      onClick={handleSaveProfile}
                      isLoading={updateMutation.isPending}
                    >
                      저장
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                  </>
                )}
              </CardBody>
            </Card>
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              isLoading={logoutMutation.isPending}
            >
              로그아웃
            </Button>
          </TabPanel>

          <TabPanel px={0}>
            <Text fontWeight="semibold" mb={2}>
              내 뱃지
            </Text>
            {badges.length === 0 ? (
              <Text color="gray.500">획득한 뱃지가 없습니다.</Text>
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={3}>
                {badges.map((b: BadgeResponse) => (
                  <Card key={b.id}>
                    <CardBody py={3} textAlign="center">
                      {b.imageUrl && (
                        <Box as="img" src={b.imageUrl} alt="" maxW="48px" maxH="48px" mx="auto" mb={1} />
                      )}
                      <Text fontSize="sm" fontWeight="medium">
                        {b.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {BADGE_GRADE_LABELS[b.grade as keyof typeof BADGE_GRADE_LABELS] ?? b.grade}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            )}
          </TabPanel>

          <TabPanel px={0}>
            <Text fontWeight="semibold" mb={2}>
              1차 투표 히스토리
            </Text>
            {firstHistory.length === 0 ? (
              <Text color="gray.500">내역이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {firstHistory.slice(0, 20).map((item: { scheduleId: number; choice?: string }, i: number) => (
                  <Card key={i} size="sm">
                    <CardBody py={2}>
                      일정 #{item.scheduleId} · {item.choice === "PARTICIPATE" ? "참여" : "비참여"}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
            <Text fontWeight="semibold" mt={4} mb={2}>
              자율 투표 히스토리
            </Text>
            {flexHistory.length === 0 ? (
              <Text color="gray.500">내역이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {flexHistory.slice(0, 20).map((item: { scheduleId: number; choice?: string }, i: number) => (
                  <Card key={i} size="sm">
                    <CardBody py={2}>
                      일정 #{item.scheduleId} · {item.choice === "PARTICIPATE" ? "참여" : "비참여"}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {stats && (
              <Card mb={4}>
                <CardBody py={3}>
                  <Text fontSize="sm">
                    총 정산 횟수: {stats.totalSettlementCount ?? 0} · 벌금 횟수: {stats.totalPenaltyCount ?? 0}
                  </Text>
                  <Text fontSize="sm">
                    평균 정산 금액: {stats.averageAmount != null ? `${stats.averageAmount.toLocaleString()}원` : "-"}
                  </Text>
                </CardBody>
              </Card>
            )}
            <Text fontWeight="semibold" mb={2}>
              미완료 정산
            </Text>
            {pendingList.length === 0 ? (
              <Text color="gray.500">미완료 정산이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2} mb={4}>
                {pendingList.map((s: { id: number; scheduleId: number; totalCost: number }) => (
                  <Card key={s.id}>
                    <CardBody py={2}>
                      <Text fontSize="sm">일정 #{s.scheduleId} · {s.totalCost?.toLocaleString()}원</Text>
                      <Button
                        size="xs"
                        colorScheme="green"
                        mt={1}
                        onClick={() => completeSettlementMutation.mutate(s.id)}
                        isLoading={completeSettlementMutation.isPending}
                      >
                        정산 완료
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
            <Text fontWeight="semibold" mb={2}>
              정산 이력
            </Text>
            {settlementList.length === 0 ? (
              <Text color="gray.500">정산 이력이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {settlementList.map((h: { id: number; settlementId: number; totalAmount: number; status: string }) => (
                  <Card key={h.id}>
                    <CardBody py={2}>
                      <Text fontSize="sm">
                        정산 #{h.settlementId} · {h.totalAmount?.toLocaleString()}원 · {h.status}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel px={0}>
            <Text fontWeight="semibold" mb={2}>
              회원 목록
            </Text>
            {members.length === 0 ? (
              <Text color="gray.500">회원이 없습니다.</Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {members.map((m: { id: number; name: string; maskedEmail: string; residence: string; futsalLevel: string; cohort: string }) => (
                  <Card key={m.id}>
                    <CardBody py={2}>
                      <Text fontWeight="medium">{m.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {m.maskedEmail} · {m.residence} · {FUTSAL_LEVEL_LABELS[m.futsalLevel] ?? m.futsalLevel} · {m.cohort}기
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
