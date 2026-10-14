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
	ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { saveAgendamento } from "./agendamento";
import { useEffect, useState } from "react";
import {RFValue} from "react-native-responsive-fontsize";
import { Barbeiro, Servico } from "./types";
import { Ionicons } from "@expo/vector-icons";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Index() {
	const { signOut, name } = useAuth();
	const [barbers, setBarbers] = useState<Barbeiro[]>([]);
	const [services, setServices] = useState<Servico[]>([]);
	const [erro, setErro] = useState(false);
	const [loading, setLoading] = useState(true);

	const [erro2, setErro2] = useState(false);
	const [loading2, setLoading2] = useState(true);
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

	return (
		<SafeAreaView style={[{backgroundColor: "#000000ff", flex: 1, gap: 0}]}>
			<StatusBar backgroundColor="#000000" barStyle="light-content" />
			<View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 2}}>
			<View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20}}>
				<Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Barber</Text>
				<Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Gest</Text>
			</View>
				<TouchableOpacity onPress={() => router.navigate("/profile")} style={styles.userImag}/>
		</View>
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
		<View style={{alignSelf: "flex-start", left: 20}}>
			{name ? <Text style={styles.title4}>Olá, {name}!</Text> : null}
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
						pathname: "/services",
						params : {name: item.nome, price: item.preco, time: item.duracao}});
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
					<Pressable key={item.id} style={styles.barCard}>
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
					</Pressable>
				}
				/>)}
			{/* <Button title="Sair" onPress={signOut} /> */}
			</ScrollView>
		</SafeAreaView>
	)
}
