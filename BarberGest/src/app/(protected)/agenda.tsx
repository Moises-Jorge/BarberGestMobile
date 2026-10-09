import { BlurCarousel } from "@/components/blur-carrossel";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { getAgendamento, limparAgendamento, Agendamento } from "./agendamento";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

export default function Agenda() {
  const { signOut, name } = useAuth();
  const [dados, setDados] = useState<Agendamento>({});

    useFocusEffect(
    useCallback(() => {
      getAgendamento().then(setDados);
    }, [])
  );

  return (
    <SafeAreaView style={[{backgroundColor: "#000000", flex: 1, gap: 0}]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 20}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 6}}>
          <Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Minha</Text>
          <Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Agenda</Text>
		    </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <View style={styles.serviceImgCard}>
              <View style={[styles.wrapper, styles.barbInfo]} pointerEvents="box-none">
                <LinearGradient
                  colors={["transparent", "#000000ff"]}
                  locations={[0, 1]}
                  style={[
                    StyleSheet.absoluteFill, {opacity: .8},
                  ]}
                />
                  <Text style={{color: "white", fontSize: RFValue(16)}}>{dados.servico} com {dados.barbeiroName}</Text>
                  <View style={{flexDirection: "row", gap: 5}}>
                    <Ionicons name="time-outline" size={RFValue(16)} color= "white" />
                    <Text style={{color: "white", fontSize: RFValue(14)}}>10h |</Text>
                    <Ionicons name="speedometer-outline" size={RFValue(16)} color= "white" />
                    <Text style={{color: "white", fontSize: RFValue(14)}}>~{dados.duracao}min |</Text>
                    <Ionicons name="cash-outline" size={RFValue(16)} color= "white" />
                    <Text style={{color: "white", fontSize: RFValue(14)}}>{dados.preco}Kz</Text>
                  </View>
              </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}
