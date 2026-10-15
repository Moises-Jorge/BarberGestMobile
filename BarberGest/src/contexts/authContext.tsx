import { router } from "expo-router";
import { createContext, PropsWithChildren, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
  isLoggedIn: boolean;
  isLoading: boolean;
  name: string;
  signIn: (newName: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "BarberGest:authState";

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // começa false
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    async function loadAuthState() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsLoggedIn(!!parsed.isLoggedIn);
          setName(parsed.name ?? "");
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        setIsLoggedIn(false); // em caso de erro, NÃO logado
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthState();
  }, []);

  async function signIn(newName: string) {
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isLoggedIn: true, name: newName })
      );
    } catch (error) {
      console.error("Error storing auth state:", error);
    }
    setName(newName);
    setIsLoggedIn(true);
    router.replace("/");
  }

  async function signOut() {
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isLoggedIn: false, name: "" })
      );
    } catch (error) {
      console.error("Error storing auth state:", error);
    }
    setName("");
    setIsLoggedIn(false);
    router.replace("/signIn");
  }

  async function deleteAccount() {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY); 
    } catch (error) {
      console.error("Error deleting account:", error);
    }
    setName("");
    setIsLoggedIn(false);
    router.replace("/signIn");
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, name, signIn, signOut, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}