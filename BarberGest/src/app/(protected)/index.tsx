import { BlurCarousel } from "@/components/blur-carrossel";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, StatusBar, StyleSheet, FlatList, Text, TouchableOpacity, View, Image, Button, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { saveAgendamento } from "./agendamento";
import { useEffect, useState } from "react";

const url = "http://10.12.6.9:3000/api";

export default function Index() {
	const { signOut, name } = useAuth();
	const [datas, setDatas] = useState([]);
	useEffect(() => {
	async function logBarbers ()
	{
		try
		{
			const response = await fetch(`${url}/barbeiros`);
			if (response.status === 200)
			{
				const responseJson = await response.json();
				setDatas(responseJson.barbeiros)
				console.log(responseJson)
			}
		}
		catch(error)
		{
			console.log(error);
		}
	}
		logBarbers()
	}, []);
  return (
	<SafeAreaView style={[{backgroundColor: "#000000ff", flex: 1, gap: 0}]}>
		<StatusBar backgroundColor="#000000" barStyle="light-content" />
		<View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
		<View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20}}>
			<Text style={{color: "white", fontSize: 30, fontWeight: "bold"}}>Barber</Text>
			<Text style={{color: "cyan", fontSize: 30, fontWeight: "bold"}}>Gest</Text>
		</View>
			<TouchableOpacity onPress={() => router.navigate("/profile")} style={styles.userImag}/>
	  </View>
		<ScrollView contentContainerStyle={{ paddingBottom: 75 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
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
				<Text style={styles.barbname}>Barbearia não sei mais quanto</Text>
			</View>
		</View>
		<Text style={styles.title5}>Serviços</Text>
		<BlurCarousel
            data={mockServicos}
			spacing={0}
            renderItem={({ item }) => (
                <Pressable onPress={() => {router.navigate({
					pathname: "/services",
					params : {name: item.name, price: item.price, time: item.serv_time}});
					saveAgendamento({ corteId: item.id});}} style={[styles.barCard2]}>
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
						<Text style={styles.barbname}>{item.name}</Text>
						<Text style={styles.startTime}>{item.price} | {item.serv_time}Kz</Text>
					</View>
                </Pressable>
            )}
            />
		<Text style={styles.title5}>Barbeiros</Text>
		<FlatList
			horizontal
			data={datas}
			keyExtractor={(item: any) => String(item.id)}
			showsHorizontalScrollIndicator={false}
			renderItem ={({item}) =>
				<Pressable key={item.id} style={styles.barCard}>
					<Image
						source={require("../../../assets/images/Screenshot from 2026-09-25 13-54-10.png")}
						style={{
						width: 200,
						height: 200,
						borderRadius: 30,
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
			/>
		{/* <Button title="Sair" onPress={signOut} /> */}
		</ScrollView>
	</SafeAreaView>
  )
}
