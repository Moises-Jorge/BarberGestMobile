import { BlurCarousel } from "@/components/blur-carrossel";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Button, Dimensions, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { BlurTargetView, BlurView } from "expo-blur";
import SaveButton from "@/shared/components/save-button";
import { Color, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cliente } from "./types";
const {width, height} = Dimensions.get("screen");

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Profile() {
  const { signOut, deleteAccount } = useAuth();
  const [visible, setVisible] = useState(false);
  const [enable, setEnable] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [erro, setErro] = useState(false);
  const [clientes, setClientes] = useState<Cliente | null>(null);
  const containerRef = useRef(null);
  const [nome, setNome] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [number, setNumber] = useState("");

  const changed =
    (nome.trim() !== "" && nome.trim() !== clientes?.nome) ||
    (number.trim() !== "" && number.trim() !== clientes?.telefone);

  function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

  async function handleDelete() {
  try {
    await apagarConta();      // 1. apaga na BD (chamada à API)
    await deleteAccount();    // 2. limpa storage + isLoggedIn = false
  } catch (error) {
    setErro(true);
  }
}

  const [loading, setLoading] = useState(false);

  async function apagarConta() {
    try {
      setLoading(true);

      const clientes = JSON.parse((await AsyncStorage.getItem("clientes")) ?? "{}");
      const clientesId = clientes.id;
      //onsole.log("clientesId:", clientes);

      if (!clientesId) throw new Error("Usuário não encontrado");

      const response = await fetch(`${url}/api/clientes/${clientesId}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        const erro = await response.json().catch(() => null);
        throw new Error(erro?.message ?? "Erro ao apagar conta");
      }

      await AsyncStorage.multiRemove(["token", "clientes"]);
      setVisible2(false);
      router.replace("/signIn");
    } catch (e: any) {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarDados() {
      const cliente = JSON.parse((await AsyncStorage.getItem("clientes")) ?? "{}");
      const clientesId = cliente.id;
      //onsole.log("clientesId:", clientes);

      if (!clientesId) throw new Error("Usuário não encontrado");

      const response = await fetch(`${url}/api/clientes/${clientesId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nome: nome.trim() || clientes?.nome,
          telefone: number.trim() || clientes?.telefone}),
      });
      if (!response.ok) {
        const erro = await response.json().catch(() => null);
        throw new Error(erro?.message ?? "Erro ao atualizar oa dados");
      }
      const atualizado = await response.json().catch(() => null);
      const novo = atualizado ?? {
        ...cliente,
        nome: nome.trim() || clientes?.nome,
        telefone: number.trim() || clientes?.telefone,
      };

      setClientes(novo);
      await AsyncStorage.setItem("clientes", JSON.stringify(novo));
      setSalvo(true);
      setNome("");
      setNumber("");
  }
  useEffect(() => {
      async function logClients() {
        try {
              setLoading3(true);
              const clientes = JSON.parse((await AsyncStorage.getItem("clientes")) ?? "{}");
              const clientesId = clientes.id;
              const response = await fetch(`${url}/api/clientes/${clientesId}`, {
              headers: { "ngrok-skip-browser-warning": "true" },
        });
        //console.log("status:", response.status);
        const text = await response.text();
        //console.log("resposta:", text.slice(0, 300));
        if (!response.ok) { setErro(true); return };
        const json = JSON.parse(text);
        setClientes(json);
        } catch (error) {
          setErro(true);
        }
        finally{
          setLoading3(false);
        }
      }
      logClients();
      }, []);

  return (
    <SafeAreaView style={[{backgroundColor: "#000000", flex: 1, gap: 0}]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />

        <Modal
          animationType="slide"
          blurTarget={containerRef}
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
          <BlurView intensity={40} tint="dark" style={{flex: 1}}>
            <View style={styles.closeButtonView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => {setVisible(!visible);
                setNome("");
                setNumber("");
                setSalvo(false)}}>
                <Ionicons name="close" color="red" size={RFValue(22)}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems: "center", justifyContent: "center", marginTop: height / 15}}>
              <View style={styles.modalContent}>
                <View style={[styles.userImag, {width: width * 0.20, marginTop: 0,
                  height: width * 0.20,
                  alignSelf: "center",
                  marginBottom: 20,
                  borderRadius: (width * 0.20) / 2}]}>
                    <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold", position: "absolute"}}>
                      {clientes?.nome?.charAt(0).toUpperCase() ?? clientes?.nome.charAt(0).toUpperCase()}
                    </Text>
                    <TouchableOpacity style={[styles.editButton, {marginTop: (width * 0.15)}]} onPress={() => setVisible(true)}>
                      <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)}/>
                    </TouchableOpacity>
                  </View>
                <View style={{gap: 20, alignSelf: "center"}}>
                  <View>
                    <Text style={{color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold"}}>Nome</Text>
                    <TextInput style={[styles.input, {width: width * .65}]} value={nome} onChangeText={(t) => {setNome(t); setSalvo(false)}} placeholder={clientes?.nome} placeholderTextColor="#9c9c9cff"/>
                  </View>
                  <View>
                    <Text style={{color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold"}}>Telemóvel</Text>
                    <TextInput style={[styles.input, {width: width * .65}]} value={number} onChangeText={(t) => {setNumber(t); setSalvo(false)}} placeholder={clientes?.telefone} placeholderTextColor="#9c9c9cff"/>
                  </View>
                </View>

                <View>
                  <SaveButton.Root
                    style={{alignSelf: "center",
                      marginTop: 30,
                      maxWidth: width * .65,
                      width: width * .65,
                      opacity: changed || salvo ? 1 : 0.5,}}
                    onSave={atualizarDados}
                    //resetAfter={2000}
                    disabled={!changed}
                    >
                  <SaveButton.Label>
                      Salvar
                  </SaveButton.Label>
                  <SaveButton.Saved>
                      Salvo!
                  </SaveButton.Saved>
                  </SaveButton.Root>
			          </View>
              </View>
            </View>

          </BlurView>
        </Modal>


        <Modal
          animationType="slide"
          blurTarget={containerRef}
          transparent={true}
          visible={visible2}
          onRequestClose={() => setVisible2(!visible2)}
        >
          <BlurView intensity={40} tint="dark" style={{flex: 1}}>
            <View style={styles.closeButtonView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => {setVisible2(!visible2), setErro(false)}}>
                <Ionicons name="close" color="red" size={RFValue(22)}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems: "center", justifyContent: "center", marginTop: height / 6}}>
             <View style={[styles.modalContent]}>
              <View style={{width: width * .65}}>
                <Text style={{color: "white", textAlign: "center", fontSize: RFValue(14)}}>
                  Todos os seus dados serão permanentemente apagados!
                  {"\n\n"}
                  Tem certeza?
                </Text>
                {erro && (
                  <Text style={{ color: "#e24646", textAlign: "center", marginTop: 10 }}>
                    Não foi possível apagar a conta. Tente novamente.
                  </Text>
                )}
               </View>
               <View style={{flexDirection: "row", marginTop: 20, width: width * .70, gap: 10}}>
                  <TouchableOpacity style={[styles.entrarButton, {
                    backgroundColor: "cyan",
                    flex: 1}]} onPress={() => {setVisible2(false), setErro(false)}}>
                    <Text style = {{fontSize: RFValue(14)}}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.entrarButton, {backgroundColor: "#e24646ff", flex: 1,}]}
                    onPress={handleDelete}
                  >
                    { loading ? (
                      <ActivityIndicator color="black" size={RFValue(13)}
                        style={{ flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    ) : (<Text style = {{fontSize: RFValue(14)}}>Apagar conta</Text>)}
                  </TouchableOpacity>
                </View>
             </View>
            </View>

          </BlurView>
        </Modal>


        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 5}}>
          <Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Meu</Text>
          <Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Perfil</Text>
		    </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <BlurTargetView ref={containerRef}>
          <View style={styles.profileTopCard}>
            <View style={{flexDirection: "row"}}>
              <View style={[styles.userImag, {width: width * 0.20, marginTop: 0,
                height: width * 0.20,
                borderRadius: (width * 0.20) / 2}]}>
                  { loading3 ? (
                      <ActivityIndicator color="cyan" size={RFValue(25)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    ) : (
                  <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold"}}>
                    {clientes?.nome.charAt(0).toUpperCase()}
                  </Text>)}
              </View>
                <View style={{alignSelf: "center"}}>
                  <Text style={[styles.barbname, {fontSize: RFValue(18),}]}>
                    {clientes?.nome}
                  </Text>
                  <Text style={{color: "gray", fontSize: RFValue(15)}}>cliente</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setVisible(true)}>
              <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)}/>
            </TouchableOpacity>
          </View>
          <View style={styles.settingOptions}>
            <View style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Telemóvel</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>{clientes?.telefone}</Text>
            </View>
            <View style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Cliente de</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>Nome da Barbearia</Text>
            </View>
          </View>
          </BlurTargetView>
        </ScrollView>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 7, width: "90%"}]} onPress={signOut}>
          <Text>Terminar Sessão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 100, backgroundColor: "#e24646ff", width: "90%"}]}
        onPress={() => setVisible2(true)} >
          <Text>Apagar conta</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}
