import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnStableCurvedLoopMarquee } from "../components/organisms/curved-marquee";
import { styles } from "../styles";


export default function SignIn() {
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const routes = useRouter();

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
		<View style={{flexDirection: "row", alignSelf: "center", marginTop: 80}}>
			<Text style={{color: "white", fontSize: 30, fontWeight: "bold"}}>Barber</Text>
			<Text style={{color: "cyan", fontSize: 30, fontWeight: "bold"}}>Gest</Text>
    	</View>
           <UnStableCurvedLoopMarquee text="💈 A sua barbearia em suas mãos ✂️" fontSize={90} curve={150}/>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.inputContainer}>
            	<Text style={styles.title2}>crie a sua conta!</Text>
            	<TextInput style={styles.input} placeholder="Nome" onChangeText={setName} placeholderTextColor="white"/>
            	<TextInput style={styles.input} placeholder="Telefone" onChangeText={setPhone} placeholderTextColor="white" keyboardType="numeric"/>
            	<TextInput style={styles.input} placeholder="Senha" onChangeText={setPassword} placeholderTextColor="white" secureTextEntry/>
            	<Pressable style={styles.entrarButton} onPress={() => {
                      signIn(name);
                  }}>
                	<Text>Cria conta</Text>
              	</Pressable>
            </View>
			<Text style={styles.title3}>Já tens uma conta? <Text onPress={() => routes.navigate("/logIn")} style={styles.link}>Faça login</Text></Text>
        </KeyboardAvoidingView>
        </ScrollView>
    </SafeAreaView>
  )
}
