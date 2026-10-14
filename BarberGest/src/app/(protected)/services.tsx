import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, ScrollView, StatusBar, StyleSheet, Text, FlatList, Image, TouchableOpacity, View, TextInput, useWindowDimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { SaveButton, SaveButtonLabel, SaveButtonRoot, SaveButtonSaved } from "@/shared/components/save-button";
import { mockBarbeiros, mockServicos } from "./data";
import { act, useEffect, useState } from "react";
import { saveAgendamento } from "./agendamento";
import { RFValue } from "react-native-responsive-fontsize";

const url = "https://noncapsizable-mitzie-creepiest.ngrok-free.dev";

export default function Services() {
	const [datas, setDatas] = useState([]);
	const [erro, setErro] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function logBarbers() {
			try
			{
				const response = await fetch(`${url}/api/barbeiros`, {
					headers: { "ngrok-skip-browser-warning": "true" },
				});
				//console.log("status:", response.status);
				const text = await response.text();
				//console.log("resposta:", text.slice(0, 300));
				if (!response.ok)
				{
					setErro(true);
					return ;
				}
			
				const json = JSON.parse(text);
				setDatas(Array.isArray(json) ? json : json.barbeiros);
			}
			catch (error)
			{
				setErro(true);
			} finally{
				setLoading(false);
			}
		}
		logBarbers();
	}, []);
	const { width } = useWindowDimensions();
	const [nameDobarb, setNameDobarb] = useState("");
	const WIDTH = width - 50;
	const route = useRouter();
	const [active, setActive] = useState(false);
	const [hora, setHora] = useState("");
	const [min, setMin] = useState("");
	const [focused, setFocused] = useState<"hora" | "min" | null>(null);;
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const {name, price, time} = useLocalSearchParams()
	function wait(arg0: number): void | Promise<void> {
		throw new Error("Function not implemented.");
	}

  return (
	<SafeAreaView style={[{backgroundColor: "#000000ff", flex: 1, gap: 0}]}>
		<StatusBar backgroundColor="#000000ff" barStyle="light-content" />
		<View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
		<View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 10}}>
			<TouchableOpacity onPress={()=> route.navigate("/")}
			style={{backgroundColor: "#141414ff",
				width: 40,
				height: 40,
				borderColor: "#1d1d1dff",
        		borderWidth: 2,
				borderRadius: 20,
				alignItems: "center",
				justifyContent: "center"
				}}>
					<Ionicons
						name="arrow-back"
						color="cyan"
						size={20}
					/>
			</TouchableOpacity>
			<Text style={{color: "white", fontSize: RFValue(25), alignSelf: "center", fontWeight: "bold"}}>Detalhes</Text>
		</View>
	  </View>
		<ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
	  		{name &&
				<View style={[styles.barbImageCard]}>
					<Image
						source={require("../../../assets/images/barbershop.jpeg")}
						style={styles.barbImg}
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
						<Text style={styles.barbname}>{name}</Text>
						<View style={{flexDirection: "row", gap: 5, top: 5}}>
							<Ionicons name="speedometer" size={RFValue(16)} color= "cyan" />
							<Text style={{color: "white", fontSize: RFValue(14)}}>~{time} min |</Text>
							<Ionicons name="cash" size={RFValue(16)} color= "cyan" />
							<Text style={{color: "white", fontSize: RFValue(14)}}>{price} Kz</Text>
                 		</View>
					</View>
				</View>
			}
			<View style={styles.scheduleInfo}>
				<View>
					<Text style={{color: "white",
						fontSize: RFValue(20),
						fontWeight: "bold",
						marginTop: 20,
						marginLeft: 20,
						}}>Descrição</Text>
						<Text style={{color: "white",
								fontSize: RFValue(15),
								padding: 20}}>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum officia illum laborum aperiam eum deleniti fuga rerum aut explicabo, sint perferendis! Sequi dolor omnis libero laborum labore quasi nam eveniet.
						</Text>
				</View>
					<Text style={{color: "white",
						fontSize: RFValue(20),
						fontWeight: "bold",
						marginTop: 20,
						marginLeft: 20,
						marginBottom: 20,
						}}>Escolha o seu barbeiro</Text>
				{loading && (
					<ActivityIndicator color="cyan" size={30}
						style={{ flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: 20,
						}}
					/>
				) }
				{erro ? (
					<View style = {{alignSelf: "center"}}>
						<Text style={{fontWeight: "bold", fontSize: RFValue(15), color: "red", marginTop: 10}}>
							Erro ao Carregar lista de Barbeiros!
						</Text>
					</View>
				) : (
				<FlatList
					data={datas}
					horizontal
					keyExtractor={(item: any) => String(item.id)}
					showsHorizontalScrollIndicator={false}
					style={{paddingHorizontal: 10}}
					renderItem={({item}) =>
						{ const active = selectedId === item.id;
						return (
						<TouchableOpacity onPress={() =>
							{setSelectedId(item.id), setNameDobarb(item.nome)}}
							key={item.id} style={[styles.barCard3, {borderColor: active ? "cyan" : "#1d1d1dff", borderWidth: 2}]}>
							<Image source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")} style={styles.barbImg2} />
							<Text style={styles.barbname}>{item.nome}</Text>
						</TouchableOpacity>
						)}}
				/>)}
			</View>
			<Text style={{color: "white",
				fontSize: RFValue(20),
				fontWeight: "bold",
				marginTop: 20,
				marginLeft: 20,
				marginBottom: 20,
				}}>Escolha o horario</Text>
			<View style={{ flexDirection: "row", justifyContent: "space-evenly"}}>
				<View style={{flexDirection: "row", gap: 10,}}>
					<Text style={{color: "white", alignSelf: "center"}}>Hora</Text>
					<TextInput value={hora} onChangeText={setHora} onFocus={() => setFocused("hora")} onBlur={() => setFocused(null)} keyboardType="numeric" style={[styles.input, {width: 100, textAlign: "center", borderColor: focused === "hora" ? "cyan" : "#1d1d1dff", borderWidth: 2}]}/>
				</View>
				<View style={{flexDirection: "row", gap: 10,}}>
					<Text style={{color: "white", alignSelf: "center"}}>Min</Text>
					<TextInput value={min} onChangeText={setMin} onFocus={() => setFocused("min")} onBlur={() => setFocused(null)} keyboardType="numeric" style={[styles.input, {width: 100, textAlign: "center", borderColor: focused === "min" ? "cyan" : "#1d1d1dff", borderWidth: 2}]}/>
				</View>
			</View>
			<View>
				<SaveButton.Root
					style={{alignSelf: "center", marginTop: 30, width: WIDTH}}
					onSave={() => wait(1000)}
					//resetAfter={2000}
					onSaved={() => saveAgendamento({barbeiroName: nameDobarb, servico: name, preco: price, duracao: time})}
					>
					<SaveButton.Label
					>
						Agendar
					</SaveButton.Label>
					<SaveButton.Saved
					>
						Agendado!
					</SaveButton.Saved>
        		</SaveButton.Root>
			</View>
		</ScrollView>
	</SafeAreaView>
  )
}
