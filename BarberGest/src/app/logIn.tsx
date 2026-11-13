import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnStableCurvedLoopMarquee } from "../components/organisms/curved-marquee";
import { styles } from "../styles";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function SignIn() {
    const { signIn, token } = useAuth();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(true);
    const routes = useRouter();
    const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [serverResponse, setServerResponse] = useState('');

    const validatePhone = (value: string): string | undefined => {
        if (value.length === 0) return undefined; // não mostra erro com o campo vazio
        if (!/^\d*$/.test(value)) return "O telefone só pode conter números";
        if (value.length !== 9) return "O telefone deve ter 9 dígitos";
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        if (value.length === 0) return undefined;
        if (value.length < 8) return "A senha deve ter pelo menos 8 caracteres";
        if (value.length > 64) return "A senha é demasiado longa";
        if (!/[A-Z]/.test(value)) return "A senha deve ter uma letra maiúscula";
        if (!/[a-z]/.test(value)) return "A senha deve ter uma letra minúscula";
        return undefined;
    };

    const validate = () => {
        const newErrors = {
            phone: phone.length === 0 ? "Introduza o telefone" : validatePhone(phone),
            password: password.length === 0 ? "Introduza a senha" : validatePassword(password),
        };
        setErrors(newErrors);
        return !newErrors.phone && !newErrors.password;
    };

    const entrar = async () => {
    setLoading(true);
    setMensagem('');
    try {
        const response = await fetch(`${url}/api/auth/login/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
            senha: password,
            telefone: phone.trim(),
        }),
        });

        if (response.status == 401)
            setServerResponse("Senha ou número inválidos!");
        else
            setServerResponse('');

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
        if (!validate()) {
            setOk(false);
            return;
        }

        setOk(true);

        const sucesso = await entrar();

        if (sucesso?.accessToken && sucesso?.refreshToken) {
        // Guardar os dados do cliente
        await AsyncStorage.setItem(
            "clientes",
            JSON.stringify(sucesso.user)
        );

        // Guardar os tokens na autenticação
        await signIn(
            sucesso.accessToken,
            sucesso.refreshToken,
            sucesso.user.nome
        );
        } else if (sucesso) {
            setMensagem("Dados de autenticação incompletos");
        }
    }
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
                  <Text style={[styles.title2, {fontSize: RFValue(15)}]}>Inicie sessão</Text>
                <TextInput
                    maxLength={9}
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor="white"
                    keyboardType="numeric"
                    onChangeText={(t) => {
                        setPhone(t);
                        setErrors((prev) => ({ ...prev, phone: validatePhone(t) }));
                    }}
                    />
                    {!!errors.phone && (
                    <Text style={{ color: "red", fontSize: RFValue(12), textAlign: "center" }}>
                        {errors.phone}
                    </Text>
                    )}

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="white"
                    secureTextEntry
                    onChangeText={(t) => {
                        setPassword(t);
                        setErrors((prev) => ({ ...prev, password: validatePassword(t) }));
                    }}
                    />
                    {!!errors.password && (
                    <Text style={{ color: "red", fontSize: RFValue(12), textAlign: "center" }}>
                        {errors.password}
                    </Text>
                    )}
                  <TouchableOpacity style={styles.entrarButton} onPress={handleLogin} disabled={loading}>
                     {loading ? (
                        <ActivityIndicator
                          color="black"
                          size={RFValue(13)}
                          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                        />):(<Text>Entrar</Text>)}
                  </TouchableOpacity>
            {serverResponse ? <Text style={{color: "red", fontSize: RFValue(12), textAlign: "center"}}>{serverResponse}</Text> : null}
              </View>
              <Text style={styles.title3}>Ainda não tens uma conta? <Text onPress={() => routes.navigate("/signIn")} style={styles.link}>Cria uma!</Text></Text>
          </KeyboardAvoidingView>
      </ScrollView>
      </SafeAreaView>
    )
}
