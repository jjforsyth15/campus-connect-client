"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Profile } from "@/app/profile/page";
import { loadProfile } from "@/lib/load-profile";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EventIcon from "@mui/icons-material/Event";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

type SidebarProps = {
  drawerWidth: number;
  onLogout: () => void;
};

// SRC icon using the SRCcard.png from /public/cards
const SRCIcon: React.ReactNode = (
  <Box
    component="img"
    src="/cards/SRCcard.png"
    alt="SRC"
    sx={{
      width: 40,
      height: 40,
      objectFit: "contain",
      display: "block",
      ml: -0.8,
    }}
  />
);

const navItems: { label: string; icon: React.ReactNode; href?: string }[] = [
  { label: "Home", icon: <HomeIcon />, href: "/" },
  { label: "Social", icon: <GroupsIcon />, href: "/social" },
  { label: "Messages", icon: <MailOutlineIcon />, href: "/messages" },
  { label: "Events", icon: <EventIcon />, href: "/events" },
  { label: "Clubs", icon: <Diversity3Icon />, href: "/clubs" },
  { label: "Academics", icon: <SchoolIcon />, href: "/academics" },
  { label: "Marketplace", icon: <StorefrontIcon />, href: "/marketplace" },
  { label: "SRC", icon: SRCIcon, href: "/ToroSRC" },
];

const DashboardSidebar: React.FC<SidebarProps> = ({ drawerWidth, onLogout }) => {
  const pathname = usePathname();
  const [profile] = React.useState<Profile>(loadProfile());

  const name = `${profile?.first ?? ""} ${profile?.last ?? ""}`.trim();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 0,
          bgcolor: "#A80532",
          color: "rgba(255,255,255,0.92)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          
          zIndex: 1400,
          pointerEvents: "auto",
        },
      }}
    >
      {/* Logout icon (top-left) */}
      <IconButton
        onClick={onLogout}
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          borderRadius: 2,
          p: 0.75,
          color: "#fff",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
        }}
      >
        <LogoutIcon />
      </IconButton>

      {/* Settings icon (top-right) */}
      <IconButton
        component={Link}
        href="/settings"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          borderRadius: 2,
          p: 0.75,
          color: "#fff",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
        }}
      >
        <SettingsIcon />
      </IconButton>

      {/* Logo */}
      <Box sx={{ pt: 4.5, px: 2, pb: 1 }}>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Box
            component="img"
            src="/ToroConnectLogoCircle.png"
            alt="Toro Campus Connect Logo"
            sx={{
              width: "100%",
              maxWidth: 160,
              aspectRatio: "1 / 1",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 1 }} />

      {/* Nav items */}
      <List sx={{ px: 0, mt: 1 }}>
        {navItems.map((item) => {
          const active =
            !!item.href &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={item.href ? Link : "button"}
                href={item.href as any}
                onClick={
                  item.href
                    ? undefined
                    : () => {
                        // placeholder for non-routed items (Messages)
                        alert("Coming soon");
                      }
                }
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}
                selected={active}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Profile button */}
      <Box sx={{ p: 2, pt: 1 }}>
        <Button
          component={Link}
          href="/profile"
          fullWidth
          startIcon={
            <Avatar sx={{ bgcolor: "#e11d48" }}>
              <PersonIcon />
            </Avatar>
          }
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            px: 2,
            py: 1.25,
            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
          }}
        >
          <Box textAlign="left">
            <Typography variant="body2" fontWeight={700}>
              {name || "Profile"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              View Profile
            </Typography>
          </Box>
        </Button>
      </Box>
    </Drawer>
  );
};

export default DashboardSidebar;