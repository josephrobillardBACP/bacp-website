import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutBlueAngelPage from "./pages/AboutBlueAngelPage";
import ServicesPage from "./pages/ServicesPage";
import ResourcesPage from "./pages/ResourcesPage";
import SuccessionPlanningPage from "./pages/SuccessionPlanningPage";
import SuccessionPlanningGuidePage from "./pages/SuccessionPlanningGuidePage";
import JoiningPracticePage from "./pages/JoiningPracticePage";
import CareersPage from "./pages/CareersPage";
import BlogPage from "./pages/BlogPage";
import NewsStoryPage from "./pages/NewsStoryPage";
import BeAPartnerPage from "./pages/BeAPartnerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const routerBasename =
  import.meta.env.BASE_URL === "/"
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");

const redirectedPath = sessionStorage.getItem("spa-redirect");
if (redirectedPath) {
  sessionStorage.removeItem("spa-redirect");
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL}${redirectedPath}`);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutBlueAngelPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route
            path="/resources/succession-planning"
            element={<SuccessionPlanningPage />}
          />
          <Route
            path="/resources/succession-planning-guide"
            element={<SuccessionPlanningGuidePage />}
          />
          <Route
            path="/resources/joining-a-practice"
            element={<JoiningPracticePage />}
          />
          <Route path="/resources/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:storyId" element={<NewsStoryPage />} />
          <Route path="/be-a-partner" element={<BeAPartnerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Paths carried over from the live blueangelclinical.com so existing
              links and bookmarks keep working. */}
          <Route path="/why-blue-angel" element={<Navigate to="/about" replace />} />
          <Route
            path="/partners"
            element={<Navigate to="/about#current-partners" replace />}
          />
          <Route path="/benefits" element={<Navigate to="/services" replace />} />
          <Route
            path="/selling"
            element={<Navigate to="/resources/succession-planning" replace />}
          />
          <Route
            path="/succession"
            element={<Navigate to="/resources/succession-planning" replace />}
          />
          <Route
            path="/joining"
            element={<Navigate to="/resources/joining-a-practice" replace />}
          />
          <Route path="/careers" element={<Navigate to="/resources/careers" replace />} />
          <Route path="/contact" element={<Navigate to="/be-a-partner" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
