'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ORANGE, ORANGE_GRADIENT, BG_PAPER, BORDER_SUBTLE } from '../theme';

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT', href: '#contact' },
];

function scrollTo(href) {
  const el = document.getElementById(href.replace('#', ''));
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 60 });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(10,10,10,0.94)' : 'transparent',
          borderBottom: scrolled ? `1px solid ${BORDER_SUBTLE}` : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 0.3s, border-bottom 0.3s, backdrop-filter 0.3s',
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            width: '100%',
            px: { xs: 2, md: 5 },
            minHeight: { xs: 64, md: 72 },
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                bgcolor: ORANGE,
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontSize: '0.95rem',
                letterSpacing: '0.12em',
                color: 'text.primary',
                textTransform: 'uppercase',
              }}
            >
              MA. RZEIGUI
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                letterSpacing: '0.08em',
                fontSize: '0.62rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              FULL-STACK ENGINEER
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    px: 2,
                    '&:hover': { color: ORANGE, bgcolor: 'transparent' },
                    transition: 'color 0.2s',
                  }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                variant="outlined"
                onClick={() => scrollTo('#contact')}
                sx={{
                  ml: 2,
                  borderColor: ORANGE,
                  color: ORANGE,
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  px: 2.5,
                  py: 0.8,
                  '&:hover': { bgcolor: 'rgba(232,114,21,0.08)', borderColor: ORANGE },
                }}
              >
                HIRE ME
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: BG_PAPER,
              borderLeft: `1px solid ${BORDER_SUBTLE}`,
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: ORANGE, transform: 'rotate(45deg)' }} />
            <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.8rem' }}>
              MA. RZEIGUI
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 2 }}>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton
                onClick={() => { scrollTo(link.href); setOpen(false); }}
                sx={{ px: 3, py: 1.5 }}
              >
                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ px: 3, pt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => { scrollTo('#contact'); setOpen(false); }}
              sx={{
                background: ORANGE_GRADIENT,
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
                py: 1.2,
              }}
            >
              HIRE ME
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

