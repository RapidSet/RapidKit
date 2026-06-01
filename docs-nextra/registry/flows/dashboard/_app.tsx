// Wire RapidKit's base styles and a theme in your app's root entry file.
// In a Next.js Pages-router app, that's `pages/_app.tsx`; in the App router,
// it's `app/layout.tsx`; in Vite/CRA, your top-level `main.tsx`.
import type { AppProps } from 'next/app';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
