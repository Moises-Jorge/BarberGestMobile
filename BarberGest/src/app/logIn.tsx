import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnStableCurvedLoopMarquee } from "../components/organisms/curved-marquee";
import { styles } from "../styles";
import { RFValue } from "react-native-responsive-fontsize";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function SignIn() {
    const { signIn } = useAuth();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(true);
    const routes = useRouter();
    const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const validate = () => {
    const newErrors: { name?: string; password?: string } = {};
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        newErrors.name = "O nome deve ter pelo menos 2 caracteres";
    } else if (trimmedName.length > 50) {
        newErrors.name = "O nome deve ter no máximo 50 caracteres";
    } else if (!/^[\p{L}\s'-]+$/u.test(trimmedName)) {
        newErrors.name = "O nome contém caracteres inválidos";
    }

    if (password.length < 8) {
        newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    } else if (password.length > 64) {
        newErrors.password = "A senha é demasiado longa";
    } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "A senha deve ter uma letra maiúscula";
    } else if (!/[a-z]/.test(password)) {
        newErrors.password = "A senha deve ter uma letra minúscula";
    }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const entrar = async () => {
    setLoading(true);
    setMensagem('');
    try {
        const response = await fetch(`${url}/api/clientes/login`, { // confirma a rota no backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
            nome: name.trim(),
            senha: password,
        }),
        });
        const text = await response.text();
        console.log(response.status, text);

        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }
        if (!response.ok) {
        throw new Error(data?.message || `Erro ${response.status}`);
        }

        return data; // normalmente traz o utilizador e/ou um token
    } catch (error) {
        setMensagem(error instanceof Error ? error.message : 'Erro inesperado');
        return null;
    } finally {
        setLoading(false);
    }
    };

    const handleLogin = async () => {
    if (!name.trim() || !password) {
        setMensagem('Preenche o nome e a senha');
        return;
    }
    const data = await entrar();
    if (data) {
        signIn(name.trim());
    }
    };
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
                  <Text style={[styles.title2, {fontSize: RFValue(20)}]}>Inicie sessão</Text>
                  <TextInput style={styles.input} onChangeText={(t) =>{
                    setName(t);
                    if (errors.name) {
                        setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                    }}
                    } placeholder="Nome" onChange={() => setOk(true)} placeholderTextColor="white"/>
                    {errors.name && <Text style={{color: "red", fontSize: RFValue(12), textAlign: "center"}}>{errors.name}</Text>}
                  <TextInput style={styles.input} onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) {
                        setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
                    }
                  }} placeholder="Senha" onChange={() => setOk(true)} placeholderTextColor="white" secureTextEntry/>
                    {errors.password && <Text style={{color: "red", fontSize: RFValue(12), textAlign: "center"}}>{errors.password}</Text>}
                  <TouchableOpacity style={styles.entrarButton} onPress={handleLogin} disabled={loading}>
                      <Text>{ loading ? "Entrando..." : "Entrar"}</Text>
                  </TouchableOpacity>
              </View>
              <Text style={styles.title3}>Ainda não tens uma conta? <Text onPress={() => routes.navigate("/signIn")} style={styles.link}>Cria uma!</Text></Text>
          </KeyboardAvoidingView>
      </ScrollView>
      </SafeAreaView>
    )
}
