import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import BottomRoutes from "./bottom.routes";

const Stack = createStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{headerShown: false,
                    cardStyle:{
                        backgroundColor: 'white'
                    }
                }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
            />

            <Stack.Screen
                name="BottomRoutes"
                component={BottomRoutes}
            />
        </Stack.Navigator>
    )
}