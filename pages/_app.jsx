import 'nextra-theme-docs/style.css';
import '../src/styles.css';
import '../docs-nextra/styles/docs.css';
import '../docs-nextra/components/ComponentExampleTabs.css';
import '../docs-nextra/components/ThemePlayground.css';
import { ThemeRuntime } from '../docs-nextra/components/ThemeRuntime';

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeRuntime />
      <Component {...pageProps} />
    </>
  );
}
