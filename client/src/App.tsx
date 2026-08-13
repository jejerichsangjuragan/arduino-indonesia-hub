// Design note: Sirkuit Editorial — all routes share the same editorial shell, technical navigation, and clear escape paths.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tutorials from "./pages/Tutorials";
import Projects from "./pages/Projects";
import Shop from "./pages/Shop";
import SiteLayout from "./components/SiteLayout";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/tutorials" component={Tutorials} /><Route path="/projects" component={Projects} /><Route path="/shop" component={Shop} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster /><SiteLayout><Router /></SiteLayout></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
