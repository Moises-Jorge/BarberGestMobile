import { BlurCarousel } from "@/components/blur-carrossel";
import Footer from "@/components/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Dimensions, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles";
import { mockBarbeiros, mockServicos } from "./data";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { BlurTargetView, BlurView } from "expo-blur";
import SaveButton from "@/shared/components/save-button";
import { Color } from "expo-router";
const {width, height} = Dimensions.get("screen");

export default function Profile() {
  const { signOut, name } = useAuth();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const containerRef = useRef(null);
  function wait(arg0: number): void | Promise<void> {
		throw new Error("Function not implemented.");
	}
  return (
    <SafeAreaView style={[{backgroundColor: "#000000", flex: 1, gap: 0}]}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />

        <Modal
          animationType="slide"
          blurTarget={containerRef}
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
          <BlurView intensity={40} tint="dark" style={{flex: 1}}>
            <View style={styles.closeButtonView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(!visible)}>
                <Ionicons name="close" color="red" size={RFValue(22)}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems: "center", justifyContent: "center", marginTop: height / 15}}>
              <View style={styles.modalContent}>
                <View style={[styles.userImag, {width: width * 0.20, marginTop: 0,
                  height: width * 0.20,
                  alignSelf: "center",
                  marginBottom: 20,
                  borderRadius: (width * 0.20) / 2}]}>
                    <Text style={{ color: "cyan", fontSize: RFValue(40), fontWeight: "bold", position: "absolute"}}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                    <TouchableOpacity style={[styles.editButton, {marginTop: (width * 0.15)}]} onPress={() => setVisible(true)}>
                      <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)}/>
                    </TouchableOpacity>
                  </View>
                <View style={{gap: 20, alignSelf: "center"}}>
                  <View>
                    <Text style={{color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold"}}>Nome</Text>
                    <TextInput style={[styles.input, {width: width * .65}]} placeholder={name} placeholderTextColor="#9c9c9cff"/>
                  </View>
                  <View>
                    <Text style={{color: "white", paddingHorizontal: 5, paddingVertical: 5, fontSize: RFValue(15), fontWeight: "bold"}}>Telemóvel</Text>
                    <TextInput style={[styles.input, {width: width * .65}]} placeholder="945 252 451" placeholderTextColor="#9c9c9cff"/>
                  </View>
                </View>

                <View>
                  <SaveButton.Root
                    style={{alignSelf: "center", marginTop: 30, maxWidth: width * .65, width: width * .65,}}
                    onSave={() => wait(50)}
                    //resetAfter={2000}
                    /* disabled={selectedId === null ? true : false} */
                    /* onSaved={()=> setVisible(false)} */
                    >
                  <SaveButton.Label>
                      Salvar
                  </SaveButton.Label>
                  <SaveButton.Saved>
                      Salvo!
                  </SaveButton.Saved>
                  </SaveButton.Root>
			          </View>
              </View>
            </View>

          </BlurView>
        </Modal>


        <Modal
          animationType="slide"
          blurTarget={containerRef}
          transparent={true}
          visible={visible2}
          onRequestClose={() => setVisible2(!visible2)}
        >
          <BlurView intensity={40} tint="dark" style={{flex: 1}}>
            <View style={styles.closeButtonView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setVisible2(!visible2)}>
                <Ionicons name="close" color="red" size={RFValue(22)}/>
              </TouchableOpacity>
            </View>

            <View style={{alignItems: "center", justifyContent: "center", marginTop: height / 6}}>
             <View style={[styles.modalContent]}>
              <View style={{width: width * .65}}>
                <Text style={{color: "white", textAlign: "center", fontSize: RFValue(14)}}>
                  Todos os seus dados serão permanentemente apagados!
                </Text>
               </View>
               <View style={{flexDirection: "row", marginTop: 30, width: width * .70, gap: 10}}>
                  <TouchableOpacity style={[styles.entrarButton, {
                    backgroundColor: "cyan",
                    flex: 1}]} onPress={() => setVisible2(false)}>
                    <Text style = {{fontSize: RFValue(14)}}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.entrarButton, {backgroundColor: "#e24646ff", flex: 1,}]}>
                    <Text style = {{fontSize: RFValue(14)}}>Apagar conta</Text>
                  </TouchableOpacity>
                </View>
             </View>
            </View>

          </BlurView>
        </Modal>


        <View style = {{flexDirection: "row", justifyContent: "space-between", paddingBottom: 8}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start", left: 20, marginTop: 20, gap: 5}}>
          <Text style={{color: "white", fontSize: RFValue(25), fontWeight: "bold"}}>Meu</Text>
          <Text style={{color: "cyan", fontSize: RFValue(25), fontWeight: "bold"}}>Perfil</Text>
		    </View>
      </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <BlurTargetView ref={containerRef}>
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
                  <Text style={[styles.barbname, {fontSize: RFValue(18),}]}>
                    {name}
                  </Text>
                  <Text style={{color: "gray", fontSize: RFValue(15)}}>cliente</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setVisible(true)}>
              <Ionicons name="pencil-sharp" color="cyan" size={RFValue(18)}/>
            </TouchableOpacity>
          </View>
          <View style={styles.settingOptions}>
            <TouchableOpacity style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Telemóvel</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>945 252 451</Text>
            </TouchableOpacity>
            <View style={styles.settingsOption}>
                <Text style={{color: "white", fontSize: RFValue(15)}}>Cliente de</Text>
                <Text style={{color: "gray", fontSize: RFValue(15)}}>Nome da Barbearia</Text>
            </View>
          </View>
          </BlurTargetView>
        </ScrollView>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 7, width: "90%"}]} onPress={signOut}>
          <Text>Terminar Sessão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.entrarButton, {alignSelf: "center", marginBottom: 100, backgroundColor: "#e24646ff", width: "90%"}]}
        onPress={() => setVisible2(true)} >
          <Text>Apagar conta</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}
