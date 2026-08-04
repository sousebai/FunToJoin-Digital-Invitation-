'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { ORANGE, BORDER_SUBTLE } from '../theme';

const SOCIALS = [
  { icon: <GitHubIcon fontSize="small" />, href: 'https://github.com' },
  { icon: <LinkedInIcon fontSize="small" />, href: 'https://linkedin.com' },
  { icon: <TwitterIcon fontSize="small" />, href: 'https://twitter.com' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${BORDER_SUBTLE}`,
        bgcolor: '#070707',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 2,
          }}
        >
          {/* Left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: ORANGE, transform: 'rotate(45deg)' }} />
            <Typography
              variant="overline"
              sx={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.72rem', color: 'text.primary' }}
            >
              MA. RZEIGUI
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', letterSpacing: '0.06em', fontSize: '0.65rem' }}
            >
              FULL-STACK ENGINEER
            </Typography>
          </Box>

          {/* Center */}
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.06em', textAlign: 'center' }}
          >
            &copy; {new Date().getFullYear()} Mohamed Amine Rzeigui. Built with Next.js + MUI.
          </Typography>

          {/* Right */}
          <Stack direction="row" spacing={0.5}>
            {SOCIALS.map((s, i) => (
              <IconButton
                key={i}
                component="a"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: ORANGE },
                  transition: 'color 0.2s',
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

