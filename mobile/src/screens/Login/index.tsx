import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { style } from "./styles";
import { temas } from "../../global/themes";
import etecash_logo from "../../assets/etecash_logo.png";
import { MaterialIcons } from "@expo/vector-icons";

export default function Login() {
  const [rm, setRm] = useState("");
  const [password, setPassword] = useState("");

  async function getLogin() {
    try {
      if (!rm || !password) {
        return Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      }

      setTimeout(() => {
        if (rm == "ruanlindo" && password == "123") {
          Alert.alert("Sucesso", "Login realizado com sucesso!");
        } else {
          Alert.alert("Erro", "RM ou senha incorretos. Tente novamente.");
        }
      }, 3000);
    } catch (error) {
      console.log(error);
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
        <Text style={style.titleInput}>RM do aluno(a)</Text>
        <View style={style.boxInput}>
          <TextInput style={style.input} value={rm} onChangeText={setRm} />
          <MaterialIcons name="email" size={20} color={"white"} />
        </View>
        <Text style={style.titleInput}>Senha do aluno(a)</Text>
        <View style={style.boxInput}>
          <TextInput
            style={style.input}
            value={password}
            onChangeText={setPassword}
          />

          <MaterialIcons name="remove-red-eye" size={20} color={"white"} />
        </View>
      </View>
      <View style={style.boxBottom}>
        <TouchableOpacity style={style.button} onPress={() => getLogin()}>
          <Text style={style.textButton}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Text style={style.textBottom}>
        Não tem conta?
        <Text style={{ color: temas.colors.primary }}>
          {" "}
          Vá na direção dar uma olhada
        </Text>
      </Text>
    </View>
  );
}
