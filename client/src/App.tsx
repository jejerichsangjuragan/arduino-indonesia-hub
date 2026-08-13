// Design note: public routes keep the Sirkuit Editorial shell; moderation uses the scaffold DashboardLayout for a focused internal tool.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import SiteLayout from "./components/SiteLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminModeration from "./pages/AdminModeration";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Shop from "./pages/Shop";
import Tutorials from "./pages/Tutorials";

function PublicRouter() {
  return <Switch><Route path="/" component={Home} /><Route path="/tutorials" component={Tutorials} /><Route path="/projects" component={Projects} /><Route path="/shop" component={Shop} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function Router() {
  return <Switch><Route path="/admin/moderation"><DashboardLayout><AdminModeration /></DashboardLayout></Route><Route><SiteLayout><PublicRouter /></SiteLayout></Route></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
