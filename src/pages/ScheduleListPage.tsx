import {
  Box,
  Card,
  CardBody,
  Heading,
  Link as ChakraLink,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getActiveFirstVoteSchedules,
  getFirstVoteDeadlineApproaching,
  getConfirmedSchedules,
} from "@/api/schedules";

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

function ScheduleCard({
  schedule,
  showVoteButton,
}: {
  schedule: { id: number; dateTime: string; location: string; status: string };
  showVoteButton?: boolean;
}) {
  return (
    <Card>
      <CardBody>
        <Text fontWeight="medium">{formatScheduleDate(schedule.dateTime)}</Text>
        <Text fontSize="sm" color="gray.600">
          {schedule.location}
        </Text>
        {showVoteButton && (
          <ChakraLink as={RouterLink} to={`/app/schedules/${schedule.id}`} mt={2} display="inline-block">
            <Box as="span" color="green.600" fontWeight="medium" fontSize="sm">
              {schedule.status === "FIRST_VOTE_IN_PROGRESS"
                ? "투표하기"
                : "자율 투표"}
            </Box>
          </ChakraLink>
        )}
      </CardBody>
    </Card>
  );
}

export function ScheduleListPage() {
  const { data: activeRes, isLoading: activeLoading } = useQuery({
    queryKey: ["schedules", "active-first-vote"],
    queryFn: () => getActiveFirstVoteSchedules(),
  });
  const { data: approachingRes, isLoading: approachingLoading } = useQuery({
    queryKey: ["schedules", "first-vote-deadline-approaching"],
    queryFn: () => getFirstVoteDeadlineApproaching(),
  });
  const { data: confirmedRes, isLoading: confirmedLoading } = useQuery({
    queryKey: ["schedules", "confirmed"],
    queryFn: () => getConfirmedSchedules(),
  });

  const activeSchedules = activeRes?.data ?? [];
  const approachingSchedules = approachingRes?.data ?? [];
  const confirmedSchedules = confirmedRes?.data ?? [];

  return (
    <Box>
      <Heading size="md" mb={4}>
        일정
      </Heading>
      <Tabs>
        <TabList>
          <Tab>1차 투표 중</Tab>
          <Tab>마감 임박</Tab>
          <Tab>확정 일정</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {activeLoading && <Skeleton height="120px" borderRadius="md" />}
            {!activeLoading && (
              <VStack align="stretch" spacing={3}>
                {activeSchedules.length === 0 ? (
                  <Text color="gray.500">진행 중인 1차 투표가 없습니다.</Text>
                ) : (
                  activeSchedules.map((s) => (
                    <ChakraLink
                      key={s.id}
                      as={RouterLink}
                      to={`/app/schedules/${s.id}`}
                      _hover={{ textDecoration: "none" }}
                    >
                      <ScheduleCard schedule={s} showVoteButton />
                    </ChakraLink>
                  ))
                )}
              </VStack>
            )}
          </TabPanel>
          <TabPanel px={0}>
            {approachingLoading && <Skeleton height="120px" borderRadius="md" />}
            {!approachingLoading && (
              <VStack align="stretch" spacing={3}>
                {approachingSchedules.length === 0 ? (
                  <Text color="gray.500">마감 임박 일정이 없습니다.</Text>
                ) : (
                  approachingSchedules.map((s) => (
                    <ChakraLink
                      key={s.id}
                      as={RouterLink}
                      to={`/app/schedules/${s.id}`}
                      _hover={{ textDecoration: "none" }}
                    >
                      <ScheduleCard schedule={s} showVoteButton />
                    </ChakraLink>
                  ))
                )}
              </VStack>
            )}
          </TabPanel>
          <TabPanel px={0}>
            {confirmedLoading && <Skeleton height="120px" borderRadius="md" />}
            {!confirmedLoading && (
              <VStack align="stretch" spacing={3}>
                {confirmedSchedules.length === 0 ? (
                  <Text color="gray.500">확정된 일정이 없습니다.</Text>
                ) : (
                  confirmedSchedules.map((s) => (
                    <ChakraLink
                      key={s.id}
                      as={RouterLink}
                      to={`/app/schedules/${s.id}`}
                      _hover={{ textDecoration: "none" }}
                    >
                      <ScheduleCard schedule={s} showVoteButton />
                    </ChakraLink>
                  ))
                )}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
