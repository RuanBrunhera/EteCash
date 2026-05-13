import { StyleSheet } from "react-native";
import { temas } from "../../global/themes";

export const style = StyleSheet.create({
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
    titleInput:{
        marginLeft: 5,
        color: temas.colors.gray,
        marginTop: 20
    },
    Icon:{
        width: '100%',
    },
    Button:{
        width: '10%',
    },
})