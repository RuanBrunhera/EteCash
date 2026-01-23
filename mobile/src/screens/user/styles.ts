import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor:'#F8F8F8',
    },
    name:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333'
    },
    logoutButton:{
        position: 'absolute',
        bottom: 20,
        right: 20
    },
})