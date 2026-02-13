import { Box, Button, Heading, Skeleton, Text } from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNotice } from "@/api/notices";

export function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const noticeId = id ? parseInt(id, 10) : NaN;

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ["notices", noticeId],
    queryFn: () => getNotice(noticeId),
    enabled: Number.isInteger(noticeId),
  });

  const notice = res?.data;

  if (!Number.isInteger(noticeId)) {
    return (
      <Box>
        <Text color="red.500">잘못된 공지 번호입니다.</Text>
        <Button as={RouterLink} to="/app" mt={2}>
          홈으로
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Skeleton height="32px" mb={2} />
        <Skeleton height="120px" />
      </Box>
    );
  }

  if (isError || !notice) {
    return (
      <Box>
        <Text color="red.500">공지를 불러오지 못했습니다.</Text>
        <Button as={RouterLink} to="/app" mt={2}>
          홈으로
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button as={RouterLink} to="/app" variant="ghost" size="sm" mb={4}>
        ← 홈
      </Button>
      <Heading size="md" mb={2}>
        {notice.title}
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={4}>
        {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
      </Text>
      <Text whiteSpace="pre-wrap">{notice.content}</Text>
    </Box>
  );
}
