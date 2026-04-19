export const environment = {
  production: true,
  apiUrl: 'https://api.tu-dominio-produccion.com/api',
  otel: {
    serviceName: 'frontend-angular',
    propagateTraceHeaderCorsUrls: [
      'https://api.tu-dominio-produccion.com'
    ]
  }
};
