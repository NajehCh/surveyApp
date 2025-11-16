import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

export async function getPrerenderParams() {
  return []; // pas de routes dynamiques
}

const bootstrap = async () => {
  const routes = await getPrerenderParams();

  return bootstrapApplication(App, {
    ...config,
    providers: [
      ...config.providers,
      { provide: 'PRERENDER_ROUTES', useValue: routes },
    ],
  });
};

export default bootstrap;
