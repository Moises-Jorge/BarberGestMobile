import { BlurCarousel } from "@/components/blur-carrossel";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable,
	ScrollView,
	StatusBar,
	StyleSheet,
	FlatList,
	Text,
	TouchableOpacity,
	View,
	Image,
	Button,
	Dimensions,
	ActivityIndicator, 
	Modal} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { saveAgendamento } from "./agendamento";
import { useEffect, useRef, useState } from "react";
import {RFValue} from "react-native-responsive-fontsize";
import { Barbeiro, Cliente, Servico } from "./types";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurTargetView, BlurView } from "expo-blur";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Index() {
	const [barbers, setBarbers] = useState<Barbeiro[]>([]);
	const [services, setServices] = useState<Servico[]>([]);
	const containerRef = useRef(null);
	const [erro, setErro] = useState(false);
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loading3, setLoading3] = useState(false);
	const [clientes, setClientes] = useState<Cliente | null>(null);
	const [erro2, setErro2] = useState(false);
	const [loading2, setLoading2] = useState(true);
	const [selectedName, setSelectedName] = useState("");
	const [hEntrada, setHEntrada] = useState("");
	const [hSaida, setHsaida] = useState("");
	const {width, height} = Dimensions.get("screen");

	useEffect(() => {
		async function logBarbers() {
			try {
			const response = await fetch(`${url}/api/barbeiros`, {
				headers: { "ngrok-skip-browser-warning": "true" },
			});
			//console.log("status:", response.status);
			const text = await response.text();
			//console.log("resposta:", text.slice(0, 300));
			if (!response.ok) { setErro(true); return };
			const json = JSON.parse(text);
			setBarbers(Array.isArray(json) ? json : json.barbeiros);
			} catch (error) {
				setErro(true);
			}
			finally{
				setLoading(false);
			}
		}
		logBarbers();
		}, []);

		useEffect(() => {
		async function logServices() {
			try {
			const response = await fetch(`${url}/api/servicos`, {
				headers: { "ngrok-skip-browser-warning": "true" },
			});
			//console.log("status:", response.status);
			const text = await response.text();
			//console.log("resposta:", text.slice(0, 300));
			if (!response.ok) { setErro2(true); return };
			const json = JSON.parse(text);
			setServices(Array.isArray(json) ? json : json.servicos);
			} catch (error) {
				setErro2(true);
			}
			finally{
				setLoading2(false);
			}
		}
		logServices();
		}, []);
		//sem ngok
		/* useEffect(() => {
			async function logBarbers ()
			{
				try
				{
					const response = await fetch(`${url}/api/barbeiros`);
					if (response.status === 200)
					{
						const responseJson = await response.json();
						setDatas(responseJson)
						console.log(responseJson)
					}
				}
				catch(error)
				{
					console.log(error);
				}
			}
				logBarbers()
			}, []); */

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
		<SafeAreaView style={[{backgroundColor: "#000000ff", flex: 1, gap: 0}]}>
			<StatusBar backgroundColor="#000000" barStyle="light-content" />

			<Modal
				animationType="slide"
				blurTarget={containerRef}
				transparent={true}
				visible={visible}
				onRequestClose={() => setVisible(!visible)}
			>
				<BlurView intensity={50} tint="dark" style={{flex: 1}}>
					<View style={styles.closeButtonView}>
					<TouchableOpacity style={styles.closeButton} onPress={() => {setVisible(!visible)}}>
						<Ionicons name="close" color="red" size={RFValue(22)}/>
					</TouchableOpacity>
					</View>

					<View style={[styles.modalContent, /* {padding: 10} */]}>
						<View style={{flexDirection: "row", gap: 10}}>
							<View style={[styles.userImag, {width: width * 0.30, marginTop: 0,
								height: width * 0.30,
								borderRadius: (width * 0.30) / 2}]}>
								<Image
									source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")}
									style =
									{{
										height: width * .30,
										width: width * .30,
										borderRadius: (width * .30)/2,
									}}/>
							</View>
							<View style={{alignSelf: "center", gap: 5}}>
								<Text style={[styles.barbname, {fontSize: RFValue(18),}]}>
									{selectedName}
								</Text>
								<Text style={{color: "gray", fontSize: RFValue(15)}}>Barbeiro/a</Text>
								<Text style={[styles.startTime, {color: "gray", marginTop: 0}]}>
									{hEntrada} - {hSaida}
								</Text>
								</View>
							</View>
					</View>

				</BlurView>
			</Modal>

			<View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
			<View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20}}>
				<Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Barber</Text>
				<Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Gest</Text>
			</View>
				<TouchableOpacity onPress={() => router.navigate("/profile")} style={styles.userImag}>
					<Text style={{ color: "cyan", fontSize: RFValue(18), fontWeight: "bold"}}>
						{clientes?.nome.charAt(0).toUpperCase()}
					</Text>
				</TouchableOpacity>
		</View>
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
				<BlurTargetView ref={containerRef}>
				<View style={{alignSelf: "flex-start", left: 20}}>
					{clientes?.nome ? <Text style={styles.title4}>Olá, {clientes?.nome.split(" ")[0]}!</Text> : null}
				</View>
				<View style={[styles.barbImageCard]}>
					<Image
						source={require("../../../assets/images/barbershop.jpeg")}
						style={[styles.barbImg]}
					/>
				<View style={[styles.wrapper, styles.barbInfo]} pointerEvents="box-none">
					{/* <MaskedView
							style={[StyleSheet.absoluteFill]}
							pointerEvents="none"
							maskElement={ */}
					<LinearGradient
						colors={["transparent", "#000000ff"]}
						locations={[0, 1]}
						style={[StyleSheet.absoluteFill, {opacity: .7}]}
					/>
					{/* }
						>
					</MaskedView> */}
					<Text style={styles.barbname}>Barbearia Não sei mais quanto</Text>
				</View>
			</View>
			<Text style={styles.title5}>Serviços</Text>
			{loading2 && (
				<ActivityIndicator color="cyan" size={30}
					style={{ flex: 1,
						justifyContent: "center",
						alignItems: "center",
						marginTop: 40,
					}}
				/>
			) }
			{erro2 ? (
				<View style = {{alignSelf: "center"}}>
					<Text style={{fontWeight: "bold", fontSize: 15, color: "red", marginTop: 20}}>
						Erro ao Carregar lista de Serviços!
					</Text>
				</View>
					
			) : (
			<BlurCarousel
				data={services}
				spacing={0}
				renderItem={({ item }) => (
					<Pressable onPress={() => {router.navigate({
						pathname: "/details",
						params : {name: item.nome, price: item.preco, time: item.duracao, descricao: item.descricao}});
						saveAgendamento({ servico: item.nome});}} style={[styles.barCard2]}>
						<View style={[styles.wrapper, styles.barbInfo]} pointerEvents="box-none">
							{/* <MaskedView
									style={[StyleSheet.absoluteFill]}
									pointerEvents="none"
									maskElement={ */}
									<LinearGradient
										colors={["transparent", "#000000ff"]}
										locations={[0, 0.7]}
										style={[StyleSheet.absoluteFill, {opacity: .7}]}
									/>
									{/* }
								>
								</MaskedView> */}
							<Text style={styles.barbname}>{item.nome}</Text>
							<View style={{flexDirection: "row", gap: 5, top: 5}}>
								<Ionicons name="speedometer" size={RFValue(16)} color= "cyan" />
								<Text style={{color: "white", fontSize: RFValue(14)}}>~{item.duracao} min |</Text>
								<Ionicons name="cash" size={RFValue(16)} color= "cyan" />
								<Text style={{color: "white", fontSize: RFValue(14)}}>{item.preco} Kz</Text>
                 			 </View>
						</View>
					</Pressable>
				)}
				/>)}
			<Text style={styles.title5}>Barbeiros</Text>
			{loading && (
				<ActivityIndicator color="cyan" size={30}
					style={{ flex: 1,
						justifyContent: "center",
						alignItems: "center",
						marginTop: 40,
					}}
				/>
			) }
			{erro ? (
				<View style = {{alignSelf: "center"}}>
					<Text style={{fontWeight: "bold", fontSize: 15, color: "red", marginTop: 20}}>
						Erro ao Carregar lista de Barbeiros!
					</Text>
				</View>
					
			) : (
			<FlatList
				horizontal
				data={barbers}
				keyExtractor={(item: any) => String(item.id)}
				showsHorizontalScrollIndicator={false}
				style={{paddingHorizontal: 5}}
				renderItem ={({item}) =>
					<TouchableOpacity onPress={()=> {setVisible(true);
					setSelectedName(item.nome);
					setHEntrada(item.h_entrada);
					setHsaida(item.h_saida)}}
					key={item.id} style={styles.barCard}>
						<Image
							source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")}
							style =
							{{
								height: height * .25,
        						width: width * .45,
								borderRadius: width * .08,
							}}
						/>
						<View style={[styles.wrapper, styles.barbInfo]} pointerEvents="box-none">
							<LinearGradient
								colors={["transparent", "#000000ff"]}
								locations={[0, 1]}
								style={[
									StyleSheet.absoluteFill, {opacity: .8},
								]}
							/>
							<Text style={styles.barbname}>{item.nome}</Text>
							<Text style={styles.startTime}>
							{item.h_entrada} - {item.h_saida}
							</Text>
						</View>
					</TouchableOpacity>
				}
				/>)}
				</BlurTargetView>
			</ScrollView>
		</SafeAreaView>
	)
}
