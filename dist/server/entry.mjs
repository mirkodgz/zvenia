import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvlzW-0q.mjs';
import { manifest } from './manifest_DvUXbpqb.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/users.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/auth/callback.astro.mjs');
const _page4 = () => import('./pages/api/auth/signin.astro.mjs');
const _page5 = () => import('./pages/api/auth/signout.astro.mjs');
const _page6 = () => import('./pages/api/auth/signup.astro.mjs');
const _page7 = () => import('./pages/api/content/create.astro.mjs');
const _page8 = () => import('./pages/api/content/delete.astro.mjs');
const _page9 = () => import('./pages/api/content/update.astro.mjs');
const _page10 = () => import('./pages/api/pdf-proxy.astro.mjs');
const _page11 = () => import('./pages/api/upload.astro.mjs');
const _page12 = () => import('./pages/dashboard/create.astro.mjs');
const _page13 = () => import('./pages/event/edit/_id_.astro.mjs');
const _page14 = () => import('./pages/event/_slug_.astro.mjs');
const _page15 = () => import('./pages/in/_id_.astro.mjs');
const _page16 = () => import('./pages/join.astro.mjs');
const _page17 = () => import('./pages/landing.astro.mjs');
const _page18 = () => import('./pages/login.astro.mjs');
const _page19 = () => import('./pages/mining/_slug_.astro.mjs');
const _page20 = () => import('./pages/partials/posts-partial.astro.mjs');
const _page21 = () => import('./pages/podcast/edit/_id_.astro.mjs');
const _page22 = () => import('./pages/podcast/_slug_.astro.mjs');
const _page23 = () => import('./pages/post/edit/_id_.astro.mjs');
const _page24 = () => import('./pages/post/_slug_.astro.mjs');
const _page25 = () => import('./pages/profile.astro.mjs');
const _page26 = () => import('./pages/service/edit/_id_.astro.mjs');
const _page27 = () => import('./pages/service/_slug_.astro.mjs');
const _page28 = () => import('./pages/settings.astro.mjs');
const _page29 = () => import('./pages/verification-success.astro.mjs');
const _page30 = () => import('./pages/verify-email.astro.mjs');
const _page31 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin/users.astro", _page1],
    ["src/pages/admin/index.astro", _page2],
    ["src/pages/api/auth/callback.ts", _page3],
    ["src/pages/api/auth/signin.ts", _page4],
    ["src/pages/api/auth/signout.ts", _page5],
    ["src/pages/api/auth/signup.ts", _page6],
    ["src/pages/api/content/create.ts", _page7],
    ["src/pages/api/content/delete.ts", _page8],
    ["src/pages/api/content/update.ts", _page9],
    ["src/pages/api/pdf-proxy.ts", _page10],
    ["src/pages/api/upload.ts", _page11],
    ["src/pages/dashboard/create.astro", _page12],
    ["src/pages/event/edit/[id].astro", _page13],
    ["src/pages/event/[slug].astro", _page14],
    ["src/pages/in/[id].astro", _page15],
    ["src/pages/join.astro", _page16],
    ["src/pages/landing.astro", _page17],
    ["src/pages/login.astro", _page18],
    ["src/pages/mining/[slug].astro", _page19],
    ["src/pages/partials/posts-partial.astro", _page20],
    ["src/pages/podcast/edit/[id].astro", _page21],
    ["src/pages/podcast/[slug].astro", _page22],
    ["src/pages/post/edit/[id].astro", _page23],
    ["src/pages/post/[slug].astro", _page24],
    ["src/pages/profile.astro", _page25],
    ["src/pages/service/edit/[id].astro", _page26],
    ["src/pages/service/[slug].astro", _page27],
    ["src/pages/settings.astro", _page28],
    ["src/pages/verification-success.astro", _page29],
    ["src/pages/verify-email.astro", _page30],
    ["src/pages/index.astro", _page31]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///D:/zvenia/astro-frontend/dist/client/",
    "server": "file:///D:/zvenia/astro-frontend/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
