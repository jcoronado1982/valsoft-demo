import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { environment } from '../../environments/environment';

export function initializeTelemetry() {
  try {
    const provider = new WebTracerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: environment.otel.serviceName,
      })
    });

    // Registrar el procesador de consola para depuración
    (provider as any).addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

    // En una app Zoneless, no usamos ZoneContextManager ya que zone.js no está presente.
    // El provider se registra con el context manager por defecto si no se especifica uno.
    provider.register();

    // Convertimos las URLs del ambiente en patrones Regex para la propagación de encabezados
    const propagateTraceHeaderCorsUrls = environment.otel.propagateTraceHeaderCorsUrls.map(
      url => new RegExp(`${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`)
    );

    registerInstrumentations({
      instrumentations: [
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls,
        }),
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls,
        }),
      ],
    });
    
    // Telemetry initialized

  } catch (error) {
    // Si falla la telemetría, no bloqueamos el arranque de la aplicación
    console.error('OpenTelemetry failed to initialize, but continuing bootstrap:', error);
  }
}
