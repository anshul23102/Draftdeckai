"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  File as FileIcon,
  Presentation as LayoutPresentation,
  Mail as MailIcon,
  Menu,
  LogOut,
  Sparkles,
  Zap,
  DollarSign,
  Workflow,
  User,
  Users,
  History,
  Coins,
  Crown,
  Gift,
  Shield,
  Info,
  Send,
  Layout,
  BookOpen,
  Trophy,
  Download,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { TooltipWithShortcut } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useUTMCapture } from "@/hooks/useUTMCapture";
import { UpgradeModal, useCredits } from "@/components/upgrade-modal";
import { PWAInstallButton } from "@/components/pwa-install-button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useTrackEvent } from "@/hooks/useTrackEvent";

// ─── Navigation Data ─────────────────────────────────────────────

const createItems = [
  {
    href: "/resume",
    label: "Resume",
    description: "AI-powered professional resumes",
    icon: <FileIcon className="h-[18px] w-[18px]" />,
    color:
      "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    href: "/presentation",
    label: "Presentation",
    description: "Stunning slide decks in minutes",
    icon: <LayoutPresentation className="h-[18px] w-[18px]" />,
    color:
      "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Structured docs with AI assist",
    icon: <Sparkles className="h-[18px] w-[18px]" />,
    color:
      "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    href: "/letter",
    label: "Cover Letter",
    description: "Professional letters & cover letters",
    icon: <MailIcon className="h-[18px] w-[18px]" />,
    color:
      "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
  },
  {
    href: "/diagram",
    label: "Diagram",
    description: "Flowcharts & architecture diagrams",
    icon: <Workflow className="h-[18px] w-[18px]" />,
    color:
      "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  },
];

const exploreLinks = [
  {
    href: "/templates",
    label: "Templates",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    href: "/showcase",
    label: "Showcase",
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: <DollarSign className="h-4 w-4" />,
  },
];

const dashboardItems = [
  {
    href: "/workspaces",
    label: "Workspaces",
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: <History className="h-4 w-4" />,
  },
  {
    href: "/dashboard/usage",
    label: "Usage",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    href: "/dashboard/export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
  },
  {
    href: "/dashboard/sessions",
    label: "Sessions",
    icon: <Shield className="h-4 w-4" />,
  },
];

const resourceItems = [
  {
    href: "/about",
    label: "About",
    icon: <Info className="h-4 w-4" />,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: <Send className="h-4 w-4" />,
  },
  {
    href: "/documentation",
    label: "Docs",
    icon: <BookOpen className="h-4 w-4" />,
  },
];

// ─── Component ───────────────────────────────────────────────────

export function SiteHeader() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const { credits, loading: creditsLoading } = useCredits();
  const [mobileCreateOpen, setMobileCreateOpen] = useState(true);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);

  useUTMCapture();
  const { trackEvent } = useTrackEvent();

  const isCreateActive = createItems.some(
    (item) => pathname === item.href || pathname?.startsWith(item.href + "/"),
  );
  const isDashboardActive = dashboardItems.some(
    (item) => pathname === item.href || pathname?.startsWith(item.href + "/"),
  );

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full nav-professional">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Left: Logo + Desktop Nav ───────────────── */}
          <div className="flex items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group min-w-0"
              aria-label="DraftDeckAI Homepage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 190 44"
                fill="none"
                className="h-9 sm:h-10 w-auto group-hover:scale-[1.03] transition-transform duration-300"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="brand-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient
                    id="spark-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                <g transform="translate(4, 6)">
                  <path
                    d="M 8 12 L 24 12 C 32 12 37 17 37 24 C 37 31 32 36 24 36 L 8 36 Z"
                    fill="#8B5CF6"
                    opacity="0.25"
                    transform="rotate(-6 22 24)"
                  />
                  <path
                    d="M 10 10 L 26 10 C 34 10 39 15 39 22 C 39 29 34 34 26 34 L 10 34 Z"
                    fill="#3B82F6"
                    opacity="0.45"
                    transform="rotate(-3 24 22)"
                  />
                  <path
                    d="M 12 8 L 28 8 C 36 8 41 13 41 20 C 41 27 36 32 28 32 L 12 32 Z"
                    fill="url(#brand-grad)"
                  />
                  <path
                    d="M 18 14 L 25 14 C 29 14 32 16 32 20 C 32 24 29 26 25 26 L 18 26 Z"
                    fill="#FFFFFF"
                    opacity="0.9"
                  />
                  <line
                    x1="21"
                    y1="18"
                    x2="29"
                    y2="18"
                    stroke="url(#brand-grad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="21"
                    y1="22"
                    x2="27"
                    y2="22"
                    stroke="url(#brand-grad)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <g transform="translate(36, 6)">
                    <path
                      d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z"
                      fill="url(#spark-grad)"
                    />
                  </g>
                </g>

                <text
                  x="54"
                  y="28"
                  fontSize="19"
                  fontWeight="700"
                  letterSpacing="-0.5"
                  className="fill-slate-900 dark:fill-slate-50 font-sans"
                >
                  DraftDeck
                </text>
                <text
                  x="151"
                  y="28"
                  fontSize="19"
                  fontWeight="800"
                  className="fill-[url(#brand-grad)] font-sans"
                >
                  AI
                </text>
              </svg>
            </Link>

            {/* ── Desktop Navigation ──────────────────── */}
            <nav
              role="navigation"
              aria-label="Main navigation"
              className="hidden lg:flex items-center ml-8 gap-0.5"
            >
              {/* Create Mega-Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "nav-trigger group",
                      isCreateActive && "nav-trigger-active",
                    )}
                    aria-label="Create documents"
                  >
                    Create
                    <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="w-[340px] p-2 bg-popover/98 backdrop-blur-xl border-border/60"
                >
                  {createItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className="p-0 focus:bg-transparent"
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-start gap-3 rounded-xl p-3 transition-all duration-200 w-full",
                          "hover:bg-accent/70",
                          pathname === item.href && "bg-accent",
                        )}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                            item.color,
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="pt-0.5">
                          <div className="text-sm font-semibold leading-none">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Separator */}
              <div className="h-4 w-px bg-border/60 mx-2" aria-hidden="true" />

              {/* Direct Links */}
              {exploreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-link",
                    pathname === item.href && "nav-link-active",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Dashboard Dropdown — signed-in users only */}
              {user && (
                <>
                  <div
                    className="h-4 w-px bg-border/60 mx-2"
                    aria-hidden="true"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "nav-trigger group",
                          isDashboardActive && "nav-trigger-active",
                        )}
                        aria-label="Dashboard menu"
                      >
                        Dashboard
                        <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={12}
                      className="w-[200px] bg-popover/98 backdrop-blur-xl border-border/60"
                    >
                      {dashboardItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-2.5 cursor-pointer",
                              pathname === item.href &&
                                "font-semibold text-foreground",
                            )}
                          >
                            <span className="text-muted-foreground">
                              {item.icon}
                            </span>
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* More / Resources */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-trigger group" aria-label="More links">
                    More
                    <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={12}
                  className="w-[180px] bg-popover/98 backdrop-blur-xl border-border/60"
                >
                  {resourceItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 cursor-pointer"
                      >
                        <span className="text-muted-foreground">
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* ── Right: Actions ─────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* PWA Install — tablet+ */}
            <div className="hidden sm:block">
              <TooltipWithShortcut content="Install DraftDeckAI as an app">
                <PWAInstallButton variant="ghost" size="sm" showText={false} />
              </TooltipWithShortcut>
            </div>

            {/* Theme Toggle */}
            <SimpleThemeToggle />

            {/* Credits Badge — desktop only */}
            {user && !creditsLoading && credits && (
              <TooltipWithShortcut
                content={`${credits.creditsRemaining} credits remaining`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUpgradeModalOpen(true)}
                  aria-label={`${credits.creditsRemaining} credits remaining. Click to upgrade.`}
                  className={cn(
                    "hidden lg:flex items-center gap-1.5 px-2.5 h-8 rounded-full transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    credits.creditsRemaining < 3
                      ? "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
                      : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                  )}
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">
                    {credits.creditsRemaining}
                  </span>
                  {credits.tier !== "free" && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </Button>
              </TooltipWithShortcut>
            )}

            {/* Desktop User Menu / Sign In */}
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse hidden lg:flex" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label="Open user menu"
                    className="relative h-8 w-8 rounded-full hidden lg:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-border/40 hover:ring-primary/30 transition-all duration-200">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.name || user.email}
                      />
                      <AvatarFallback className="bolt-gradient text-white font-semibold text-xs">
                        {(
                          user.user_metadata?.name?.[0] ||
                          user.email?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 bg-popover/98 backdrop-blur-xl border-border/60"
                >
                  <div className="flex items-center gap-2.5 p-3 border-b border-border/20">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bolt-gradient text-white text-xs">
                        {(
                          user.user_metadata?.name?.[0] ||
                          user.email?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.user_metadata?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Credits & Upgrade Section */}
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {credits ? (
                      <div className="flex items-center justify-between">
                        <span>
                          Credits: {credits.creditsRemaining}/
                          {credits.creditsTotal}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {credits.tier}
                        </Badge>
                      </div>
                    ) : (
                      <span>Loading credits...</span>
                    )}
                  </div>
                  <DropdownMenuItem
                    onClick={() => setUpgradeModalOpen(true)}
                    className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  >
                    <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Upgrade Plan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Link
                      href="/profile#referral"
                      className="flex items-center"
                    >
                      <Gift className="mr-2 h-4 w-4 text-green-500" />
                      <span className="font-medium">Refer & Earn Credits</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Desktop Sign In Button */
              <Button
                asChild
                className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 text-sm px-4 h-9 hidden lg:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-2"
                  onClick={() => trackEvent("Header Sign In Clicked")}
                >
                  <Zap className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}

            {/* ── Mobile / Tablet Hamburger ────────────── */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 hover:bg-accent/60 transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[340px] bg-background/[0.98] backdrop-blur-2xl border-border/30 p-0"
              >
                <div className="flex flex-col h-full">
                  {/* ── Sheet Header ── */}
                  <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/10 text-left">
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 190 44"
                        fill="none"
                        className="h-8 w-auto"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id="brand-grad-m"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                          <linearGradient
                            id="spark-grad-m"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#F59E0B" />
                          </linearGradient>
                        </defs>
                        <g transform="translate(4, 6)">
                          <path
                            d="M 8 12 L 24 12 C 32 12 37 17 37 24 C 37 31 32 36 24 36 L 8 36 Z"
                            fill="#8B5CF6"
                            opacity="0.25"
                            transform="rotate(-6 22 24)"
                          />
                          <path
                            d="M 10 10 L 26 10 C 34 10 39 15 39 22 C 39 29 34 34 26 34 L 10 34 Z"
                            fill="#3B82F6"
                            opacity="0.45"
                            transform="rotate(-3 24 22)"
                          />
                          <path
                            d="M 12 8 L 28 8 C 36 8 41 13 41 20 C 41 27 36 32 28 32 L 12 32 Z"
                            fill="url(#brand-grad-m)"
                          />
                          <path
                            d="M 18 14 L 25 14 C 29 14 32 16 32 20 C 32 24 29 26 25 26 L 18 26 Z"
                            fill="#FFFFFF"
                            opacity="0.9"
                          />
                          <line
                            x1="21"
                            y1="18"
                            x2="29"
                            y2="18"
                            stroke="url(#brand-grad-m)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="21"
                            y1="22"
                            x2="27"
                            y2="22"
                            stroke="url(#brand-grad-m)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <g transform="translate(36, 6)">
                            <path
                              d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z"
                              fill="url(#spark-grad-m)"
                            />
                          </g>
                        </g>
                        <text
                          x="54"
                          y="28"
                          fontSize="19"
                          fontWeight="700"
                          letterSpacing="-0.5"
                          className="fill-slate-900 dark:fill-slate-50 font-sans"
                        >
                          DraftDeck
                        </text>
                        <text
                          x="151"
                          y="28"
                          fontSize="19"
                          fontWeight="800"
                          className="fill-[url(#brand-grad-m)] font-sans"
                        >
                          AI
                        </text>
                      </svg>
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                      AI-powered document creation suite
                    </SheetDescription>
                  </SheetHeader>

                  {/* ── Scrollable Navigation ── */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                    <nav
                      role="navigation"
                      aria-label="Mobile navigation"
                      className="space-y-6"
                    >
                      {/* Create — Collapsible Section */}
                      <div>
                        <button
                          onClick={() => setMobileCreateOpen(!mobileCreateOpen)}
                          className="mobile-section-header"
                          aria-expanded={mobileCreateOpen}
                        >
                          <span>Create</span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200",
                              mobileCreateOpen && "rotate-180",
                            )}
                          />
                        </button>
                        <div
                          className={cn(
                            "mobile-section-body",
                            mobileCreateOpen && "mobile-section-body-open",
                          )}
                        >
                          <ul className="space-y-0.5 pt-1.5">
                            {createItems.map((item) => (
                              <li key={item.href}>
                                <SheetClose asChild>
                                  <Link
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className={cn(
                                      "mobile-nav-item",
                                      pathname === item.href &&
                                        "mobile-nav-item-active",
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                                        item.color,
                                      )}
                                    >
                                      {item.icon}
                                    </span>
                                    <div className="min-w-0">
                                      <div className="text-sm font-medium text-foreground truncate">
                                        {item.label}
                                      </div>
                                      <div className="text-[11px] text-muted-foreground truncate">
                                        {item.description}
                                      </div>
                                    </div>
                                  </Link>
                                </SheetClose>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Explore Section */}
                      <div>
                        <div className="mobile-section-label">Explore</div>
                        <ul className="space-y-0.5 pt-1.5">
                          {exploreLinks.map((item) => (
                            <li key={item.href}>
                              <SheetClose asChild>
                                <Link
                                  href={item.href}
                                  onClick={handleNavClick}
                                  className={cn(
                                    "mobile-nav-item-simple",
                                    pathname === item.href &&
                                      "mobile-nav-item-active",
                                  )}
                                >
                                  <span className="text-muted-foreground">
                                    {item.icon}
                                  </span>
                                  <span className="font-medium">
                                    {item.label}
                                  </span>
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dashboard — Collapsible, signed-in only */}
                      {user && (
                        <div>
                          <button
                            onClick={() =>
                              setMobileDashboardOpen(!mobileDashboardOpen)
                            }
                            className="mobile-section-header"
                            aria-expanded={mobileDashboardOpen}
                          >
                            <span>Dashboard</span>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 transition-transform duration-200",
                                mobileDashboardOpen && "rotate-180",
                              )}
                            />
                          </button>
                          <div
                            className={cn(
                              "mobile-section-body",
                              mobileDashboardOpen && "mobile-section-body-open",
                            )}
                          >
                            <ul className="space-y-0.5 pt-1.5">
                              {dashboardItems.map((item) => (
                                <li key={item.href}>
                                  <SheetClose asChild>
                                    <Link
                                      href={item.href}
                                      onClick={handleNavClick}
                                      className={cn(
                                        "mobile-nav-item-simple",
                                        pathname === item.href &&
                                          "mobile-nav-item-active",
                                      )}
                                    >
                                      <span className="text-muted-foreground">
                                        {item.icon}
                                      </span>
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
                                    </Link>
                                  </SheetClose>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Resources Section */}
                      <div>
                        <div className="mobile-section-label">Resources</div>
                        <ul className="space-y-0.5 pt-1.5">
                          {resourceItems.map((item) => (
                            <li key={item.href}>
                              <SheetClose asChild>
                                <Link
                                  href={item.href}
                                  onClick={handleNavClick}
                                  className={cn(
                                    "mobile-nav-item-simple",
                                    pathname === item.href &&
                                      "mobile-nav-item-active",
                                  )}
                                >
                                  <span className="text-muted-foreground">
                                    {item.icon}
                                  </span>
                                  <span className="font-medium">
                                    {item.label}
                                  </span>
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </nav>
                  </div>

                  {/* ── Sheet Footer: User / Sign In ── */}
                  <div className="border-t border-border/10 p-4">
                    {user ? (
                      <div>
                        {/* Credits info */}
                        {credits && (
                          <button
                            onClick={() => {
                              setIsSheetOpen(false);
                              setUpgradeModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 mb-3 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors text-sm"
                          >
                            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                              <Coins className="h-4 w-4" />
                              <span className="font-medium">
                                {credits.creditsRemaining} credits
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize"
                            >
                              {credits.tier}
                            </Badge>
                          </button>
                        )}

                        {/* User card */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                          <Avatar className="h-10 w-10 ring-2 ring-border/30">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback className="bolt-gradient text-white text-sm font-semibold">
                              {(
                                user.user_metadata?.name?.[0] ||
                                user.email?.[0] ||
                                "U"
                              ).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user.user_metadata?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* User actions */}
                        <div className="space-y-0.5 mt-3">
                          <SheetClose asChild>
                            <Link
                              href="/profile"
                              className="mobile-nav-item-simple"
                            >
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Profile</span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="/settings"
                              className="mobile-nav-item-simple"
                            >
                              <Sparkles className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Settings</span>
                            </Link>
                          </SheetClose>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 w-full justify-start transition-colors h-auto"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          href="/auth/signin"
                          className="w-full bolt-gradient text-white font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                          onClick={() => trackEvent("Header Sign In Clicked")}
                        >
                          <Zap className="h-4 w-4" />
                          Sign In to DraftDeckAI
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        creditsInfo={credits}
      />
    </header>
  );
}
