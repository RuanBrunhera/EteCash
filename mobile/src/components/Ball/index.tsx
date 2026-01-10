import React from "react";
import { View } from "react-native";
import { style } from "./styles";

type Props = {
    color:string
}

export default function Ball({...rest}:Props) {
    return(
        <View style={[style.ball,{borderColor:rest.color||'gray'}]} />
    ) 
}