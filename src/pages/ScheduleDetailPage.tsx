import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Skeleton,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchedule } from "@/api/schedules";
import {
  getFirstVoteStatus,
  getFirstVoteMe,
  postFirstVote,
  putFirstVote,
  getFlexibleVoteStatus,
  getFlexibleVoteMe,
  postFlexibleVote,
  putFlexibleVote,
  type VoteChoice,
} from "@/api/votes";
import { getCommentsBySchedule, createComment } from "@/api/comments";
import type { ScheduleStatus } from "@/types/api";

function formatScheduleDate(dateTimeStr: string) {
  try {
    const d = new Date(dateTimeStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[d.getDay()];
    return `${month}월 ${day}일 (${weekday}) ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  } catch {
    return dateTimeStr;
  }
}

export function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const scheduleId = id ? parseInt(id, 10) : NaN;
  const toast = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [flexReason, setFlexReason] = useState("");

  const { data: scheduleRes, isLoading: scheduleLoading, isError: scheduleError } = useQuery({
    queryKey: ["schedules", scheduleId],
    queryFn: () => getSchedule(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const { data: firstStatusRes } = useQuery({
    queryKey: ["votes", scheduleId, "first-status"],
    queryFn: () => getFirstVoteStatus(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const { data: firstMeRes } = useQuery({
    queryKey: ["votes", scheduleId, "first-me"],
    queryFn: () => getFirstVoteMe(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const { data: flexStatusRes } = useQuery({
    queryKey: ["votes", scheduleId, "flex-status"],
    queryFn: () => getFlexibleVoteStatus(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const { data: flexMeRes } = useQuery({
    queryKey: ["votes", scheduleId, "flex-me"],
    queryFn: () => getFlexibleVoteMe(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const { data: commentsRes, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", scheduleId],
    queryFn: () => getCommentsBySchedule(scheduleId),
    enabled: Number.isInteger(scheduleId),
  });

  const firstVoteMutation = useMutation({
    mutationFn: (choice: VoteChoice) =>
      firstMeRes?.data ? putFirstVote(scheduleId, { choice }) : postFirstVote(scheduleId, { choice }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({ title: "투표가 반영되었습니다.", status: "success" });
    },
    onError: () => toast({ title: "투표에 실패했습니다.", status: "error" }),
  });

  const flexVoteMutation = useMutation({
    mutationFn: (choice: VoteChoice) => {
      const body = { choice, cancellationReason: choice === "NOT_PARTICIPATE" ? flexReason : undefined };
      return flexMeRes?.data ? putFlexibleVote(scheduleId, body) : postFlexibleVote(scheduleId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", scheduleId] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({ title: "자율 투표가 반영되었습니다.", status: "success" });
    },
    onError: (e: Error) =>
      toast({ title: e.message || "자율 투표에 실패했습니다.", status: "error" }),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(scheduleId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", scheduleId] });
      setCommentText("");
      toast({ title: "댓글이 등록되었습니다.", status: "success" });
    },
    onError: () => toast({ title: "댓글 등록에 실패했습니다.", status: "error" }),
  });

  if (!Number.isInteger(scheduleId)) {
    return (
      <Box>
        <Text color="red.500">잘못된 일정 번호입니다.</Text>
        <Button as={RouterLink} to="/app/schedules" mt={2}>
          목록으로
        </Button>
      </Box>
    );
  }

  const schedule = scheduleRes?.data;
  const status = schedule?.status as ScheduleStatus | undefined;
  const isFirstVoteActive = status === "FIRST_VOTE_IN_PROGRESS";
  const isConfirmed = status === "CONFIRMED";
  const firstStatus = firstStatusRes?.data as { votersByChoice?: Record<string, string[]> } | undefined;
  const flexStatus = flexStatusRes?.data as { participantsByChoice?: Record<string, string[]> } | undefined;
  const comments = commentsRes?.data ?? [];
  const myFirstChoice = firstMeRes?.data?.choice;
  const myFlexChoice = flexMeRes?.data?.choice;

  if (scheduleLoading || !schedule) {
    return (
      <Box>
        <Button as={RouterLink} to="/app/schedules" variant="ghost" size="sm" mb={4}>
          ← 일정 목록
        </Button>
        <Skeleton height="200px" borderRadius="md" />
      </Box>
    );
  }

  if (scheduleError) {
    return (
      <Box>
        <Text color="red.500">일정을 불러오지 못했습니다.</Text>
        <Button as={RouterLink} to="/app/schedules" mt={2}>
          목록으로
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button as={RouterLink} to="/app/schedules" variant="ghost" size="sm" mb={4}>
        ← 일정 목록
      </Button>

      <Card mb={4}>
        <CardBody>
          <Heading size="md" mb={2}>
            {formatScheduleDate(schedule.dateTime)}
          </Heading>
          <Text color="gray.600">{schedule.location}</Text>
          <Text fontSize="sm" mt={2}>
            최소 인원: {schedule.minParticipants}명 · 1차 투표 마감:{" "}
            {formatScheduleDate(schedule.firstVoteDeadline)}
          </Text>
          {schedule.memo && (
            <Text fontSize="sm" mt={1} color="gray.500">
              {schedule.memo}
            </Text>
          )}
        </CardBody>
      </Card>

      {isFirstVoteActive && (
        <Card mb={4}>
          <CardBody>
            <Heading size="sm" mb={2}>
              1차 투표
            </Heading>
            {firstStatus?.votersByChoice && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                참여: {(firstStatus.votersByChoice.PARTICIPATE ?? []).length}명 / 비참여:{" "}
                {(firstStatus.votersByChoice.NOT_PARTICIPATE ?? []).length}명
              </Text>
            )}
            <Box display="flex" gap={2}>
              <Button
                colorScheme="green"
                size="sm"
                variant={myFirstChoice === "PARTICIPATE" ? "solid" : "outline"}
                onClick={() => firstVoteMutation.mutate("PARTICIPATE")}
                isLoading={firstVoteMutation.isPending}
              >
                참여
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                variant={myFirstChoice === "NOT_PARTICIPATE" ? "solid" : "outline"}
                onClick={() => firstVoteMutation.mutate("NOT_PARTICIPATE")}
                isLoading={firstVoteMutation.isPending}
              >
                비참여
              </Button>
            </Box>
          </CardBody>
        </Card>
      )}

      {isConfirmed && (
        <Card mb={4}>
          <CardBody>
            <Heading size="sm" mb={2}>
              자율 투표
            </Heading>
            {flexStatus?.participantsByChoice && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                참여: {(flexStatus.participantsByChoice.PARTICIPATE ?? []).length}명 / 비참여:{" "}
                {(flexStatus.participantsByChoice.NOT_PARTICIPATE ?? []).length}명
              </Text>
            )}
            <Textarea
              placeholder="불참 시 사유를 입력하세요"
              value={flexReason}
              onChange={(e) => setFlexReason(e.target.value)}
              size="sm"
              mb={2}
            />
            <Box display="flex" gap={2}>
              <Button
                colorScheme="green"
                size="sm"
                variant={myFlexChoice === "PARTICIPATE" ? "solid" : "outline"}
                onClick={() => flexVoteMutation.mutate("PARTICIPATE")}
                isLoading={flexVoteMutation.isPending}
              >
                참여
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                variant={myFlexChoice === "NOT_PARTICIPATE" ? "solid" : "outline"}
                onClick={() => {
                  if (!flexReason.trim()) {
                    toast({ title: "불참 시 사유를 입력하세요.", status: "warning" });
                    return;
                  }
                  flexVoteMutation.mutate("NOT_PARTICIPATE");
                }}
                isLoading={flexVoteMutation.isPending}
              >
                비참여
              </Button>
            </Box>
          </CardBody>
        </Card>
      )}

      <Heading size="sm" mb={2}>
        댓글
      </Heading>
      <VStack align="stretch" spacing={2} mb={4}>
        <Box display="flex" gap={2}>
          <Textarea
            placeholder="댓글 입력"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            size="sm"
          />
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => {
              if (!commentText.trim()) return;
              createCommentMutation.mutate(commentText.trim());
            }}
            isLoading={createCommentMutation.isPending}
          >
            등록
          </Button>
        </Box>
        {commentsLoading && <Skeleton height="60px" />}
        {comments.map((c) => (
          <Card key={c.id} size="sm">
            <CardBody py={2}>
              <Text fontSize="sm" fontWeight="medium">
                {c.authorName ?? "회원"}
              </Text>
              <Text fontSize="sm">{c.content}</Text>
              <Text fontSize="xs" color="gray.500">
                {new Date(c.createdAt).toLocaleString("ko-KR")}
              </Text>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
}
