import { e as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_DxclfMW8.mjs';
import 'piccolore';
import 'clsx';

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-black border-t border-white/10 pt-16 pb-8"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"> <!-- Brand --> <div class="col-span-1 md:col-span-1"> <span class="text-2xl font-bold tracking-tight text-white mb-4 block"> <span class="text-primary-400">Z</span>VENIA
</span> <p class="text-gray-400 text-sm leading-relaxed">
The leading professional community for the mining industry. Connect, learn, and grow with experts worldwide.
</p> </div> <!-- Links Column 1 --> <div> <h3 class="text-white font-semibold mb-4">Platform</h3> <ul class="space-y-3 text-sm text-gray-400"> <li><a href="/talks" class="hover:text-primary-400 transition-colors">Z-Talks</a></li> <li><a href="/podcasts" class="hover:text-primary-400 transition-colors">Podcasts</a></li> <li><a href="/events" class="hover:text-primary-400 transition-colors">Events</a></li> <li><a href="/services" class="hover:text-primary-400 transition-colors">Directory</a></li> </ul> </div> <!-- Links Column 2 --> <div> <h3 class="text-white font-semibold mb-4">Community</h3> <ul class="space-y-3 text-sm text-gray-400"> <li><a href="/about" class="hover:text-primary-400 transition-colors">About Us</a></li> <li><a href="/join" class="hover:text-primary-400 transition-colors">Membership</a></li> <li><a href="/contact" class="hover:text-primary-400 transition-colors">Contact</a></li> </ul> </div> <!-- Links Column 3 (Legal) --> <div> <h3 class="text-white font-semibold mb-4">Legal</h3> <ul class="space-y-3 text-sm text-gray-400"> <li><a href="/privacy" class="hover:text-primary-400 transition-colors">Privacy</a></li> <li><a href="/terms" class="hover:text-primary-400 transition-colors">Terms</a></li> </ul> </div> </div> <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"> <p class="text-gray-500 text-sm">
&copy; ${currentYear} Zvenia. All rights reserved.
</p> <div class="flex gap-4"> <!-- Social Icons Placeholders --> <a href="#" class="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg> </a> </div> </div> </div> </footer>`;
}, "D:/zvenia/astro-frontend/src/components/Footer.astro", void 0);

export { $$Footer as $ };
