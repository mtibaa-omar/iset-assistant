import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./lib/agGridSetup"; // Initialize AG Grid once
import Home from "./pages/Home";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppLayout from "./ui/layout/AppLayout";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Calcul from "./pages/Calcul";
import LoginPage from "./pages/LoginPage";
import SignupLayout, { SignupProvider } from "./features/auth/signup/SignupLayout";
import SignupStep1 from "./pages/SignupStep1";
import SignupStep2 from "./pages/SignupStep2";
import SignupStep3 from "./pages/SignupStep3";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./ui/components/ProtectedRoute";
import AdminRoute from "./ui/components/AdminRoute";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminSubjects from "./pages/AdminSubjects";
import AdminUnites from "./pages/AdminUnites";
import AdminPrograms from "./pages/AdminPrograms";
import AdminVideos from "./pages/AdminVideos";

import EspaceMatiere from "./pages/EspaceMatiere";
import ChatPage from "./pages/ChatPage";
import Tutorials from "./pages/Tutorials";
import Outils from "./pages/Outils";
import Inbox from "./pages/Inbox";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import PageNotFound from "./pages/PageNotFound";
import WhiteboardsPage from "./pages/WhiteboardsPage";
import WhiteboardEditorPage from "./pages/WhiteboardEditorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 60 * 1000,
    },
  },
});
export default function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="actualites" element={<News />} />
              <Route path="actualites/:id" element={<NewsDetail />} />
              <Route path="matieres" element={<EspaceMatiere />} />
              <Route path="chat/:subjectId" element={<ChatPage />} />
              <Route path="moyenne" element={<Calcul />} />
              <Route path="outils" element={<Outils />} />
              <Route path="tutoriels" element={<Tutorials />} />
              <Route path="tableaux" element={<WhiteboardsPage />} />
              <Route path="tableaux/:id" element={<WhiteboardEditorPage />} />
              <Route path="messages" element={<Inbox />} />
              <Route path="messages/:username" element={<Inbox />} />
              <Route path="admin/news" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="admin/subjects" element={<AdminRoute><AdminSubjects /></AdminRoute>} />
              <Route path="admin/unites" element={<AdminRoute><AdminUnites /></AdminRoute>} />
              <Route path="admin/programs" element={<AdminRoute><AdminPrograms /></AdminRoute>} />
              <Route path="admin/videos" element={<AdminRoute><AdminVideos /></AdminRoute>} />
              <Route path="account" element={<Profile />} />
            </Route>

            <Route path="signup" element={<SignupLayout />}>
              <Route index element={<SignupStep1 />} />
              <Route path="verify" element={<SignupStep2 />} />
              <Route path="profile" element={<SignupStep3 />} />
            </Route>
            <Route path="auth/callback" element={<SignupProvider><AuthCallback /></SignupProvider>} />
              <Route path="login" element={<LoginPage />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="update-password" element={<UpdatePassword />} />
             <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
