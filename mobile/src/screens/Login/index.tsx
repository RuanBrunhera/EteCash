import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Alert
} from "react-native";
import { style } from "./styles";
import { temas } from "../../global/themes";
import etecash_logo from "../../assets/etecash_logo.png";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function Login() {
  const [rm, setRm] = useState('a');
  const [password, setPassword] = useState('a');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigation<NavigationProp<any>>();

  async function getLogin() {
    try {
      setLoading(true);
      
      if (!rm || !password) {
        return Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      }

        navigator.reset({routes:[{name:"BottomRoutes"}]});

        console.log('Logado com sucesso');
        
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Text style={style.titulo}>Bem vindo à</Text>
        <Image
          source={etecash_logo}
          style={style.logoLogin}
          resizeMode="contain"
        />
      </View>

      <View style={style.boxMid}>
        {/* INPUT DO RM */}
        <Input
          value={rm}
          onChangeText={setRm}
          title="Insira o RM do(a) aluno(a)"
          IconRight={MaterialIcons}
          IconRightName="email"
        />

        {/* INPUT DA SENHA */}
        <Input
          value={password}
          onChangeText={setPassword}
          title="Insira sua senha"
          IconRight={Octicons}
          IconRightName={showPassword ? "eye-closed" : "eye"}
          secureTextEntry={!showPassword}
          onIconRightPress={()=>setShowPassword(!showPassword)}
        />
      </View>
      <Button
        text="ENTRAR"
        loading={loading}
        onPress={()=>getLogin()}
      />

      <Text style={style.textBottom}>
        Não tem conta?{" "}
        <Text style={{ color: temas.colors.primary }}>
          Vá na direção dar uma olhada
        </Text>
      </Text>
    </View>
  );
}
