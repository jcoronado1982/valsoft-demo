import { initializeTelemetry } from './app/core/telemetry.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

initializeTelemetry();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
