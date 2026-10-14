import { BlurCarousel } from "@/components/blur-carrossel";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
const {width, height} = Dimensions.get("screen");

export default function Profile() {
  const { signOut, name } = useAuth();
  return (
    <SafeAreaView style={[{backgroundColor: "#000000", flex: 1, gap: 0}]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 5}}>
          <Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Meu</Text>
          <Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Perfil</Text>
		    </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={styles.profileTopCard}>
            <View style={{flexDirection: "row"}}>
              <View style={[styles.userImag, {width: width * 0.20, marginTop: 0,
                height: width * 0.20,
                borderRadius: (width * 0.20) / 2}]}>
                  <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold"}}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
              </View>
                <View style={{alignSelf: "center"}}>
                  <Text style={[styles.barbname, {fontSize: RFValue(18)}]}>
                    {name}
                  </Text>
                  <Text style={{color: "gray", fontSize: RFValue(15)}}>cliente</Text>
                </View>
            </View>
          </View>
          <View style={styles.settingOptions}>
            <View style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Telemóvel</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>945 252 451</Text>
            </View>
            <View style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Cliente de</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>Nome da Barbearia</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 7, width: "90%"}]} onPress={signOut}>
          <Text>Terminar Sessão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 100, backgroundColor: "#e24646ff", width: "90%"}]}>
          <Text>Apagar conta</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}
