import {
  Box,
  Grid,
  Heading,
  Image,
  Skeleton,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConfirmedSchedules } from "@/api/schedules";
import { getGalleryBySchedule, getRecentGallery, getGalleryItem } from "@/api/gallery";
function formatScheduleDate(dateTimeStr: string) {
  try {
    const d = new Date(dateTimeStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  } catch {
    return dateTimeStr;
  }
}

export function GalleryPage() {
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: schedulesRes } = useQuery({
    queryKey: ["schedules", "confirmed"],
    queryFn: () => getConfirmedSchedules(),
  });
  const { data: galleryRes, isLoading: galleryLoading } = useQuery({
    queryKey: ["gallery", "schedule", selectedScheduleId],
    queryFn: () => getGalleryBySchedule(selectedScheduleId!),
    enabled: selectedScheduleId != null,
  });
  const { data: recentRes, isLoading: recentLoading } = useQuery({
    queryKey: ["gallery", "recent"],
    queryFn: () => getRecentGallery(),
  });
  const { data: imageDetailRes } = useQuery({
    queryKey: ["gallery", selectedImageId],
    queryFn: () => getGalleryItem(selectedImageId!),
    enabled: selectedImageId != null,
  });

  const schedules = schedulesRes?.data ?? [];
  const galleryImages = galleryRes?.data ?? [];
  const recentImages = recentRes?.data ?? [];
  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId);
  const imageDetail = imageDetailRes?.data;

  const openImage = (id: number) => {
    setSelectedImageId(id);
    onOpen();
  };

  return (
    <Box>
      <Heading size="md" mb={4}>
        갤러리
      </Heading>

      <Box mb={6}>
        <Text fontWeight="semibold" mb={2}>
          일정 선택
        </Text>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button
            size="sm"
            variant={selectedScheduleId === null ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setSelectedScheduleId(null)}
          >
            최근 사진
          </Button>
          {schedules.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={selectedScheduleId === s.id ? "solid" : "outline"}
              colorScheme="green"
              onClick={() => setSelectedScheduleId(s.id)}
            >
              {formatScheduleDate(s.dateTime)} {s.location}
            </Button>
          ))}
        </Box>
      </Box>

      {selectedScheduleId == null ? (
        <Box>
          <Text fontWeight="semibold" mb={2}>
            최근 업로드
          </Text>
          {recentLoading && (
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} aspectRatio={1} borderRadius="md" />
              ))}
            </Grid>
          )}
          {!recentLoading && recentImages.length === 0 && (
            <Text color="gray.500">최근 사진이 없습니다.</Text>
          )}
          {!recentLoading && recentImages.length > 0 && (
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              {recentImages.map((img) => (
                <Box
                  key={img.id}
                  aspectRatio={1}
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => openImage(img.id)}
                  _hover={{ opacity: 0.9 }}
                >
                  <Image
                    src={img.thumbnailUrl ?? img.imageUrl}
                    alt=""
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      ) : (
        <Box>
          <Text fontWeight="semibold" mb={2}>
            {selectedSchedule &&
              `${formatScheduleDate(selectedSchedule.dateTime)} ${selectedSchedule.location}`}
          </Text>
          {galleryLoading && (
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} aspectRatio={1} borderRadius="md" />
              ))}
            </Grid>
          )}
          {!galleryLoading && galleryImages.length === 0 && (
            <Text color="gray.500">이 일정에 등록된 사진이 없습니다.</Text>
          )}
          {!galleryLoading && galleryImages.length > 0 && (
            <Grid templateColumns="repeat(3, 1fr)" gap={2}>
              {galleryImages.map((img) => (
                <Box
                  key={img.id}
                  aspectRatio={1}
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => openImage(img.id)}
                  _hover={{ opacity: 0.9 }}
                >
                  <Image
                    src={img.thumbnailUrl ?? img.imageUrl}
                    alt=""
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="blackAlpha.900">
          <ModalCloseButton color="white" />
          <ModalBody display="flex" alignItems="center" justifyContent="center" py={12}>
            {imageDetail && (
              <Box textAlign="center">
                <Image
                  src={imageDetail.imageUrl}
                  alt=""
                  maxH="80vh"
                  maxW="full"
                  objectFit="contain"
                  mb={4}
                />
                <Button
                  as="a"
                  href={imageDetail.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  size="sm"
                >
                  새 탭에서 보기 / 다운로드
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
