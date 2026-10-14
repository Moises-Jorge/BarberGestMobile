import { BlurCarousel } from "@/components/blur-carrossel";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Button, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { RFValue } from "react-native-responsive-fontsize";

export default function Settings() {
  const { signOut, name } = useAuth();
  return (
    <SafeAreaView style={[{backgroundColor: "#000000", flex: 1, gap: 0}]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20}}>
            <Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Definições</Text>
        </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
        </ScrollView>
    </SafeAreaView>
  )
}
