import { Box } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { HomePage } from "@/pages/HomePage";
import { NoticeDetailPage } from "@/pages/NoticeDetailPage";
import { ScheduleListPage } from "@/pages/ScheduleListPage";
import { ScheduleDetailPage } from "@/pages/ScheduleDetailPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { ProfilePage } from "@/pages/ProfilePage";

function App() {
  const basename = import.meta.env.BASE_URL ?? "/";
  return (
    <BrowserRouter basename={basename}>
      <Box minH="100vh">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="notices/:id" element={<NoticeDetailPage />} />
            <Route path="schedules" element={<ScheduleListPage />} />
            <Route path="schedules/:id" element={<ScheduleDetailPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
