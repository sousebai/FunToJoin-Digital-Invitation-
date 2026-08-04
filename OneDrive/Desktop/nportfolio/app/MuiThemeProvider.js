'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import theme from './theme';

export default function MuiThemeProvider({ children }) {
  const [{ cache }] = useState(() => {
    const emotionCache = createCache({ key: 'mui' });
    emotionCache.compat = true;
    return { cache: emotionCache };
  });

  useServerInsertedHTML(() => {
    const styles = Object.values(cache.inserted).join('');

    if (!styles) {
      return null;
    }

    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
