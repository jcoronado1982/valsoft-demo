export const environment = {
  production: false,
  apiUrl: 'http://localhost:5092/api',
  otel: {
    serviceName: 'frontend-angular',
    propagateTraceHeaderCorsUrls: [
      'http://localhost:5092',
      'http://localhost:8000'
    ]
  }
};
