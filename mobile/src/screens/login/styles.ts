import { Dimensions, StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
    container:{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'space-between', // Mudado de 'center' para 'space-between'
        backgroundColor: temas.colors.bgScreen,
        paddingVertical: 20, // Adiciona padding vertical
    },
    logoLogin:{
        width: 300,  // Reduzido de 400
        height: 400, // Reduzido de 400
    },
    titulo:{
        fontWeight: 'bold',
        fontSize: 24,
        color: temas.colors.gray,
        marginBottom: -50,
        marginTop: 20
    },
    boxTop:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: -190,
    },
    boxMid:{
        width: '100%',
        paddingHorizontal: 37,
    },
    boxBottom:{
        width: '100%',
        alignItems: 'center',
        marginTop: -50, // Espaçamento reduzido
    },
    textBottom:{
        fontSize: 16,
        color: temas.colors.gray,
        textAlign: 'center', // Centraliza o texto
        paddingHorizontal: 20, // Adiciona padding horizontal
        paddingBottom: 10, // Espaçamento da borda inferior
    },
})