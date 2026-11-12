
import { BlurCarousel } from "@/components/blur-carrossel";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { saveAgendamento } from "./agendamento";
import { useEffect, useRef, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Barbeiro, Cliente, Servico } from "./types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurTargetView, BlurView } from "expo-blur";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Index() {
  const { apiFetch, name, isLoading: authLoading } = useAuth();

  const [barbers, setBarbers] = useState<Barbeiro[]>([]);
  const [services, setServices] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<Cliente | null>(null);

  const containerRef = useRef(null);

  const [erro, setErro] = useState(false);
  const [erro2, setErro2] = useState(false);
  const [erroCliente, setErroCliente] = useState(false);

  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  const [loading3Modal, setLoading3Modal] = useState(false);

  const [selectedName, setSelectedName] = useState("");
  const [hEntrada, setHEntrada] = useState("");
  const [hSaida, setHsaida] = useState("");

  const { width, height } = Dimensions.get("screen");

  // BUSCAR BARBEIROS
  useEffect(() => {
    async function logBarbers() {
      if (authLoading) return;
      try {
        setLoading(true);
        setErro(false);

        const response = await apiFetch(`${url}/api/barbeiros`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const text = await response.text();

        console.log("Barbeiros:", response.status, text);

        if (!response.ok) {
          throw new Error(`Erro ao buscar barbeiros: ${response.status}`);
        }

        const json = JSON.parse(text);
        const lista = json.barbeiros ?? json.data ?? json;

        if (!Array.isArray(lista)) {
          throw new Error("Formato inválido na resposta dos barbeiros");
        }

        setBarbers(lista);
      } catch (error) {
        console.log("Erro ao buscar barbeiros:", error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    }

    logBarbers();
  }, [authLoading]);

  // BUSCAR SERVIÇOS
  useEffect(() => {
    async function logServices() {
      if (authLoading) return;

      try {
        setLoading2(true);
        setErro2(false);

        const response = await apiFetch(`${url}/api/servicos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            //Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();

        console.log("Serviços:", response.status, text);

        if (!response.ok) {
          throw new Error(`Erro ao buscar serviços: ${response.status}`);
        }

        const json = JSON.parse(text);
        const lista = json.servicos ?? json.data ?? json;

        if (!Array.isArray(lista)) {
          throw new Error("Formato inválido na resposta dos serviços");
        }

        setServices(lista);
      } catch (error) {
        console.log("Erro ao buscar serviços:", error);
        setErro2(true);
      } finally {
        setLoading2(false);
      }
    }

    logServices();
  }, [authLoading]);

  // BUSCAR DADOS DO CLIENTE
  useEffect(() => {
    async function logClients() {
      if (authLoading) return;
      try {
        setLoading3(true);
        setErroCliente(false);

        const stored = await AsyncStorage.getItem("clientes");

        if (!stored) {
          throw new Error("Não existem dados do cliente guardados.");
        }

        const clienteGuardado = JSON.parse(stored);

        const clientesId =
          clienteGuardado.id ??
          clienteGuardado.user?.id ??
          clienteGuardado.cliente?.id;

        if (!clientesId) {
          console.log("Dados guardados:", clienteGuardado);
          throw new Error("ID do cliente não encontrado.");
        }

        const response = await apiFetch(
          `${url}/api/clientes/${clientesId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              //Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();

        console.log("Cliente:", response.status, text);

        if (!response.ok) {
          throw new Error(`Erro ao buscar cliente: ${response.status}`);
        }

        const json = JSON.parse(text);
        const cliente = json.cliente ?? json.data ?? json;

        setClientes(cliente);
      } catch (error) {
        console.log("Erro ao buscar cliente:", error);
        setErroCliente(true);
      } finally {
        setLoading3(false);
      }
    }

    logClients();
  }, [authLoading]);

  const nomeCliente = clientes?.nome ?? name ?? "";

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000000",
        flex: 1,
        gap: 0,
      }}
    >
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <BlurView intensity={50} tint="dark" style={{ flex: 1 }}>
          <View style={styles.closeButtonView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" color="red" size={RFValue(22)} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.modalContent,
              {
                position: "absolute",
                bottom: 0,
                width: width,
              },
            ]}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={[
                  styles.userImag,
                  {
                    width: width * 0.3,
                    marginTop: 0,
                    height: width * 0.3,
                    borderRadius: (width * 0.3) / 2,
                  },
                ]}
              >
                <Image
                  source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")}
                  style={{
                    height: width * 0.3,
                    width: width * 0.3,
                    borderRadius: (width * 0.3) / 2,
                  }}
                />
              </View>

              <View style={{ alignSelf: "center", gap: 5 }}>
                <Text
                  style={[
                    styles.barbname,
                    { fontSize: RFValue(18) },
                  ]}
                >
                  {selectedName}
                </Text>

                <Text
                  style={{
                    color: "gray",
                    fontSize: RFValue(15),
                  }}
                >
                  Barbeiro/a
                </Text>

                <Text
                  style={[
                    styles.startTime,
                    { color: "gray", marginTop: 0 },
                  ]}
                >
                  {hEntrada} - {hSaida}
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* CABEÇALHO */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            left: 20,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: RFValue(25),
              fontWeight: "bold",
            }}
          >
            Barber
          </Text>

          <Text
            style={{
              color: "cyan",
              fontSize: RFValue(25),
              fontWeight: "bold",
            }}
          >
            Gest
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.navigate("/profile")}
          style={styles.userImag}
        >
          <Text
            style={{
              color: "cyan",
              fontSize: RFValue(18),
              fontWeight: "bold",
            }}
          >
            {nomeCliente ? nomeCliente.charAt(0).toUpperCase() : "?"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <BlurTargetView ref={containerRef}>
          {/* SAUDAÇÃO */}
          <View style={{ alignSelf: "flex-start", left: 20 }}>
            {nomeCliente ? (
              <Text style={styles.title4}>
                Olá, {nomeCliente.split(" ")[0]}!
              </Text>
            ) : loading3 ? (
              <ActivityIndicator color="cyan" />
            ) : null}
          </View>

          {/* IMAGEM DA BARBEARIA */}
          <View style={styles.barbImageCard}>
            <Image
              source={require("../../../assets/images/barbershop.jpeg")}
              style={styles.barbImg}
            />

            <View
              style={[styles.wrapper, styles.barbInfo]}
              pointerEvents="box-none"
            >
              <LinearGradient
                colors={["transparent", "#000000ff"]}
                locations={[0, 1]}
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: 0.7 },
                ]}
              />

              <Text style={styles.barbname}>
                Barbearia Não sei mais quanto
              </Text>
            </View>
          </View>

          {/* SERVIÇOS */}
          <Text style={styles.title5}>Serviços</Text>

          {loading2 && (
            <ActivityIndicator
              color="cyan"
              size={30}
              style={{
                marginTop: 40,
              }}
            />
          )}

          {erro2 ? (
            <View style={{ alignSelf: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "red",
                  marginTop: 20,
                }}
              >
                Erro ao carregar lista de Serviços!
              </Text>
            </View>
          ) : !loading2 && services.length === 0 ? (
            <Text
              style={{
                color: "gray",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Nenhum serviço disponível.
            </Text>
          ) : (
            <BlurCarousel
              data={services}
              spacing={0}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    router.navigate({
                      pathname: "/details",
                      params: {
                        name: item.nome,
                        price: item.preco,
                        time: item.duracao,
                        descricao: item.descricao,
                      },
                    });

                    saveAgendamento({
                      servico: item.nome,
                    });
                  }}
                  style={styles.barCard2}
                >
                  <View
                    style={[styles.wrapper, styles.barbInfo]}
                    pointerEvents="box-none"
                  >
                    <LinearGradient
                      colors={["transparent", "#000000ff"]}
                      locations={[0, 0.7]}
                      style={[
                        StyleSheet.absoluteFill,
                        { opacity: 0.7 },
                      ]}
                    />

                    <Text style={styles.barbname}>
                      {item.nome}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                        top: 5,
                      }}
                    >
                      <Ionicons
                        name="speedometer"
                        size={RFValue(16)}
                        color="cyan"
                      />

                      <Text
                        style={{
                          color: "white",
                          fontSize: RFValue(14),
                        }}
                      >
                        ~{item.duracao} min |
                      </Text>

                      <Ionicons
                        name="cash"
                        size={RFValue(16)}
                        color="cyan"
                      />

                      <Text
                        style={{
                          color: "white",
                          fontSize: RFValue(14),
                        }}
                      >
                        {item.preco} Kz
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          )}

          {/* BARBEIROS */}
          <Text style={styles.title5}>Barbeiros</Text>

          {loading && (
            <ActivityIndicator
              color="cyan"
              size={30}
              style={{ marginTop: 40 }}
            />
          )}

          {erro ? (
            <View style={{ alignSelf: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "red",
                  marginTop: 20,
                }}
              >
                Erro ao carregar lista de Barbeiros!
              </Text>
            </View>
          ) : !loading && barbers.length === 0 ? (
            <Text
              style={{
                color: "gray",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Nenhum barbeiro disponível.
            </Text>
          ) : (
            <FlatList
              horizontal
              data={barbers}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: 5 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                    setSelectedName(item.nome);
                    setHEntrada(item.h_entrada);
                    setHsaida(item.h_saida);
                  }}
                  style={styles.barCard}
                >
                  <Image
                    source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")}
                    style={{
                      height: height * 0.25,
                      width: width * 0.45,
                      borderRadius: width * 0.08,
                    }}
                  />

                  <View
                    style={[styles.wrapper, styles.barbInfo]}
                    pointerEvents="box-none"
                  >
                    <LinearGradient
                      colors={["transparent", "#000000ff"]}
                      locations={[0, 1]}
                      style={[
                        StyleSheet.absoluteFill,
                        { opacity: 0.8 },
                      ]}
                    />

                    <Text style={styles.barbname}>
                      {item.nome}
                    </Text>

                    <Text style={styles.startTime}>
                      {item.h_entrada} - {item.h_saida}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </BlurTargetView>
      </ScrollView>
    </SafeAreaView>
  );
}
