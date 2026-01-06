import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home";
import UserScreen from "../screens/user";
import CustomTabBar from "../components/CustomTabBar";
import { AuthProviderList } from "../context/authContext_list";

const Tab = createBottomTabNavigator();

export default function BottomRoutes(){
    return(
        <AuthProviderList>
        <Tab.Navigator
            tabBar={props=><CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
            
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />

            <Tab.Screen
                name="User"
                component={UserScreen}
            />
        </Tab.Navigator>
    </AuthProviderList>
    )
}