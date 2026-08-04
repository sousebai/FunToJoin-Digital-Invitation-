'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SectionLabel from './SectionLabel';
import { ORANGE, ORANGE_GRADIENT, BG_ELEVATED, BORDER_SUBTLE, BORDER_ORANGE } from '../theme';

const SKILLS = [
  // Frontend
  { name: 'React.js', years: 5, category: 'frontend', level: 95 },
  { name: 'Next.js', years: 4, category: 'frontend', level: 90 },
  { name: 'TypeScript', years: 4, category: 'frontend', level: 90 },
  { name: 'JavaScript (ES6+)', years: 6, category: 'frontend', level: 98 },
  { name: 'HTML5 / CSS3', years: 6, category: 'frontend', level: 95 },
  { name: 'Redux / Zustand', years: 4, category: 'frontend', level: 85 },
  { name: 'Material UI / Tailwind', years: 4, category: 'frontend', level: 88 },
  { name: 'Vue.js', years: 2, category: 'frontend', level: 70 },
  // Backend
  { name: 'Node.js', years: 5, category: 'backend', level: 95 },
  { name: 'Express.js', years: 5, category: 'backend', level: 95 },
  { name: 'NestJS', years: 3, category: 'backend', level: 82 },
  { name: 'MongoDB', years: 5, category: 'backend', level: 92 },
  { name: 'PostgreSQL', years: 4, category: 'backend', level: 85 },
  { name: 'GraphQL', years: 3, category: 'backend', level: 80 },
  { name: 'REST API Design', years: 5, category: 'backend', level: 96 },
  { name: 'Redis', years: 3, category: 'backend', level: 78 },
  // Tools
  { name: 'Git / GitHub', years: 6, category: 'tool', level: 96 },
  { name: 'Docker', years: 3, category: 'tool', level: 82 },
  { name: 'AWS / Cloud', years: 3, category: 'tool', level: 75 },
  { name: 'CI/CD (GitHub Actions)', years: 3, category: 'tool', level: 80 },
  { name: 'Jest / Testing', years: 4, category: 'tool', level: 85 },
  { name: 'Webpack / Vite', years: 4, category: 'tool', level: 83 },
  { name: 'Linux / Shell', years: 5, category: 'tool', level: 80 },
  { name: 'Figma', years: 3, category: 'tool', level: 72 },
];

const CATEGORY_LABELS = {
  all: 'ALL',
  frontend: 'FRONT-END',
  backend: 'BACK-END',
  tool: 'TOOLS',
};

const CATEGORY_COLORS = {
  all: ORANGE,
  frontend: '#3B82F6',
  backend: '#10B981',
  tool: '#8B5CF6',
};

function SkillCard({ skill }) {
  const color = CATEGORY_COLORS[skill.category];
  const catLabel = CATEGORY_LABELS[skill.category];

  return (
    <Box
      sx={{
        bgcolor: BG_ELEVATED,
        border: `1px solid ${BORDER_SUBTLE}`,
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: BORDER_ORANGE,
          boxShadow: `0 0 20px rgba(232,114,21,0.12)`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 3,
          height: '100%',
          bgcolor: color,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', pr: 1 }}
        >
          {skill.name}
        </Typography>
        <Chip
          label={catLabel}
          size="small"
          sx={{
            bgcolor: `${color}18`,
            color: color,
            border: `1px solid ${color}40`,
            fontSize: '0.6rem',
            height: 20,
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          {skill.years} YR{skill.years !== 1 ? 'S' : ''} EXPERIENCE
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: color, fontWeight: 700, fontSize: '0.72rem', fontFamily: '"Roboto Mono", monospace' }}
        >
          {skill.level}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={skill.level}
        sx={{
          '& .MuiLinearProgress-bar': {
            background: skill.category === 'all' ? ORANGE_GRADIENT : color,
          },
        }}
      />
    </Box>
  );
}

export default function Skills() {
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? SKILLS : SKILLS.filter((s) => s.category === filter);

  return (
    <Box
      id="skills"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: 'background.default',
        borderTop: `1px solid ${BORDER_SUBTLE}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <SectionLabel>TECHNICAL SKILLS</SectionLabel>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '2rem', md: '2.6rem' } }}
          >
            My{' '}
            <Box
              component="span"
              sx={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Expertise
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 540 }}>
            A curated set of technologies I use daily to build modern, scalable, production-ready applications.
          </Typography>
        </Box>

        {/* Filter */}
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => { if (val) setFilter(val); }}
          sx={{ mb: 5, flexWrap: 'wrap', gap: 1 }}
        >
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            <ToggleButton
              key={cat}
              value={cat}
              sx={{
                border: `1px solid ${BORDER_SUBTLE} !important`,
                color: 'text.secondary',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                fontWeight: 700,
                px: 2.5,
                py: 0.8,
                borderRadius: '2px !important',
                '&.Mui-selected': {
                  bgcolor: `${ORANGE}18 !important`,
                  borderColor: `${ORANGE}60 !important`,
                  color: ORANGE,
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
              }}
            >
              {CATEGORY_LABELS[cat]}
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontSize: '0.58rem',
                  color: 'inherit',
                  opacity: 0.6,
                  fontFamily: '"Roboto Mono", monospace',
                }}
              >
                ({cat === 'all' ? SKILLS.length : SKILLS.filter((s) => s.category === cat).length})
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Grid */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
          {visible.map((skill) => (
            <Box key={skill.name}>
              <SkillCard skill={skill} />
            </Box>
          ))}
        </Box>

        {/* Summary row */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          mt={7}
          sx={{
            borderTop: `1px solid ${BORDER_SUBTLE}`,
            pt: 4,
            justifyContent: 'space-between',
          }}
        >
          {[
            { label: 'FRONT-END SKILLS', count: SKILLS.filter((s) => s.category === 'frontend').length, color: '#3B82F6' },
            { label: 'BACK-END SKILLS', count: SKILLS.filter((s) => s.category === 'backend').length, color: '#10B981' },
            { label: 'TOOLS & DEVOPS', count: SKILLS.filter((s) => s.category === 'tool').length, color: '#8B5CF6' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, bgcolor: item.color, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', letterSpacing: '0.12em', fontSize: '0.65rem' }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 800, color: item.color, fontFamily: '"Roboto Mono", monospace' }}
              >
                {item.count}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

