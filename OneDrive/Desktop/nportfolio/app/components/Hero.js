'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import { ORANGE, ORANGE_GRADIENT, HERO_GRADIENT } from '../theme';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const STATS = [
  { value: '5+', label: 'YEARS EXP.' },
  { value: '30+', label: 'PROJECTS' },
  { value: '15+', label: 'TECHNOLOGIES' },
];

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Background image */}
      <Box
        component="img"
        src="/hero-bg.webp"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center right',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Gradient overlay — left text stays readable */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: HERO_GRADIENT,
        }}
      />

      {/* Bottom fade */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '55%', lg: '52%' },
            pt: { xs: 14, md: 0 },
            pb: { xs: 8, md: 0 },
          }}
        >
          {/* Label */}
          <Typography
            variant="overline"
            sx={{
              color: ORANGE,
              letterSpacing: '0.22em',
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '0.7rem',
              mb: 2,
              display: 'block',
            }}
          >
            [ FULL-STACK DEVELOPER ]
          </Typography>

          {/* Main heading */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'text.primary',
              mb: 1,
              textTransform: 'uppercase',
            }}
          >
            Mohamed
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              mb: 1,
              textTransform: 'uppercase',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.55)',
            }}
          >
            Amine
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.2rem', lg: '5rem' },
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              mb: 3.5,
              textTransform: 'uppercase',
              background: ORANGE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Rzeigui
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 440,
              lineHeight: 1.7,
              mb: 4.5,
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            Senior Full-Stack JS &amp; MERN stack engineer. Building scalable
            systems, clean code, and end-to-end digital products that ship.
          </Typography>

          {/* CTA buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={6}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => scrollTo('projects')}
              sx={{
                background: ORANGE_GRADIENT,
                color: '#fff',
                fontWeight: 800,
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
                px: 4,
                py: 1.5,
                boxShadow: `0 0 30px rgba(232,114,21,0.35)`,
                '&:hover': { boxShadow: `0 0 40px rgba(232,114,21,0.55)` },
              }}
            >
              VIEW MY WORK
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<DownloadIcon />}
              onClick={() => scrollTo('contact')}
              sx={{
                borderColor: 'rgba(255,255,255,0.25)',
                color: 'text.primary',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.78rem',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: ORANGE,
                  color: ORANGE,
                  bgcolor: 'rgba(232,114,21,0.05)',
                },
              }}
            >
              CONTACT ME
            </Button>
          </Stack>

          {/* Stats */}
          <Stack direction="row" spacing={4}>
            {STATS.map((s, i) => (
              <Box key={i}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    color: ORANGE,
                    lineHeight: 1,
                    mb: 0.4,
                    fontFamily: '"Roboto Mono", monospace',
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', letterSpacing: '0.12em', fontSize: '0.6rem' }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: 0.5,
        }}
      >
        <Typography variant="overline" sx={{ fontSize: '0.58rem', letterSpacing: '0.18em' }}>
          SCROLL
        </Typography>
        <Box
          sx={{
            width: 1,
            height: 40,
            bgcolor: ORANGE,
            animation: 'scrollPulse 1.5s ease-in-out infinite',
            '@keyframes scrollPulse': {
              '0%': { opacity: 1, transform: 'scaleY(1)' },
              '50%': { opacity: 0.4, transform: 'scaleY(0.5)' },
              '100%': { opacity: 1, transform: 'scaleY(1)' },
            },
          }}
        />
      </Box>
    </Box>
  );
}

