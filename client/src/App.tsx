import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import { WeddingPage } from "./pages/WeddingPage";
import BruiloftenPage from "./pages/BruiloftenPage";
import { CorporatePage } from "./pages/CorporatePage";
import { SocialPage } from "./pages/SocialPage";
import { BBQPage } from "./pages/BBQPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ContactPage } from "./pages/ContactPage";
import Custom404 from "./pages/Custom404";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
        <Route path="/" component={Index} />
        <Route path="/wedding" component={WeddingPage} />
        <Route path="/bruiloften" component={BruiloftenPage} />
        <Route path="/corporate" component={CorporatePage} />
        <Route path="/social" component={SocialPage} />
        <Route path="/bbq" component={BBQPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/contact" component={ContactPage} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" component={Custom404} />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
