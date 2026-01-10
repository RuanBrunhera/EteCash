import React from "react";
import { View, Text } from "react-native";
import { style } from "./styles";

type Props = {
    caption:string,
    color:string,
    selected?:boolean
}

export default function Flag({...rest}:Props) {
    return(
        <View 
        style={[style.container,{backgroundColor:rest?.color},
            rest?.selected && {borderWidth: 2}
        ]}
        
        >
            <Text style={{color: 'white'}}>{rest.caption}</Text>
        </View>
    ) 
}