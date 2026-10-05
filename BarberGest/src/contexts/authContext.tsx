import { router } from "expo-router";
import { createContext, PropsWithChildren, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
	isLoggedIn: boolean;
    isLoading: boolean;
    name: string;
    signIn: (newName: string) => void;
    signOut: () => void;
};

const AUTH_STORAGE_KEY = "BarberGest:authState";

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");

    useEffect(() => {
        async function loadStoredAuth() {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
            setName(storedName);
            setIsLoggedIn(true);
        }
        setIsLoading(false);
        }
        loadStoredAuth();
    }, []);

    async function storageAuthState(newState: { isLoggedIn: boolean}) {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
        }
        catch (error) {
            console.error("Error storing auth state:", error);
        }
    }
    async function signIn(newName: string) {
        await AsyncStorage.setItem("userName", newName);
        setName(newName);
        setIsLoggedIn(true);
        storageAuthState({ isLoggedIn: true });
        router.replace("/");
    };

    async function signOut() {
        await AsyncStorage.removeItem("userName");
        setName("");
        setIsLoggedIn(false);
        storageAuthState({ isLoggedIn: false });
        router.replace("/signIn");
    };
    useEffect(() => {
        async function loadAuthState()
        {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a delay for loading
                const storedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    setIsLoggedIn(parsedState.isLoggedIn);
                   // console.log("Auth state loaded from storage:", parsedState);
                }
            }
            catch (error) {
                console.error("Error loading auth state:", error);
                setIsLoggedIn(true); // Default to logged in if there's an error
            }
            finally {
                setIsLoading(false);
            }
        }
        loadAuthState();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, name, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
