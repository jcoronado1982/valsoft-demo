export const environment = {
  production: true,
  apiUrl: '/api',
  otel: {
    serviceName: 'frontend-angular',
    propagateTraceHeaderCorsUrls: [
      'https://launch.lat'
    ]
  }
};
