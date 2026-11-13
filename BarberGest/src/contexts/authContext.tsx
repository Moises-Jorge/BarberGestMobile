
import { router } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";
const AUTH_STORAGE_KEY = "BarberGest:authState";

type AuthState = {
  isLoggedIn: boolean;
  isLoading: boolean;
  name: string;
  token: string | null;
  refreshToken: string | null;
  signIn: (
    accessToken: string,
    refreshToken: string,
    name: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  apiFetch: (
    endpoint: string,
    options?: RequestInit
  ) => Promise<Response>;
};

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Impede várias renovações simultâneas
  const refreshPromise = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    async function loadAuthState() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);

          if (parsed.accessToken) {
            setToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken ?? null);
            setName(parsed.name ?? "");
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Erro ao recuperar autenticação:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthState();
  }, []);

  async function signIn(
    accessToken: string,
    newRefreshToken: string,
    newName: string
  ) {
    const authData = {
      accessToken,
      refreshToken: newRefreshToken,
      name: newName,
    };

    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(authData)
    );

    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setName(newName);
    setIsLoggedIn(true);

    router.replace("/");
  }

  async function signOut() {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

    setToken(null);
    setRefreshToken(null);
    setName("");
    setIsLoggedIn(false);

    router.replace("/signIn");
  }

  async function deleteAccount() {
    await signOut();
  }

  // Renova os dois tokens
  async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    if (!refreshToken) {
      await signOut();
      return null;
    }

    const promise = (async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ refreshToken }),
        });

        const text = await response.text();
        console.log("Renovação:", response.status, text);

        if (!response.ok) {
          await signOut();
          return null;
        }

        const data = JSON.parse(text);

        if (!data.accessToken || !data.refreshToken) {
          throw new Error("A API não devolveu os dois tokens.");
        }

        const authData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          name,
        };

        await AsyncStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(authData)
        );

        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        return data.accessToken as string;
      } catch (error) {
        console.error("Erro ao renovar tokens:", error);
        return null;
      }
    })();

    refreshPromise.current = promise;

    try {
      return await promise;
    } finally {
      refreshPromise.current = null;
    }
  }

  // Faz o pedido e tenta novamente se o access token expirou
  async function apiFetch(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = new Headers(options.headers);

    headers.set("ngrok-skip-browser-warning", "true");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Não tenta renovar em pedidos de login ou refresh
    if (
      response.status !== 401 ||
      endpoint.includes("/api/auth/refresh") ||
      endpoint.includes("/api/auth/login/")
    ) {
      return response;
    }

    const newToken = await refreshAccessToken();

    if (!newToken) {
      return response;
    }

    const retryHeaders = new Headers(options.headers);
    retryHeaders.set("ngrok-skip-browser-warning", "true");
    retryHeaders.set("Authorization", `Bearer ${newToken}`);

    return fetch(endpoint, {
      ...options,
      headers: retryHeaders,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        name,
        token,
        refreshToken,
        signIn,
        signOut,
        deleteAccount,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
