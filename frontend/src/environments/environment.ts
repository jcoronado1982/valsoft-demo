export const environment = {
  production: false,
  apiUrl: 'http://localhost:5092/api',
  otel: {
    serviceName: 'frontend-angular',
    propagateTraceHeaderCorsUrls: [
      'http://localhost:5092', // C# Backend
      'http://localhost:8000'  // Python AI Worker
    ]
  }
};
