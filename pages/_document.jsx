import { Html, Head, Main, NextScript } from 'next/document';

const MODE_STORAGE_KEY = 'rapidkit:landing-mode';

// Runs synchronously before React hydrates so non-MDX routes (landing,
// /preview/*) start in the user's stored dark/light mode. MDX routes get
// the same starting state here, then next-themes takes over after hydration.
const bootstrapMode = `(function(){try{var m=localStorage.getItem('${MODE_STORAGE_KEY}');if(m!=='dark'&&m!=='light')return;var r=document.documentElement;r.classList.toggle('dark',m==='dark');r.dataset.theme=m;r.dataset.colorMode=m;}catch(e){}})();`;

export default function Document() {
  return (
    <Html>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapMode }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
