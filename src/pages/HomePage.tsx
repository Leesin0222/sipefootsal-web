import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Link as ChakraLink,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLatestNotices } from "@/api/notices";
import {
  getActiveFirstVoteSchedules,
  getConfirmedSchedules,
} from "@/api/schedules";
const EXTERNAL_LINKS = [
  { label: "동아리 소개", href: "#" },
  { label: "회비 규칙", href: "#" },
  { label: "규칙", href: "#" },
];

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

export function HomePage() {
  const {
    data: latestNoticesRes,
    isLoading: noticesLoading,
    isError: noticesError,
  } = useQuery({
    queryKey: ["notices", "latest"],
    queryFn: () => getLatestNotices(),
  });

  const {
    data: activeFirstVoteRes,
    isLoading: firstVoteLoading,
    isError: firstVoteError,
  } = useQuery({
    queryKey: ["schedules", "active-first-vote"],
    queryFn: () => getActiveFirstVoteSchedules(),
  });

  const {
    data: confirmedRes,
    isLoading: confirmedLoading,
    isError: confirmedError,
  } = useQuery({
    queryKey: ["schedules", "confirmed"],
    queryFn: () => getConfirmedSchedules(),
  });

  const latestNotices = latestNoticesRes?.data ?? [];
  const firstNotice = latestNotices[0];
  const activeFirstVoteSchedules = activeFirstVoteRes?.data ?? [];
  const confirmedSchedules = confirmedRes?.data ?? [];

  return (
    <VStack align="stretch" spacing={6}>
      <Heading size="md">홈</Heading>

      {/* 최신 공지 */}
      <Box>
        <Text fontWeight="semibold" mb={2}>
          최신 공지
        </Text>
        {noticesLoading && (
          <Skeleton height="80px" borderRadius="md" />
        )}
        {noticesError && (
          <Text color="red.500">공지를 불러오지 못했습니다.</Text>
        )}
        {!noticesLoading && !noticesError && firstNotice && (
          <Card>
            <CardBody>
              <Heading size="sm" mb={1}>
                {firstNotice.title}
              </Heading>
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {firstNotice.content}
              </Text>
              <Button
                as={RouterLink}
                to={`/app/notices/${firstNotice.id}`}
                size="sm"
                variant="link"
                colorScheme="green"
                mt={2}
              >
                상세보기
              </Button>
            </CardBody>
          </Card>
        )}
        {!noticesLoading && !noticesError && !firstNotice && (
          <Text color="gray.500">등록된 공지가 없습니다.</Text>
        )}
      </Box>

      {/* 1차 투표 진행 중 */}
      <Box>
        <Text fontWeight="semibold" mb={2}>
          1차 투표 진행 중
        </Text>
        {firstVoteLoading && (
          <Skeleton height="100px" borderRadius="md" />
        )}
        {firstVoteError && (
          <Text color="red.500">일정을 불러오지 못했습니다.</Text>
        )}
        {!firstVoteLoading && !firstVoteError && activeFirstVoteSchedules.length > 0 && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {activeFirstVoteSchedules.slice(0, 4).map((schedule) => (
              <Card key={schedule.id}>
                <CardBody>
                  <Text fontWeight="medium">
                    {formatScheduleDate(schedule.dateTime)}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {schedule.location}
                  </Text>
                  <Button
                    as={RouterLink}
                    to={`/app/schedules/${schedule.id}`}
                    size="sm"
                    colorScheme="green"
                    mt={2}
                  >
                    빠른 투표
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
        {!firstVoteLoading && !firstVoteError && activeFirstVoteSchedules.length === 0 && (
          <Text color="gray.500">진행 중인 1차 투표가 없습니다.</Text>
        )}
      </Box>

      {/* 확정 일정 (자율 투표) */}
      <Box>
        <Text fontWeight="semibold" mb={2}>
          확정 일정 (자율 투표)
        </Text>
        {confirmedLoading && (
          <Skeleton height="80px" borderRadius="md" />
        )}
        {confirmedError && (
          <Text color="red.500">일정을 불러오지 못했습니다.</Text>
        )}
        {!confirmedLoading && !confirmedError && confirmedSchedules.length > 0 && (
          <VStack align="stretch" spacing={2}>
            {confirmedSchedules.slice(0, 5).map((schedule) => (
              <ChakraLink
                key={schedule.id}
                as={RouterLink}
                to={`/app/schedules/${schedule.id}`}
                _hover={{ textDecoration: "none" }}
              >
                <Card _hover={{ bg: "gray.50" }}>
                  <CardBody py={3}>
                    <Text fontWeight="medium">
                      {formatScheduleDate(schedule.dateTime)} · {schedule.location}
                    </Text>
                  </CardBody>
                </Card>
              </ChakraLink>
            ))}
          </VStack>
        )}
        {!confirmedLoading && !confirmedError && confirmedSchedules.length === 0 && (
          <Text color="gray.500">확정된 일정이 없습니다.</Text>
        )}
      </Box>

      {/* 외부 링크 */}
      <Box>
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
              variant="outline"
              colorScheme="green"
              justifyContent="flex-start"
            >
              {link.label}
            </Button>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
