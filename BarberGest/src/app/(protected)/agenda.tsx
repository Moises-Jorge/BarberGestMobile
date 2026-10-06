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
        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 8}}>
          <Text style={{color: "white", fontSize: 30, fontWeight: "bold"}}>Minha</Text>
          <Text style={{color: "cyan", fontSize: 30, fontWeight: "bold"}}>Agenda</Text>
		    </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
            <Text style={styles.barbname}>{dados.barbeiroId}</Text>
        </ScrollView>
    </SafeAreaView>
  )
}
