import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CuDtWDbN.mjs';
import { manifest } from './manifest_D5wF5bUN.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/login.astro.mjs');
const _page3 = () => import('./pages/admin/posts/create.astro.mjs');
const _page4 = () => import('./pages/admin/posts/edit/_id_.astro.mjs');
const _page5 = () => import('./pages/admin/posts.astro.mjs');
const _page6 = () => import('./pages/admin/users/create.astro.mjs');
const _page7 = () => import('./pages/admin/users.astro.mjs');
const _page8 = () => import('./pages/admin.astro.mjs');
const _page9 = () => import('./pages/api/admin/users/action.astro.mjs');
const _page10 = () => import('./pages/api/auth/callback.astro.mjs');
const _page11 = () => import('./pages/api/auth/forgot-password.astro.mjs');
const _page12 = () => import('./pages/api/auth/logout.astro.mjs');
const _page13 = () => import('./pages/api/auth/send-migration-email.astro.mjs');
const _page14 = () => import('./pages/api/auth/signin.astro.mjs');
const _page15 = () => import('./pages/api/auth/signout.astro.mjs');
const _page16 = () => import('./pages/api/auth/signup.astro.mjs');
const _page17 = () => import('./pages/api/content/create.astro.mjs');
const _page18 = () => import('./pages/api/content/delete.astro.mjs');
const _page19 = () => import('./pages/api/content/update.astro.mjs');
const _page20 = () => import('./pages/api/countries.astro.mjs');
const _page21 = () => import('./pages/api/pdf-proxy.astro.mjs');
const _page22 = () => import('./pages/api/profile/update.astro.mjs');
const _page23 = () => import('./pages/api/upload.astro.mjs');
const _page24 = () => import('./pages/api/users.astro.mjs');
const _page25 = () => import('./pages/dashboard/create.astro.mjs');
const _page26 = () => import('./pages/dashboard/events/edit/_id_.astro.mjs');
const _page27 = () => import('./pages/dashboard/podcasts/edit/_id_.astro.mjs');
const _page28 = () => import('./pages/dashboard/posts/edit/_id_.astro.mjs');
const _page29 = () => import('./pages/dashboard/profile/edit.astro.mjs');
const _page30 = () => import('./pages/dashboard/profile.astro.mjs');
const _page31 = () => import('./pages/dashboard/services/edit/_id_.astro.mjs');
const _page32 = () => import('./pages/event/_slug_.astro.mjs');
const _page33 = () => import('./pages/forgot-password.astro.mjs');
const _page34 = () => import('./pages/in/_id_.astro.mjs');
const _page35 = () => import('./pages/join.astro.mjs');
const _page36 = () => import('./pages/landing.astro.mjs');
const _page37 = () => import('./pages/login.astro.mjs');
const _page38 = () => import('./pages/mining/_slug_.astro.mjs');
const _page39 = () => import('./pages/my-zvenia.astro.mjs');
const _page40 = () => import('./pages/partials/posts-partial.astro.mjs');
const _page41 = () => import('./pages/podcast/_slug_.astro.mjs');
const _page42 = () => import('./pages/post/_slug_.astro.mjs');
const _page43 = () => import('./pages/profile/_slug_/zv-user.astro.mjs');
const _page44 = () => import('./pages/profile/_slug_.astro.mjs');
const _page45 = () => import('./pages/profile.astro.mjs');
const _page46 = () => import('./pages/reset-password.astro.mjs');
const _page47 = () => import('./pages/service/_slug_.astro.mjs');
const _page48 = () => import('./pages/verification-success.astro.mjs');
const _page49 = () => import('./pages/verify-email.astro.mjs');
const _page50 = () => import('./pages/z-network.astro.mjs');
const _page51 = () => import('./pages/z-talks/_slug_.astro.mjs');
const _page52 = () => import('./pages/z-talks.astro.mjs');
const _page53 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/login.astro", _page2],
    ["src/pages/admin/posts/create.astro", _page3],
    ["src/pages/admin/posts/edit/[id].astro", _page4],
    ["src/pages/admin/posts/index.astro", _page5],
    ["src/pages/admin/users/create.astro", _page6],
    ["src/pages/admin/users.astro", _page7],
    ["src/pages/admin/index.astro", _page8],
    ["src/pages/api/admin/users/action.ts", _page9],
    ["src/pages/api/auth/callback.ts", _page10],
    ["src/pages/api/auth/forgot-password.ts", _page11],
    ["src/pages/api/auth/logout.ts", _page12],
    ["src/pages/api/auth/send-migration-email.ts", _page13],
    ["src/pages/api/auth/signin.ts", _page14],
    ["src/pages/api/auth/signout.ts", _page15],
    ["src/pages/api/auth/signup.ts", _page16],
    ["src/pages/api/content/create.ts", _page17],
    ["src/pages/api/content/delete.ts", _page18],
    ["src/pages/api/content/update.ts", _page19],
    ["src/pages/api/countries.ts", _page20],
    ["src/pages/api/pdf-proxy.ts", _page21],
    ["src/pages/api/profile/update.ts", _page22],
    ["src/pages/api/upload.ts", _page23],
    ["src/pages/api/users.ts", _page24],
    ["src/pages/dashboard/create.astro", _page25],
    ["src/pages/dashboard/events/edit/[id].astro", _page26],
    ["src/pages/dashboard/podcasts/edit/[id].astro", _page27],
    ["src/pages/dashboard/posts/edit/[id].astro", _page28],
    ["src/pages/dashboard/profile/edit.astro", _page29],
    ["src/pages/dashboard/profile.astro", _page30],
    ["src/pages/dashboard/services/edit/[id].astro", _page31],
    ["src/pages/event/[slug].astro", _page32],
    ["src/pages/forgot-password.astro", _page33],
    ["src/pages/in/[id].astro", _page34],
    ["src/pages/join.astro", _page35],
    ["src/pages/landing.astro", _page36],
    ["src/pages/login.astro", _page37],
    ["src/pages/mining/[slug].astro", _page38],
    ["src/pages/my-zvenia.astro", _page39],
    ["src/pages/partials/posts-partial.astro", _page40],
    ["src/pages/podcast/[slug].astro", _page41],
    ["src/pages/post/[slug].astro", _page42],
    ["src/pages/profile/[slug]/zv-user.astro", _page43],
    ["src/pages/profile/[slug]/index.astro", _page44],
    ["src/pages/profile.astro", _page45],
    ["src/pages/reset-password.astro", _page46],
    ["src/pages/service/[slug].astro", _page47],
    ["src/pages/verification-success.astro", _page48],
    ["src/pages/verify-email.astro", _page49],
    ["src/pages/z-network/index.astro", _page50],
    ["src/pages/z-talks/[slug].astro", _page51],
    ["src/pages/z-talks/index.astro", _page52],
    ["src/pages/index.astro", _page53]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "689d6417-ccf4-4d96-8b50-0738045a9c01",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
