import { Dimensions, StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    header:{
        width: '100%',
        height: Dimensions.get("window").height/3.5,
        backgroundColor: temas.colors.primary,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    greeting:{
        fontSize: 20,
        color: 'white',
        marginTop: 20,
    },
    boxInput:{
        width: '80%',
    },
    boxList:{
        flex: 1,
        width: '100%',
    },
    card:{
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        marginTop: 6,
        borderRadius: 10,
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: temas.colors.lightgray
    },
    rowCard:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowCardLeft:{
        width: '70%',
        flexDirection: 'row',
        gap: 30,
        alignItems: 'center'
    },
    titleCard:{
        fontSize: 16,
        fontWeight: 'bold',
    },
    descriptionCard:{
        color: temas.colors.gray
    }
})