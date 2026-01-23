import { Dimensions, StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    header:{
        width: '100%',
        height: Dimensions.get("window").height/4,
        backgroundColor: temas.colors.primary,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    greeting:{
        fontSize: 20,
        color: 'white',
        marginTop: 30,
    },
    boxInput:{
        width: '80%',
        paddingHorizontal: 20,
        marginTop: 10
    },
    boxList:{
        flex: 1,
        width: '100%',
    },
    card:{
        width: '100%',
        minHeight: 60,
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
    },
    button:{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginVertical: 10,
        borderRadius: 10,
    },
    textHistorico:{
        fontSize: 25,
        paddingHorizontal: 20,
        marginTop: 20,
        
    },
    textSaldo:{
        fontSize: 25,
        color: 'white',
        marginTop: 30,
    },
    saldo:{
        fontSize: 23,
        color: 'white',
        marginTop: 5,
        paddingHorizontal: 20
    },
})