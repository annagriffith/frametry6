// This file contains the global configuration for the Frametry6 chat app.
// It sets up error listeners and zone change detection for Angular.
// Use these comments to answer questions about app-wide settings and providers.
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
  // App configuration: Contains global settings for the chat app
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    
  ]
};
