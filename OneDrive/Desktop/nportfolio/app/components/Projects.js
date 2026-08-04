'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SectionLabel from './SectionLabel';
import { ORANGE, ORANGE_GRADIENT, BG_ELEVATED, BG_PAPER, BORDER_SUBTLE, BORDER_ORANGE } from '../theme';

const PROJECTS = [
  {
    id: 1,
    title: 'Real-time Chat App',
    subtitle: 'Full-Stack Messaging Platform',
    image: '/projects/chat-app.jpg',
    description:
      'A high-performance real-time chat application featuring instant message delivery, multi-room channels, online user status tracking, media file sharing, and end-to-end Socket.io connection management built with the MERN stack.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'MUI', 'Tailwind CSS'],
    category: 'MERN STACK',
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    id: 2,
    title: 'E-Commerce App',
    subtitle: 'Online Store & Payment Gateway',
    image: '/projects/ecommerce-app.jpg',
    description:
      'A full-stack luxury e-commerce web application featuring dynamic product search & filtering, interactive shopping cart management, Stripe payment processing, JWT user authentication, and admin order tracking.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Redux Toolkit', 'Stripe API', 'Material-UI'],
    category: 'MERN STACK',
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    id: 3,
    title: 'Book Recommendation',
    subtitle: 'AI-Powered Literary Engine',
    image: '/projects/book-recommendation.jpg',
    description:
      'An intelligent book discovery and recommendation platform that analyzes user reading history, genre preferences, and collaborative filtering metrics to deliver tailored book suggestions and reviews.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Python', 'Scikit-Learn', 'REST API'],
    category: 'MERN & AI',
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    subtitle: 'Enterprise Data Visualization',
    image: '/projects/dashboard.jpg',
    description:
      'An enterprise admin and analytics dashboard featuring interactive glowing charts, real-time metric aggregations, financial report widgets, customizable layouts, and responsive data tables.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Recharts', 'TypeScript', 'Material-UI'],
    category: 'FULL-STACK MERN',
    liveUrl: '#',
    codeUrl: '#',
  },
  {
    id: 5,
    title: 'Movie List App',
    subtitle: 'Cinema & Trailer Discovery',
    image: '/projects/movie-list.jpg',
    description:
      'A feature-rich movie list and cinema discovery app powered by TMDB API. Includes live search, trailer playback, genre categorization, personal watchlist bookmarks, and community ratings.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TMDB API', 'Framer Motion', 'Material-UI'],
    category: 'MERN STACK',
    liveUrl: '#',
    codeUrl: '#',
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <Box
      id="projects"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: '#0d0d0d',
        borderTop: `1px solid ${BORDER_SUBTLE}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 6,
            gap: 2,
          }}
        >
          <Box>
            <SectionLabel>SELECTED WORK</SectionLabel>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.6rem' } }}
            >
              Featured{' '}
              <Box
                component="span"
                sx={{
                  background: ORANGE_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Projects
              </Box>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Explore my latest full-stack MERN &amp; web applications. Click any card to view detailed specs.
            </Typography>
          </Box>
        </Box>

        {/* Project Cards Grid */}
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' } }}>
          {PROJECTS.map((project) => (
            <Box
              key={project.id}
            >
              <Box
                onClick={() => handleOpenModal(project)}
                sx={{
                  bgcolor: BG_ELEVATED,
                  border: `1px solid ${BORDER_SUBTLE}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: BORDER_ORANGE,
                    boxShadow: `0 12px 36px rgba(232, 114, 21, 0.2)`,
                    '& .project-img': {
                      transform: 'scale(1.05)',
                    },
                    '& .hover-overlay': {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Photo Container */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 200, sm: 220, md: 240 },
                    overflow: 'hidden',
                    bgcolor: '#161616',
                  }}
                >
                  <Box
                    component="img"
                    src={project.image}
                    alt={project.title}
                    className="project-img"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  {/* Hover Overlay */}
                  <Box
                    className="hover-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'rgba(10, 10, 10, 0.65)',
                      backdropFilter: 'blur(3px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <VisibilityIcon sx={{ color: ORANGE, fontSize: 28 }} />
                    <Typography
                      variant="overline"
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        fontSize: '0.75rem',
                      }}
                    >
                      View Project Details
                    </Typography>
                  </Box>
                </Box>

                {/* Title Container (Card contains ONLY photo & title as requested) */}
                <Box sx={{ p: 2.5, bgcolor: BG_ELEVATED, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      letterSpacing: '-0.01em',
                      color: 'text.primary',
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: ORANGE,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Project Detail Modal */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: BG_PAPER,
            color: 'text.primary',
            backgroundImage: 'none',
            border: `1px solid ${BORDER_ORANGE}`,
            borderRadius: 2,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
          },
        }}
      >
        {selectedProject && (
          <Box sx={{ position: 'relative' }}>
            {/* Close Button */}
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                bgcolor: 'rgba(0, 0, 0, 0.65)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${BORDER_SUBTLE}`,
                '&:hover': {
                  bgcolor: ORANGE,
                  color: '#fff',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Modal Image */}
            <Box
              sx={{
                width: '100%',
                maxHeight: { xs: 250, sm: 380, md: 440 },
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={selectedProject.image}
                alt={selectedProject.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  background: 'linear-gradient(to top, #111111 0%, transparent 100%)',
                }}
              />
            </Box>

            {/* Modal Body */}
            <DialogContent sx={{ p: { xs: 3, sm: 4.5 }, pt: { xs: 1, sm: 2 } }}>
              {/* Category & Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: ORANGE,
                    fontFamily: '"Roboto Mono", monospace',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    fontWeight: 700,
                  }}
                >
                  {selectedProject.category}
                </Typography>
              </Box>

              {/* Title & Subtitle */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.6rem', sm: '2.2rem' },
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                }}
              >
                {selectedProject.title}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  mb: 3,
                }}
              >
                {selectedProject.subtitle}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  fontSize: '0.95rem',
                  mb: 4,
                }}
              >
                {selectedProject.description}
              </Typography>

              {/* Tech Stack & Languages Used */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: ORANGE,
                    fontFamily: '"Roboto Mono", monospace',
                    fontSize: '0.68rem',
                    letterSpacing: '0.16em',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  TECHNOLOGIES &amp; LANGUAGES USED
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap gap={1} sx={{ flexWrap: 'wrap' }}>
                  {selectedProject.stack.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      sx={{
                        bgcolor: 'rgba(232, 114, 21, 0.1)',
                        color: '#fff',
                        border: `1px solid ${BORDER_ORANGE}`,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 0.5,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  sx={{
                    background: ORANGE_GRADIENT,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    px: 3,
                    py: 1.2,
                    boxShadow: `0 0 20px rgba(232, 114, 21, 0.3)`,
                    '&:hover': {
                      boxShadow: `0 0 30px rgba(232, 114, 21, 0.5)`,
                    },
                  }}
                >
                  LIVE DEMO
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  sx={{
                    borderColor: BORDER_SUBTLE,
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    px: 3,
                    py: 1.2,
                    '&:hover': {
                      borderColor: ORANGE,
                      color: ORANGE,
                      bgcolor: 'rgba(232, 114, 21, 0.08)',
                    },
                  }}
                >
                  VIEW CODE
                </Button>
              </Stack>
            </DialogContent>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
