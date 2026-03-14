import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import BrowseDecks from "./pages/BrowseDecks";
import DeckDetail from "./pages/DeckDetail";
import SessionSetup from "./pages/SessionSetup";
import PlaySession from "./pages/PlaySession";
import Resources from "./pages/Resources";
import AdminPage from "./pages/AdminPage";
import StickerCollection from "./pages/StickerCollection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/decks" element={<BrowseDecks />} />
            <Route path="/decks/:deckId" element={<DeckDetail />} />
            <Route path="/session/setup" element={<SessionSetup />} />
            <Route path="/play" element={<PlaySession />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/stickers" element={<StickerCollection />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
