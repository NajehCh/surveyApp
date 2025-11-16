import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { provideServerRendering } from '@angular/ssr';

const bootstrap = () =>
  bootstrapApplication(App, {
    ...config,
    providers: [
      ...config.providers!,
    ]
  });

export default bootstrap;
