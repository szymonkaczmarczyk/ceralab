import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import {
  renderCritical,
  renderCursor,
  renderFooter,
  renderNav,
  renderRobots,
  renderSeo,
  renderSitemap,
  renderSprite,
} from './src/components/layout.ts';
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
    seo: (arg) => renderSeo(arg === 'privacy' ? 'privacy' : 'home'),
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

function decodePath(url: string): string | null {
  try {
    return decodeURIComponent(url);
  } catch {
    return null;
  }
}

function notFoundPage(): Plugin {
  const handler = (root: string, transform: (url: string, html: string) => Promise<string> | string) =>
    async (
      req: { url?: string; method?: string; headers: Record<string, string | string[] | undefined> },
      res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void },
      next: (error?: unknown) => void,
    ) => {
      try {
        const url = (req.url ?? '/').split('?')[0];
        const wantsHtml = String(req.headers.accept ?? '').includes('text/html');
        if (req.method !== 'GET' || !wantsHtml) return next();
        const decodedPath = decodePath(url);
        if (decodedPath?.endsWith('.html') && existsSync(join(root, decodedPath))) return next();
        const html = await transform(url, readFileSync(join(root, '404.html'), 'utf8'));
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
      } catch (error) {
        next(error);
      }
    };
  return {
    name: 'ceralab-404',
    configureServer(server) {
      return () => server.middlewares.use(handler(server.config.root, (url, html) => server.transformIndexHtml(url, html)));
    },
    configurePreviewServer(server) {
      const dist = resolve(server.config.root, server.config.build.outDir);
      return () => server.middlewares.use(handler(dist, (_url, html) => html));
    },
  };
}

function seoFiles(): Plugin {
  const files: Record<string, { type: string; render: () => string }> = {
    '/robots.txt': { type: 'text/plain; charset=utf-8', render: renderRobots },
    '/sitemap.xml': { type: 'application/xml; charset=utf-8', render: renderSitemap },
  };
  return {
    name: 'ceralab-seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[(req.url ?? '').split('?')[0]];
        if (!file) return next();
        res.setHeader('Content-Type', file.type);
        res.end(file.render());
      });
    },
    generateBundle() {
      for (const [path, file] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName: path.slice(1), source: file.render() });
      }
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [staticSections(), notFoundPage(), seoFiles()],
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
