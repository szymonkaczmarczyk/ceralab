import { bootCommon, fontsReady, markReady } from './common';
import './styles/sections/hero.css';
import './styles/sections/products.css';
import './styles/sections/process.css';
import './styles/sections/contact.css';

import { ScrollTrigger, scrollToElement } from './animations/setup';
import { runPreloader } from './animations/preloader';
import { initHero, playHeroIntro, prepareHeroIntro } from './animations/hero';
import { initProducts } from './animations/products';
import { initProcess } from './animations/process';
import { initContact } from './animations/contact';

async function boot() {

  const hashTarget = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const preloader = runPreloader(fontsReady);
  await fontsReady;

  const lenis = bootCommon();
  lenis?.stop();
  initHero();
  prepareHeroIntro();
  initProducts();
  initProcess();
  initContact();
  ScrollTrigger.refresh();
  markReady();

  await preloader;
  lenis?.start();
  playHeroIntro();
  if (hashTarget) scrollToElement(hashTarget);
}

void boot();
