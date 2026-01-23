import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { style } from "./styles"
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function UserScreen(){
    const navigation = useNavigation<NavigationProp<any>>();
    
    const handleLogout = () => {
        Alert.alert("Logout", "Você saiu da conta");
        return navigation.reset({routes:[{name : "Login" }]});
    }

    return(
            <View style={style.container}>
                <Text style={style.name}>Ruan lindo demais</Text>
                <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
                    <Ionicons
                        name='exit'
                        style={{color: 'gray'}}
                        size={40}
                    />
                </TouchableOpacity>
            </View>
    )
}