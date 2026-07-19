import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			// 30 segundos antes de considerar la data como "vieja" y hacer un nuevo fetch.
			// Reduce refetches innecesarios al navegar entre páginas.
			staleTime: 30_000,
			// 5 minutos antes de limpiar la entrada del cache si no hay observers.
			gcTime: 5 * 60_000,
		},
		mutations: {
			onError: (error) => {
				// Centraliza el logging de errores de mutación.
				// Acá se puede conectar Sentry, LogRocket u otro servicio de observabilidad.
				console.error('[QueryClient] Mutation error:', error?.message ?? error);
			},
		},
	},
});