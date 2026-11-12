
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";
const AUTH_STORAGE_KEY = "BarberGest:authState";

type AuthData = {
    accessToken: string;
    refreshToken: string;
    name: string;
};

let refreshPromise: Promise<string | null> | null = null;

// Renovar os tokens
const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

            if (!storedAuth) return null;

            const auth: AuthData = JSON.parse(storedAuth);

            const response = await fetch(`${API_URL}/api/auth/refresh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({
                    refreshToken: auth.refreshToken,
                }),
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 400) {
                    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
                }

                return null;
            }

            const data = await response.json();

            if (!data.accessToken || !data.refreshToken)
            {
                return null;
            }

            const newAuth: AuthData = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                name: auth.name,
            };

            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify(newAuth)
            );

            return data.accessToken as string;
        } catch (error) {
            console.error("Erro ao renovar token:", error);
            return null;
        }
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
};

// Função principal para fazer pedidos
export const apiFetch = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

    const auth: AuthData | null = storedAuth
        ? JSON.parse(storedAuth)
        : null;

    const makeHeaders = (accessToken?: string) => {
        const headers = new Headers(options.headers);

        headers.set("ngrok-skip-browser-warning", "true");

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    };

    // Primeiro pedido
    let response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: makeHeaders(auth?.accessToken),
    });

    // Se não houver token expirado, devolve a resposta
    if (response.status !== 401) {
        return response;
    }

    // Tentar renovar o token
    const newToken = await refreshAccessToken();

    if (!newToken) {
        return response;
    }

    // Repetir o pedido com o novo token
    response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: makeHeaders(newToken),
    });

    return response;
};
