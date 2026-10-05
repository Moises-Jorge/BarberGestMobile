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
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style = {styles.formContainer}>
              <View style={styles.inputContainer}>
                  <Text style={styles.title2}>Inicie sessão</Text>
                  <TextInput style={styles.input} onChangeText={setName} placeholder="Nome"  placeholderTextColor="white"/>
                  <TextInput style={styles.input} onChangeText={setPassword} placeholder="Senha" placeholderTextColor="white" secureTextEntry/>
                  <Pressable style={styles.entrarButton} onPress={() => {
                      signIn(name);
                  }}>
                      <Text>Entrar</Text>
                  </Pressable>
              </View>
              <Text style={styles.title3}>Ainda não tens uma conta? <Text onPress={() => routes.navigate("/signIn")} style={styles.link}>Cria uma!</Text></Text>
          </KeyboardAvoidingView>
      </ScrollView>
      </SafeAreaView>
    )
}
