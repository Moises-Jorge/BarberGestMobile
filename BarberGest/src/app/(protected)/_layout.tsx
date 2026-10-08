import {Redirect, Stack, usePathname} from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { ActivityIndicator, View } from "react-native";
import Footer from "@/components/footer/footer";

export default function ProtectedLayout() {
	const { isLoggedIn, isLoading } = useAuth();

	const HIDE_FOOTER_ON = ["/services"];

	const pathname = usePathname();
	//const showFooter = !HIDE_FOOTER_ON.includes(pathname);

	if (isLoading)
	{
		return(
			<ActivityIndicator
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			/>
		)
	}
	if (!isLoggedIn) {
		return <Redirect href = "/signIn" />
	}
	 return (
		<View style={{ flex: 1 }}>
		<Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: "none" }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="agenda" />
			<Stack.Screen name="profile" />
			<Stack.Screen name="settings" />
		</Stack>
		<Footer />
		</View>
	);
	}