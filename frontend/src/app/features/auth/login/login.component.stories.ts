import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

const meta: Meta<LoginComponent> = {
  title: 'Auth/Login',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LoginComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            handleGoogleLogin: () => of({}),
            isAuthenticated: signal(false),
            user: signal(null),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LoginComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
  }),
};

export const Loading: Story = {
  render: (args) => ({
    props: args,
  }),
  play: async () => {
    // We can use the play function to set the signal state if needed
    // or just mock it in the component if we had control over the signals via props
  },
};
