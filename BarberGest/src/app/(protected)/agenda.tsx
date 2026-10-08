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
          <View style = {{flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
            borderRadius: 30,
            backgroundColor: "#1b1b1bff",
            padding: 20,
            maxWidth : "100%",
            width: "95%",
            height: "100%",
          }}>
            <View style={styles.serviceImgCard}>

            </View>
            <View style={{alignSelf: "center", gap: 5}}>
              <Text style={{color: "white"}}>Barbeiro escolhido: {dados.barbeiroName}</Text>
              <Text style={{color: "white"}}>Servico: {dados.servico}</Text>
              <Text style={{color: "white"}}>Tempo estimado: {dados.duracao} min</Text>
              <Text style={{color: "white"}}>Preco : {dados.preco} Kz</Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}
