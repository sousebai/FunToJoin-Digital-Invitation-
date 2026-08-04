import './globals.css';
import MuiThemeProvider from './MuiThemeProvider';

// Roboto font (required by MUI)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const metadata = {
  title: 'MA. RZEIGUI | Full-Stack Engineer',
  description:
    'Senior Full-Stack JS & MERN stack engineer. Building scalable systems, clean code, and end-to-end digital products that ship.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  );
}

