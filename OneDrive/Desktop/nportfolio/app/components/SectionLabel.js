import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ORANGE } from '../theme';

export default function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{
        color: ORANGE,
        letterSpacing: '0.22em',
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '0.68rem',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
      }}
    >
      <Box sx={{ width: 24, height: 1, bgcolor: ORANGE }} />
      {children}
    </Typography>
  );
}

