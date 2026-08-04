'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from '@mui/material/IconButton';
import SectionLabel from './SectionLabel';
import { ORANGE, ORANGE_GRADIENT, BG_ELEVATED, BORDER_SUBTLE, BORDER_ORANGE } from '../theme';

const CONTACT_INFO = [
  {
    icon: <EmailOutlinedIcon sx={{ color: ORANGE, fontSize: 20 }} />,
    label: 'EMAIL',
    value: 'contact@marzeigui.dev',
  },
  {
    icon: <LocationOnOutlinedIcon sx={{ color: ORANGE, fontSize: 20 }} />,
    label: 'LOCATION',
    value: 'Tunisia — Available Remote',
  },
];

const SOCIALS = [
  { icon: <GitHubIcon />, label: 'GitHub', href: 'https://github.com' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: <TwitterIcon />, label: 'Twitter', href: 'https://twitter.com' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setStatus({
        type: 'success',
        message: data.message || "Message sent! I'll reply within 24 hours.",
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: 'background.default',
        borderTop: `1px solid ${BORDER_SUBTLE}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <SectionLabel>GET IN TOUCH</SectionLabel>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '2rem', md: '2.6rem' } }}
          >
            Let&apos;s{' '}
            <Box
              component="span"
              sx={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Work Together
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480 }}>
            Have a project in mind? Looking to hire a senior full-stack engineer?
            Drop me a message and I&apos;ll get back to you within 24 hours.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {/* Left — form */}
          <Box sx={{ width: { xs: '100%', md: '58%' } }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                bgcolor: BG_ELEVATED,
                border: `1px solid ${BORDER_SUBTLE}`,
                p: { xs: 3, md: 4 },
                borderRadius: 2,
              }}
            >
              {status.type && (
                <Alert
                  severity={status.type}
                  onClose={() => setStatus({ type: null, message: '' })}
                  sx={{
                    mb: 3,
                    bgcolor: status.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: status.type === 'success' ? '#10B981' : '#EF4444',
                    '& .MuiAlert-icon': { color: status.type === 'success' ? '#10B981' : '#EF4444' },
                  }}
                >
                  {status.message}
                </Alert>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      background: ORANGE_GRADIENT,
                      color: '#fff',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      fontSize: '0.78rem',
                      py: 1.6,
                      boxShadow: `0 0 25px rgba(232,114,21,0.3)`,
                      '&:hover': { boxShadow: `0 0 40px rgba(232,114,21,0.5)` },
                      '&.Mui-disabled': { opacity: 0.7, color: '#fff' },
                    }}
                  >
                    {loading ? 'SENDING MESSAGE...' : 'SEND MESSAGE'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right — info */}
          <Box sx={{ width: { xs: '100%', md: '42%' } }}>
            <Stack spacing={3}>
              {CONTACT_INFO.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2.5,
                    bgcolor: BG_ELEVATED,
                    border: `1px solid ${BORDER_SUBTLE}`,
                    borderRadius: 2,
                    '&:hover': { borderColor: BORDER_ORANGE },
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: 'rgba(232,114,21,0.1)',
                      border: `1px solid ${BORDER_ORANGE}`,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.secondary', fontSize: '0.62rem', letterSpacing: '0.14em', display: 'block' }}
                    >
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem', mt: 0.3 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Availability banner */}
              <Box
                sx={{
                  p: 2.5,
                  border: `1px solid ${BORDER_ORANGE}`,
                  bgcolor: 'rgba(232,114,21,0.06)',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#10B981',
                      animation: 'blink 1.4s ease-in-out infinite',
                      '@keyframes blink': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.3 },
                      },
                    }}
                  />
                  <Typography
                    variant="overline"
                    sx={{ color: '#10B981', fontSize: '0.65rem', letterSpacing: '0.14em' }}
                  >
                    AVAILABLE FOR WORK
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.85rem' }}>
                  Currently open to freelance projects and full-time opportunities. Response time under 24h.
                </Typography>
              </Box>

              {/* Socials */}
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', letterSpacing: '0.14em', fontSize: '0.62rem', mb: 1.5, display: 'block' }}
                >
                  FOLLOW ME
                </Typography>
                <Stack direction="row" spacing={1}>
                  {SOCIALS.map((s) => (
                    <IconButton
                      key={s.label}
                      component="a"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'text.secondary',
                        border: `1px solid ${BORDER_SUBTLE}`,
                        borderRadius: 1,
                        '&:hover': { color: ORANGE, borderColor: BORDER_ORANGE, bgcolor: 'rgba(232,114,21,0.06)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      {s.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
