import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { renderCritical, renderCursor, renderFooter, renderNav, renderSprite } from './src/components/layout.ts';
import {
  renderArches,
  renderMiniArches,
  renderPolicy,
  renderPolicyMeta,
  renderPolicySummary,
  renderPolicyToc,
  renderProcess,
  renderProducts,
  renderProgress,
} from './src/components/templates.ts';

function staticSections(): Plugin {
  const slots: Record<string, (arg?: string) => string> = {
    critical: renderCritical,
    sprite: renderSprite,
    nav: (arg) => renderNav(arg === 'home' ? 'home' : 'sub'),
    footer: renderFooter,
    cursor: renderCursor,
    arches: renderArches,
    progress: renderProgress,
    products: renderProducts,
    process: renderProcess,
    'policy-summary': renderPolicySummary,
    'policy-toc': renderPolicyToc,
    policy: renderPolicy,
    'policy-meta': renderPolicyMeta,
    'nf-arches': renderMiniArches,
  };
  return {
    name: 'ceralab-static-sections',
    transformIndexHtml(html) {
      return html.replace(/<!--\s*slot:([\w-]+)(?::([\w-]+))?\s*-->/g, (match, name: string, arg?: string) =>
        slots[name] ? slots[name](arg) : match,
      );
    },
  };
}

function notFoundPage(): Plugin {
  const handler = (root: string, transform: (url: string, html: string) => Promise<string> | string) =>
    async (req: { url?: string; method?: string; headers: Record<string, string | string[] | undefined> }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }, next: () => void) => {
      const url = (req.url ?? '/').split('?')[0];
      const wantsHtml = String(req.headers.accept ?? '').includes('text/html');
      if (req.method !== 'GET' || !wantsHtml) return next();
      if (url.endsWith('.html') && existsSync(join(root, decodeURIComponent(url)))) return next();
      const html = await transform(url, readFileSync(join(root, '404.html'), 'utf8'));
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    };
  return {
    name: 'ceralab-404',
    configureServer(server) {
      return () => server.middlewares.use(handler(server.config.root, (url, html) => server.transformIndexHtml(url, html)));
    },
    configurePreviewServer(server) {
      const dist = join(server.config.root, server.config.build.outDir);
      return () => server.middlewares.use(handler(dist, (_url, html) => html));
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [staticSections(), notFoundPage()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'polityka-prywatnosci/index.html',
        notFound: '404.html',
      },
    },
  },
});
