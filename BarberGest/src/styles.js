import { StyleSheet, Dimensions } from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

const {width, height} = Dimensions.get("screen");


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#000000",
    },
    formContainer: {
        gap: 10,
        //marginTop: 20,
    },
    title: {
        fontSize: RFValue(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 20,
    },
    title2: {
        fontSize: RFValue(25),
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    title3: {
        fontSize: RFValue(11),
        color: "white",
        textAlign: "center",
        marginTop: 20,
    },
    title4: {
        fontSize: RFValue(15),
        fontWeight: "bold",
        color: "white",
        marginTop: 5,
    },
    title5: {
        fontSize: RFValue(15),
        fontWeight: "bold",
        color: "white",
        textAlign: "left",
        paddingLeft: 10,
        marginTop: 20,
        marginBottom: 10,
    },
    inputContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#141414ff",
        borderColor: "#1b1b1bff",
        borderWidth: 2,
        width: 300,
        alignSelf: "center",
        gap: 25,
        padding: 20,
        borderRadius: 30
    },
    input:
    {
        backgroundColor: "#363636ff",
        borderColor: "#4d4d4dff",
        borderWidth: 2,
        padding: 10,
        borderRadius: 50,
        width: 250,
        color: "white",
    },
    entrarButton: {
        marginTop: 10,
        backgroundColor: "cyan",
        borderColor: "#0b9e9eff",
        borderWidth: 2,
        width: 250,
        padding: 10,
        borderRadius: 50,
        alignItems: "center"
    },
    link: {
        color: "cyan",
        textDecorationLine: "underline",
        textAlign: "center",
        marginTop: 10,
        fontWeight: "bold",
    },
    barCard:{
        /* backgroundColor: "#141414ff",
        borderColor: "#1d1d1dff",
        borderWidth: 2,*/
        //padding: 20, 
        borderRadius: 30,
        height: height * .25,
        width: width * .45,
        marginHorizontal: 10,
    },
    barCard2:{
        backgroundColor: "#141414ff",
        borderColor: "#1d1d1dff",
        padding: 20,
        borderRadius: 30,
        height: 180,
        width: "100%",
        //marginRight: 10,
    },
    barCard3:{
        backgroundColor: "#141414ff",
        borderColor: "#1d1d1dff",
        borderWidth: 2,
        padding: 10,
        borderRadius: 40,
        gap: 10,
        marginHorizontal: 5,
        height: 70,
        /* width: 180, */
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
        //marginRight: 10,
    },
    barbname: {
        fontSize: RFValue(15),
        fontWeight: "bold",
        color: "white",
        marginTop: 10,
    },
    startTime: {
        fontSize: RFValue(12),
        color: "white",
        marginTop: 5,
    },
    barbImageCard:
    {
        borderWidth: 2,
        width: "95%",
        borderRadius: 30,
        alignSelf: "center",
        marginTop: 20,
    },
    barbImg:
    {
        width: "100%",
        height: 180,
        borderRadius: 30,
        alignSelf: "center",
    },
    barbImg2:
    {
        width: 50,
        height: 50,
        borderRadius: 25,
        //alignSelf: "center",
    },
    userImag:
    {
        backgroundColor: "#141414ff",
        borderColor: "#1d1d1dff",
        borderWidth: 2,
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 20,
        marginRight: 20,
    },
    footer:
    {
        backgroundColor: "cyan",
        borderColor: "#0b9e9eff",
        borderWidth: 2,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: 300,
        bottom: 30,
        alignSelf: "center",
        paddingRight: 30,
        paddingLeft: 30,
        borderRadius: 30,
        position: "absolute",
    },
    blur: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
    },
    wrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    barbInfo:
    {
        padding: 15,
    },
    bar:
    {
        width: "90%",
        alignSelf: "center",
    },
    scheduleInfo:
    {

    },
    serviceImgCard:
    {
        backgroundColor: "#141414ff",
        width: "90%",
        height: height * 0.20,
        alignSelf: "center",
        borderRadius: 20,
    }
    /* barbImageCard:
    {
        backgroundColor: "#141414ff",
        borderColor: "#1d1d1dff",
        borderBottomColor: "#000000ff",
        borderWidth: 2,
        width: "90%",
        height: 180,
        borderRadius: 30,
        alignSelf: "center",
        marginTop: 20,
    }, */
});

export default styles;