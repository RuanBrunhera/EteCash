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
    titleInput:{
        marginLeft: 5,
        color: temas.colors.gray,
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
    boxInput:{
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 40,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: temas.colors.lightgray,
        borderColor: temas.colors.lightgray,
    },
    input:{
        height: '100%',
        width: '90%',
        borderRadius: 40,
        paddingLeft: 5
    },
    button:{
        width: 250,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: temas.colors.primary,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,    
    },
    textButton:{
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    textBottom:{
        fontSize: 16,
        color: temas.colors.gray,
        textAlign: 'center', // Centraliza o texto
        paddingHorizontal: 20, // Adiciona padding horizontal
        paddingBottom: 10, // Espaçamento da borda inferior
    },
})