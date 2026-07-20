import { InjectionToken } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  socketUrl:string;

}

export const APP_CONFIG = new InjectionToken<AppConfig>('Application Configuration');
