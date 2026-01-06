import React, { useContext } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { style } from "./styles";
import { AntDesign, FontAwesome, Entypo, MaterialIcons } from "@expo/vector-icons";
import { temas } from "../../global/themes";
import { AuthContextList } from "../../context/authContext_list";

export default({state, navigation})=>{

    const {onOpen} = useContext<any>(AuthContextList)

    const goTo = (screenName:String)=>{
        navigation.navigate(screenName)
    }

    return(
        <View style={style.tabArea}>
            <TouchableOpacity 
            style={style.tabItem} 
            onPress={()=>goTo("Home")}>
                <AntDesign 
                    name="home"
                    style={{opacity:state.index === 0?1:0.3, color: temas.colors.primary,fontSize: 32}}
                />
            </TouchableOpacity>
            <TouchableOpacity 
            style={style.tabItemButton}
            onPress={()=>onOpen()}
            >
                <View style={{width: '100%', left:10, top:4}}>
                    <Entypo
                        name="plus"
                        size={40}
                        color={"white"}
                    />
                </View>
                <View style={{flexDirection: 'row-reverse', width: "100%", right:10, bottom:10}}>
                    <MaterialIcons
                        name="attach-money"
                        style={{color: 'white'}}
                        size={30}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
            style={style.tabItem}
            onPress={()=>goTo("User")}>
                <FontAwesome
                    name="user"
                    style={{opacity:state.index === 1?1:0.3, color: temas.colors.primary,fontSize: 32}}
                />
            </TouchableOpacity>
        </View>
    )
} 