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
        <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={styles.profileTopCard}>
            <View style={{flexDirection: "row"}}>
              <View style={[styles.userImag, {width: width * 0.20,
                height: width * 0.20,
                borderRadius: (width * 0.20) / 2,}]}/>
                <View style={{alignSelf: "center"}}>
                  <Text style={[styles.barbname]}>
                    {name}
                  </Text>
                  <Text style={{color: "gray", fontSize: RFValue(13)}}>cliente</Text>
                </View>
            </View>
          </View>
          {/* <Button title="sair" onPress={signOut}></Button> */}
        </ScrollView>
    </SafeAreaView>
  )
}
