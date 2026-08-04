'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SectionLabel from './SectionLabel';
import { ORANGE, ORANGE_GRADIENT, BG_ELEVATED, BORDER_SUBTLE, BORDER_ORANGE } from '../theme';

const HIGHLIGHTS = [
  'Expert in MERN stack (MongoDB, Express, React, Node.js)',
  'Full-stack TypeScript with REST & GraphQL APIs',
  'DevOps: Docker, CI/CD pipelines, cloud deployments',
  'Performance optimization and scalable architecture',
  'Team leadership & agile project management',
  'Open-source contributor and tech mentor',
];

const PERSONAL = [
  { label: 'LOCATION', value: 'Tunisia' },
  { label: 'EXPERIENCE', value: '5+ Years' },
  { label: 'AVAILABLE', value: 'Freelance / Full-time' },
  { label: 'LANGUAGES', value: 'Arabic · French · English' },
];

export default function About() {
  return (
    <Box
      id="about"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: '#0d0d0d',
        borderTop: `1px solid ${BORDER_SUBTLE}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
          {/* Left — text */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <SectionLabel>ABOUT ME</SectionLabel>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.6rem' },
                lineHeight: 1.15,
              }}
            >
              Turning complex ideas{' '}
              <Box
                component="span"
                sx={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                into reality
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2.5, fontSize: '0.97rem' }}
            >
              I'm <strong style={{ color: '#fff' }}>Mohamed Amine Rzeigui</strong>, a senior full-stack JavaScript
              engineer with 5+ years of professional experience building production-grade web applications from the
              ground up. I specialize in the MERN stack and the broader JavaScript ecosystem — crafting everything
              from real-time APIs and microservices to polished, responsive UIs.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2.5, fontSize: '0.97rem' }}
            >
              My approach is simple: write clean, maintainable code and ship fast without cutting corners on quality.
              I thrive in cross-functional teams, contribute to architecture decisions, and mentor junior developers —
              because great software is built by great teams.
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4, fontSize: '0.97rem' }}
            >
              Whether it&apos;s a startup MVP that needs to launch yesterday or an enterprise platform that needs to scale
              to millions of users, I bring the same precision, professionalism, and passion to the work.
            </Typography>

            {/* Highlights */}
            <Stack spacing={1.2}>
              {HIGHLIGHTS.map((h, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircleOutlinedIcon sx={{ color: ORANGE, fontSize: 16, mt: 0.25, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {h}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Right — info cards */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            {/* Info table */}
            <Box
              sx={{
                border: `1px solid ${BORDER_ORANGE}`,
                bgcolor: BG_ELEVATED,
                p: 3.5,
                mb: 3,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: ORANGE, letterSpacing: '0.16em', fontSize: '0.65rem', mb: 2.5, display: 'block' }}
              >
                PERSONAL INFO
              </Typography>
              <Stack spacing={2}>
                {PERSONAL.map((item, i) => (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'text.secondary', letterSpacing: '0.12em', fontSize: '0.6rem' }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.88rem' }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                    {i < PERSONAL.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Quote block */}
            <Box
              sx={{
                borderLeft: `3px solid ${ORANGE}`,
                pl: 3,
                py: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                }}
              >
                &ldquo;I don&apos;t just build features — I build systems that last. Every line of code I write is a
                commitment to the people who will use it and the developers who will maintain it.&rdquo;
              </Typography>
              <Typography
                variant="overline"
                sx={{ color: ORANGE, letterSpacing: '0.14em', fontSize: '0.65rem', mt: 1.5, display: 'block' }}
              >
                — Mohamed Amine Rzeigui
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

