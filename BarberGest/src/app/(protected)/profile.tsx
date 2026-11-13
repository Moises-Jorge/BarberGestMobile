import { useAuth } from "@/hooks/useAuth";
import SaveButton from "@/shared/components/save-button";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurTargetView, BlurView } from "expo-blur";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { Cliente } from "./types";

const { width, height } = Dimensions.get("screen");

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Profile() {
  const { signOut, deleteAccount, token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(false); // apagar conta
  const [loading3, setLoading3] = useState(false); // carregar cliente
  const [erro, setErro] = useState(false); // erro ao apagar / carregar
  const [erro2, setErro2] = useState(false); // erro ao atualizar
  const [clientes, setClientes] = useState<Cliente | null>(null);
  const containerRef = useRef(null);
  const [nome, setNome] = useState("");
  const [number, setNumber] = useState("");
  const [salvo, setSalvo] = useState(false);

  // Validação em tempo real: recalculada a cada digitação.
  const errors = useMemo(() => {
    const e: { nome?: string; number?: string } = {};
    const n = nome.trim();
    const t = number.trim();

    if (n !== "") {
      if (n.length < 2) e.nome = "O nome deve ter pelo menos 2 caracteres";
      else if (n.length > 40) e.nome = "O nome deve ter no máximo 40 caracteres";
      else if (!/^[\p{L}\s'-]+$/u.test(n)) e.nome = "O nome contém caracteres inválidos";
    }

    if (t !== "") {
      if (!/^\d+$/.test(t)) e.number = "O telefone só pode conter números";
      else if (t.length !== 9) e.number = "O telefone deve ter exatamente 9 dígitos";
    }

    return e;
  }, [nome, number]);

  const hasErrors = Object.keys(errors).length > 0;

  const changed =
    (nome.trim() !== "" && nome.trim() !== clientes?.nome) ||
    (number.trim() !== "" && number.trim() !== clientes?.telefone);

  // O botão só ativa quando algo mudou e tudo o que foi digitado é válido.
  const canSave = changed && !hasErrors;

  async function getClienteStorage() {
    return JSON.parse((await AsyncStorage.getItem("clientes")) ?? "{}");
  }

  // Apaga na API. Lança erro se falhar (não engole a exceção).
  async function apagarConta() {
    const cliente = await getClienteStorage();
    const clienteId = cliente.id;
    if (!clienteId) throw new Error("Usuário não encontrado");

    const response = await fetch(`${url}/api/clientes/${clienteId}`, {
      method: "DELETE",
      headers: { "ngrok-skip-browser-warning": "true", "Authorization": `Bearer ${token}`, },
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message ?? "Erro ao apagar conta");
    }
  }

  async function handleDelete() {
    try {
      setLoading(true);
      setErro(false);
      await apagarConta(); // 1. apaga na BD
      await deleteAccount(); // 2. limpa storage + isLoggedIn = false
      setVisible2(false);
      router.replace("/signIn");
    } catch (e) {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarDados() {
    const cliente = await getClienteStorage();
    const clienteId = cliente.id;
    if (!clienteId) throw new Error("Usuário não encontrado");

    const novoNome = nome.trim() || cliente.nome;
    const novoTelefone = number.trim() || cliente.telefone;

    const response = await fetch(`${url}/api/clientes/${clienteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ nome: novoNome, telefone: novoTelefone }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message ?? "Erro ao atualizar os dados");
    }

    const atualizado = await response.json().catch(() => null);
    const novo = atualizado ?? {
      ...cliente,
      nome: novoNome,
      telefone: novoTelefone,
    };

    setClientes(novo);
    await AsyncStorage.setItem("clientes", JSON.stringify(novo));
    setSalvo(true);
    setNome("");
    setNumber("");
  }

  // Lança erro em caso de falha para o SaveButton saber que não foi salvo.
  const handlePull = async () => {
    if (hasErrors) {
      throw new Error("Dados inválidos");
    }
    setErro2(false);
    try {
      await atualizarDados();
    } catch (e) {
      setErro2(true);
      throw e;
    }
  };

  useEffect(() => {
    async function carregarCliente() {
      try {
        setLoading3(true);
        const cliente = await getClienteStorage();
        const clienteId = cliente.id;
        const response = await fetch(`${url}/api/clientes/${clienteId}`, {
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true", "Authorization": `Bearer ${token}`,},
        });
        if (!response.ok) {
          setErro(true);
          return;
        }
        setClientes(await response.json());
      } catch (e) {
        setErro(true);
      } finally {
        setLoading3(false);
      }
    }
    carregarCliente();
  }, []);

  const inicial = clientes?.nome?.charAt(0).toUpperCase() ?? "";

  return (
    <SafeAreaView style={[{ backgroundColor: "#000000", flex: 1, gap: 0 }]}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      {/* Modal de edição */}
      <Modal
        animationType="slide"
        blurTarget={containerRef}
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.closeButtonView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setVisible(false);
                  setNome("");
                  setNumber("");
                  setErro2(false);
                  setSalvo(false);
                }}
              >
                <Ionicons name="close" color="red" size={RFValue(22)} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center", marginTop: height / 15 }}>
              <View style={styles.modalContent}>
                <View
                  style={[
                    styles.userImag,
                    {
                      width: width * 0.2,
                      height: width * 0.2,
                      marginTop: 0,
                      alignSelf: "center",
                      marginBottom: 20,
                      borderRadius: (width * 0.2) / 2,
                    },
                  ]}
                >
                  <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold", position: "absolute" }}>
                    {inicial}
                  </Text>
                  <TouchableOpacity style={[styles.editButton, {marginTop: width * .14}]} onPress={() => setVisible(true)}>
                    <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)} />
                  </TouchableOpacity>
                </View>

                <View style={{ gap: 20, alignSelf: "center" }}>
                  <View>
                    <Text style={{ color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold" }}>
                      Nome
                    </Text>
                    <TextInput
                      style={[styles.input, { width: width * 0.65 }]}
                      value={nome}
                      onChangeText={(t) => {
                        setNome(t);
                        setErro2(false);
                        setSalvo(false);
                      }}
                      placeholder={clientes?.nome}
                      placeholderTextColor="#9c9c9cff"
                    />
                    {errors.nome && (
                      <Text style={{ color: "red", fontSize: RFValue(12), textAlign: "center", marginTop: 4 }}>{errors.nome}</Text>
                    )}
                  </View>

                  <View>
                    <Text style={{ color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold" }}>
                      Telemóvel
                    </Text>
                    <TextInput
                      style={[styles.input, { width: width * 0.65 }]}
                      value={number}
                      keyboardType="number-pad"
                      maxLength={9}
                      onChangeText={(t) => {
                        setNumber(t);
                        setErro2(false);
                        setSalvo(false);
                      }}
                      placeholder={clientes?.telefone}
                      placeholderTextColor="#9c9c9cff"
                    />
                    {errors.number && (
                      <Text style={{ color: "red", fontSize: RFValue(12), textAlign: "center", marginTop: 4 }}>{errors.number}</Text>
                    )}
                  </View>
                </View>

                <View>
                  {erro2 && (
                    <Text style={{ color: "#e24646", textAlign: "center", marginTop: 20 }}>
                      Não foi possível atualizar seus dados.{"\n"} Tente novamente.
                    </Text>
                  )}
                  <SaveButton.Root
                    style={{
                      alignSelf: "center",
                      marginTop: 30,
                      maxWidth: width * 0.65,
                      width: width * 0.65,
                      opacity: canSave || salvo ? 1 : 0.5,
                    }}
                    onSave={handlePull}
                    onSaved={() => {
                      setTimeout(() => {
                        setNome("");
                        setNumber("");
                        setSalvo(false);
                        setVisible(false);
                        setErro2(false);
                      }, 800);
                    }}
                    disabled={!canSave}
                  >
                    <SaveButton.Label>Salvar</SaveButton.Label>
                    <SaveButton.Saved>Salvo!</SaveButton.Saved>
                  </SaveButton.Root>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>

      {/* Modal de apagar conta */}
      <Modal
        animationType="slide"
        blurTarget={containerRef}
        transparent={true}
        visible={visible2}
        onRequestClose={() => {
          setVisible2(false);
          setErro(false);
        }}
      >
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
          <View style={styles.closeButtonView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setVisible2(false);
                setErro(false);
              }}
            >
              <Ionicons name="close" color="red" size={RFValue(22)} />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", justifyContent: "center", marginTop: height / 6 }}>
            <View style={[styles.modalContent]}>
              <View style={{ width: width * 0.65 }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: RFValue(14) }}>
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
              <View style={{ flexDirection: "row", marginTop: 20, width: width * 0.7, gap: 10 }}>
                <TouchableOpacity
                  style={[styles.entrarButton, { backgroundColor: "cyan", flex: 1 }]}
                  onPress={() => {
                    setVisible2(false);
                    setErro(false);
                  }}
                >
                  <Text style={{ fontSize: RFValue(14) }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.entrarButton, { backgroundColor: "#e24646ff", flex: 1 }]}
                  onPress={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator
                      color="black"
                      size={RFValue(13)}
                      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                    />
                  ) : (
                    <Text style={{ fontSize: RFValue(14) }}>Apagar conta</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 8 }}>
        <View style={{ flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 5 }}>
          <Text style={{ color: "white", fontSize: RFValue(25), fontWeight: "bold" }}>Meu</Text>
          <Text style={{ color: "cyan", fontSize: RFValue(25), fontWeight: "bold" }}>Perfil</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <BlurTargetView ref={containerRef}>
          <View style={styles.profileTopCard}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.userImag,
                  {
                    width: width * 0.2,
                    height: width * 0.2,
                    marginTop: 0,
                    borderRadius: (width * 0.2) / 2,
                  },
                ]}
              >
                {loading3 ? (
                  <ActivityIndicator
                    color="cyan"
                    size={RFValue(25)}
                    style={{ justifyContent: "center", alignItems: "center" }}
                  />
                ) : (
                  <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold" }}>{inicial}</Text>
                )}
              </View>
              <View style={{ alignSelf: "center" }}>
                <Text style={[styles.barbname, { fontSize: RFValue(18) }]}>{clientes?.nome}</Text>
                <Text style={{ color: "gray", fontSize: RFValue(15) }}>cliente</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setVisible(true)}>
              <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingOptions}>
            <View style={styles.settingsOption}>
              <Text style={{ color: "white", fontSize: RFValue(15) }}>Telemóvel</Text>
              <Text style={{ color: "gray", fontSize: RFValue(15) }}>{clientes?.telefone}</Text>
            </View>
            <View style={styles.settingsOption}>
              <Text style={{ color: "white", fontSize: RFValue(15) }}>Cliente de</Text>
              <Text style={{ color: "gray", fontSize: RFValue(15) }}>Nome da Barbearia</Text>
            </View>
          </View>
        </BlurTargetView>
      </ScrollView>

      <TouchableOpacity
        style={[styles.entrarButton, { alignSelf: "center", marginBottom: 7, width: "90%" }]}
        onPress={signOut}
      >
        <Text>Terminar Sessão</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.entrarButton, { alignSelf: "center", marginBottom: 100, backgroundColor: "#e24646ff", width: "90%" }]}
        onPress={() => setVisible2(true)}
      >
        <Text>Apagar conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}