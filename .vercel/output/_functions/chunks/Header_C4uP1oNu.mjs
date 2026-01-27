import { e as createComponent, f as createAstro, m as maybeRenderHead, n as renderScript, k as renderComponent, r as renderTemplate, p as Fragment } from './astro/server_0Ysjtq05.mjs';
import 'piccolore';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check, Circle, ShieldCheckIcon, LayoutDashboardIcon, Globe, Mic, UserIcon, SettingsIcon, LogOutIcon, Bell, Info, UserPlus, MessageSquare, Heart } from 'lucide-react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { c as cn } from './utils_C0eazIxq.mjs';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { s as supabase, c as createSupabaseServerClient } from './supabase_DsxxBtwu.mjs';
import { createClient } from '@supabase/supabase-js';

const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    onWheel: (e) => e.stopPropagation(),
    onTouchMove: (e) => e.stopPropagation(),
    className: cn(
      "z-[1001] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, variant = "default", ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      variant === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

function HeaderUserDropdown({ user, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "auto";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  const firstName = user.first_name || "";
  const lastName = user.last_name || "";
  const fullName = user.full_name || `${firstName} ${lastName}`.trim() || user.email?.split("@")[0] || "User";
  const displayName = firstName && lastName ? `${firstName} ${lastName}` : fullName;
  const email = user.email || "";
  const avatarUrl = user.avatar_url;
  const userRole = (profile?.role || (user.role && user.role !== "authenticated" ? user.role : null) || "Basic").trim();
  const profileSlug = profile?.profile_slug || user.profile_slug;
  const profileLink = profileSlug ? `/profile/${profileSlug}` : "/profile";
  useEffect(() => {
    console.log("[HeaderUserDropdown] User object:", user);
    console.log("[HeaderUserDropdown] Profile object:", profile);
    console.log("[HeaderUserDropdown] User role:", user.role);
    console.log("[HeaderUserDropdown] Profile role:", profile?.role);
    console.log("[HeaderUserDropdown] Final userRole:", userRole);
    console.log("[HeaderUserDropdown] isAdministrator:", userRole === "Administrator");
    console.log("[HeaderUserDropdown] Role comparison:", {
      userRole,
      isExactMatch: userRole === "Administrator",
      includesAdmin: userRole.toLowerCase().includes("admin")
    });
  }, [userRole, user.role, profile?.role]);
  const initials = (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "") || fullName?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U";
  const getRoleColor = (role) => {
    switch (role) {
      case "Administrator":
        return "bg-yellow-500/20 text-yellow-500";
      case "CountryManager":
        return "bg-blue-500/20 text-blue-500";
      case "Expert":
        return "bg-green-500/20 text-green-500";
      case "Ads":
        return "bg-purple-500/20 text-purple-500";
      case "Events":
        return "bg-orange-500/20 text-orange-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };
  const roleColorClass = getRoleColor(userRole);
  const isAdministrator = userRole === "Administrator" || userRole.toLowerCase() === "administrator";
  const handleSignOut = async () => {
    window.location.href = "/api/auth/signout";
  };
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!isMobile) {
      setIsOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative",
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: /* @__PURE__ */ jsxs(DropdownMenu, { open: isOpen, onOpenChange: setIsOpen, modal: false, children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleClick,
            className: "flex items-center gap-x-2 text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors focus:outline-none",
            children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open user menu" }),
              /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 cursor-pointer", style: { backgroundColor: "#00c44b" }, children: [
                avatarUrl ? /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName }) : null,
                /* @__PURE__ */ jsx(AvatarFallback, { className: "text-white font-bold", style: { backgroundColor: "#00c44b" }, children: initials })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "hidden xl:block", children: firstName || email?.split("@")[0] }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "h-5 w-5 flex-none text-gray-400 group-hover:text-primary-400",
                  viewBox: "0 0 20 20",
                  fill: "currentColor",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      fillRule: "evenodd",
                      d: "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z",
                      clipRule: "evenodd"
                    }
                  )
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs(
          DropdownMenuContent,
          {
            className: "w-80 bg-white border border-gray-200 shadow-lg",
            align: "end",
            sideOffset: 8,
            onMouseEnter: () => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              if (!isMobile) {
                setIsOpen(true);
              }
            },
            onMouseLeave: handleMouseLeave,
            children: [
              /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "flex items-center gap-4 px-4 py-3 font-normal border-b border-gray-200", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxs(Avatar, { className: "size-10", style: { backgroundColor: "#00c44b" }, children: [
                    avatarUrl ? /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName }) : null,
                    /* @__PURE__ */ jsx(AvatarFallback, { className: "text-white font-bold", style: { backgroundColor: "#00c44b" }, children: initials })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "absolute right-0 bottom-0 block size-2.5 rounded-full bg-green-600 ring-2 ring-white" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-dark text-base font-semibold", children: displayName }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-sm", children: email })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `px-4 py-2 border-b border-gray-200 ${roleColorClass}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(ShieldCheckIcon, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wide", children: userRole })
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "bg-gray-200" }),
              /* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
                isAdministrator && /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = "/admin",
                    children: [
                      /* @__PURE__ */ jsx(LayoutDashboardIcon, { className: "text-yellow-500 size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-yellow-500 font-bold", children: "Admin" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = "/z-network",
                    children: [
                      /* @__PURE__ */ jsx(Globe, { className: "text-dark size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-dark font-semibold", children: "Z-NETWORK" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = "/z-talks",
                    children: [
                      /* @__PURE__ */ jsx(Mic, { className: "text-dark size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-dark font-semibold", children: "Z-TALKS" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = "/dashboard/profile",
                    children: [
                      /* @__PURE__ */ jsx(UserIcon, { className: "text-dark size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-dark font-semibold", children: "User Area" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = profileLink,
                    children: [
                      /* @__PURE__ */ jsx(UserIcon, { className: "text-dark size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-dark", children: "Your Profile" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "px-4 py-2.5 text-base cursor-pointer",
                    onClick: () => window.location.href = "/dashboard/profile/edit",
                    children: [
                      /* @__PURE__ */ jsx(SettingsIcon, { className: "text-dark size-5 mr-3" }),
                      /* @__PURE__ */ jsx("span", { className: "text-dark", children: "Settings" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "bg-gray-200" }),
              /* @__PURE__ */ jsxs(
                DropdownMenuItem,
                {
                  variant: "destructive",
                  className: "px-4 py-2.5 text-base cursor-pointer",
                  onClick: handleSignOut,
                  children: [
                    /* @__PURE__ */ jsx(LogOutIcon, { className: "size-5 mr-3" }),
                    /* @__PURE__ */ jsx("span", { children: "Sign Out" })
                  ]
                }
              )
            ]
          }
        )
      ] })
    }
  );
}

function HeaderNotifications({ currentUserId, sessionAccessToken }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
    }
  }, [currentUserId]);
  const fetchNotifications = async () => {
    try {
      console.log("🔔 [HeaderNotifications] Checking props user:", currentUserId);
      if (!currentUserId) return;
      let effectiveClient = supabase;
      if (sessionAccessToken) {
        const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
        effectiveClient = createClient(supabaseUrl, supabaseKey, {
          global: {
            headers: {
              Authorization: `Bearer ${sessionAccessToken}`
            }
          }
        });
      }
      const { data, error } = await effectiveClient.from("notifications").select("*").eq("user_id", currentUserId).order("created_at", { ascending: false }).limit(10);
      if (error) {
        console.error("🔔 [HeaderNotifications] Error fetching:", error);
        return;
      }
      console.log("🔔 [HeaderNotifications] Data received:", data?.length, "rows");
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.error("🔔 [HeaderNotifications] Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (id) => {
    if (!currentUserId) return;
    let effectiveClient = supabase;
    if (sessionAccessToken) {
      const supabaseUrl = "https://ddgdtdhgaqeqnoigmfrh.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2R0ZGhnYXFlcW5vaWdtZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDE3NjMsImV4cCI6MjA4MjYxNzc2M30.aSW3Ds1z-8ta1sx-22P3NGyx4jzaY0aGNPPB9PsFcs0";
      effectiveClient = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${sessionAccessToken}`
          }
        }
      });
    }
    let query = effectiveClient.from("notifications").update({ is_read: true }).eq("user_id", currentUserId);
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("is_read", false);
    }
    await query;
    fetchNotifications();
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "relative text-gray-300 hover:text-white transition-colors focus:outline-none mr-2", children: [
      /* @__PURE__ */ jsx(Bell, { className: "w-6 h-6" }),
      unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-primary-500", children: unreadCount > 9 ? "9+" : unreadCount })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-80 bg-white border border-gray-200 shadow-lg mt-2 max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DropdownMenuLabel, { className: "font-semibold text-gray-900 border-b border-gray-100 pb-2 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { children: "Notifications" }),
        unreadCount > 0 && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              markAsRead();
            },
            className: "text-xs font-normal text-green-600 hover:text-green-700 cursor-pointer",
            children: "Mark all read"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "py-1", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-500 text-sm", children: "Loading..." }) : notifications.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-500 text-sm", children: "No notifications" }) : notifications.map((notification, index) => {
        let Icon = Bell;
        let iconColor = "text-gray-400";
        switch (notification.type) {
          case "like":
            Icon = Heart;
            iconColor = "text-red-500";
            break;
          case "comment":
            Icon = MessageSquare;
            iconColor = "text-blue-500";
            break;
          case "follow":
          case "connection_request":
            Icon = UserPlus;
            iconColor = "text-green-500";
            break;
          case "system":
            Icon = Info;
            iconColor = "text-gray-500";
            break;
        }
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            DropdownMenuItem,
            {
              className: `cursor-pointer flex flex-col items-start gap-1 p-3 hover:bg-gray-50 ${!notification.is_read ? "bg-green-50/50" : ""}`,
              onClick: () => markAsRead(notification.id),
              children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full", children: [
                /* @__PURE__ */ jsx("div", { className: `mt-1 ${iconColor}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full", children: [
                    /* @__PURE__ */ jsx("span", { className: `font-medium text-sm ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`, children: notification.title }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 whitespace-nowrap ml-2", children: new Date(notification.created_at).toLocaleDateString() })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 line-clamp-2 mt-0.5", children: notification.message })
                ] })
              ] })
            }
          ),
          index < notifications.length - 1 && /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "bg-gray-100" })
        ] }, notification.id);
      }) })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Header;
  const locals = Astro2.locals;
  let profile = locals.profile;
  console.log("[Header] locals.profile:", locals.profile);
  console.log("[Header] locals.user:", locals.user?.id, locals.user?.email);
  if (!profile && locals.user) {
    console.log(
      "[Header] Profile no encontrado en locals, obteniendo desde Supabase..."
    );
    const supabase = createSupabaseServerClient({
      req: Astro2.request,
      cookies: Astro2.cookies
    });
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("role, full_name, avatar_url, profile_slug").eq("id", locals.user.id).single();
    console.log("[Header] Profile query result:", { profileData, profileError });
    if (profileError) {
      console.error("[Header] Error obteniendo profile:", profileError);
    }
    if (profileData) {
      profile = {
        role: profileData.role || void 0,
        profile_slug: profileData.profile_slug || void 0
      };
      console.log("[Header] Profile obtenido:", profile);
    } else {
      console.warn("[Header] Profile data no v\xE1lido:", profileData);
    }
  } else if (profile) {
    console.log("[Header] Profile encontrado en locals:", profile);
  }
  return renderTemplate`${maybeRenderHead()}<header class="fixed top-0 left-0 z-1000 w-full border-b border-(--border-color) transition-all duration-300" id="main-header" style="height: 70px; min-height: 70px; max-height: 70px; box-sizing: border-box;"> <div class="flex h-full items-center justify-between w-full px-4 sm:px-6 lg:px-8" style="background-color: #0d241b;"> <!-- Block 1: Left Logo (ZVENIA Mining) --> <div class="flex items-center shrink-0"> <a href="/"> <img src="/ZVENIA-Mining-Logo.svg" alt="ZVENIA Mining" class="w-full" style="max-height: 45px; height: auto;"> </a> </div> <!-- Block 2: Center Logo (ZVENIA) --> <div class="flex items-center justify-center flex-1"> <a href="/"> <img src="/zvenia-Logo.svg" alt="Zvenia" class="w-auto" style="height: 40px;"> </a> </div> <!-- Block 3: Right Actions (User Menu / Login) --> <div class="flex items-center justify-end shrink-0 gap-x-6"> ${Astro2.locals.user ? renderTemplate`<div class="flex items-center gap-4"> ${renderComponent($$result, "HeaderNotifications", HeaderNotifications, { "client:load": true, "currentUserId": Astro2.locals.user?.id, "sessionAccessToken": Astro2.locals.session?.access_token, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/HeaderNotifications", "client:component-export": "default" })} ${(() => {
    const locals2 = Astro2.locals;
    const user = locals2.user;
    const userRole = profile?.role || (user?.role && user?.role !== "authenticated" ? user?.role : null) || null;
    return renderTemplate`${renderComponent($$result, "HeaderUserDropdown", HeaderUserDropdown, { "client:load": true, "user": {
      email: user?.email || "",
      first_name: user?.first_name || null,
      last_name: user?.last_name || null,
      full_name: user?.full_name || null,
      avatar_url: user?.avatar_url || null,
      role: userRole
      // Usar el rol del profile primero
    }, "profile": profile ? {
      role: profile.role,
      profile_slug: profile.profile_slug
    } : null, "client:component-hydration": "load", "client:component-path": "D:/zveniaproject/src/components/HeaderUserDropdown", "client:component-export": "default" })}`;
  })()} </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <a href="/login" class="text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors">
Log In
</a> <a href="/join" class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors">
Join <span aria-hidden="true">&rarr;</span> </a> ` })}`} </div> <!-- Mobile Menu Button --> <div class="md:hidden"> <button type="button" class="text-gray-300 hover:text-white p-2" aria-label="Menu" id="mobile-menu-btn"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> <!-- Mobile Menu (Hidden by default) --> <div class="hidden md:hidden bg-black border-t border-white/10" id="mobile-menu"> <div class="px-4 pt-2 pb-6 space-y-1"> <!-- Mobile Nav Links Removed --> <div class="pt-4 border-t border-white/10 mt-4 flex flex-col gap-3"> <a href="/login" class="block text-center px-3 py-2 text-base font-medium text-gray-300 hover:text-white">Log In</a> <a href="/join" class="block text-center px-3 py-3 text-base font-bold text-black bg-primary-400 hover:bg-primary-500 rounded-md">Join Free</a> </div> </div> </div> </header> ${renderScript($$result, "D:/zveniaproject/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/zveniaproject/src/components/Header.astro", void 0);

export { $$Header as $ };
