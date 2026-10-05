import { BlurCarousel } from "@/components/blur-carrossel";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./mockData";
import { saveAgendamento } from "./agendamento";

export default function Index() {
  const { signOut, name } = useAuth();
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
		<ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
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
							colors={["transparent", "#131313ff"]}
							locations={[0, 1]}
							style={[StyleSheet.absoluteFill, {borderBottomLeftRadius: 30, borderBottomRightRadius: 30}]}
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
									colors={["transparent", "#131313ff"]}
									locations={[0, 0.7]}
									style={[StyleSheet.absoluteFill, {borderBottomLeftRadius: 30, borderBottomRightRadius: 30}]}
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
		<BlurCarousel
            data={mockBarbeiros}
			spacing={0}
			itemWidth={200}
            renderItem={({ item }) => (
                <Pressable style={[styles.barCard]}>
					<Image source={item.img} style={{width: 200,
						height: 200,
						position: "absolute",
						alignSelf: "center",
						borderRadius: 30
					}}/>
					<View style={[styles.wrapper, styles.barbInfo]} pointerEvents="box-none">
						{/* <MaskedView
								style={[StyleSheet.absoluteFill]}
								pointerEvents="none"
								maskElement={ */}		
								  <LinearGradient
									colors={["transparent", "#131313ff"]}
									locations={[0.2, 0.9]}
									style={[StyleSheet.absoluteFill, {borderBottomLeftRadius: 30, borderBottomRightRadius: 30}]}
								  />
								{/* }
							  >
							  </MaskedView> */}
							<Text style={styles.barbname}>{item.name}</Text>
							<Text style={styles.startTime}>{item.start_time} - {item.end_time}</Text>
					</View>
                </Pressable>
            )}
            />
		  {/* <Button title="Sair" onPress={signOut} /> */}
		</ScrollView>
	</SafeAreaView>
  )
}
