import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../auth/auth.service';
import { signal } from '@angular/core';

const meta: Meta<DashboardComponent> = {
  title: 'App/Dashboard',
  component: DashboardComponent,
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }),
    moduleMetadata({
      imports: [CommonModule, FormsModule, DashboardComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: signal(true),
            user: signal({ name: 'User Test', email: 'test@example.com' }),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DashboardComponent>;

export const Default: Story = {};
