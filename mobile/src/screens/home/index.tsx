import React, { useContext } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

import { style } from "./styles"
import { Input } from "../../components/Input"
import Ball from "../../components/Ball"
import Flag from "../../components/Flag"
import { temas } from "../../global/themes"

import { AuthContextList } from "../../context/authContext_list"
import type { AuthContextType, PropCard } from "../../global/Props"

export default function HomeScreen() {
  const { depositoList } = useContext<AuthContextType>(AuthContextList)

  const _renderCard = ({ item }: { item: PropCard }) => {
    const colorFlag =
      item.flag === "crédito" ? temas.colors.green : temas.colors.red

    return (
      <TouchableOpacity style={style.card}>
        <View style={style.rowCard}>
          <View style={style.rowCardLeft}>
            <Ball color={colorFlag} />
            <View>
              <Text style={style.titleCard}>{item.title}</Text>
              <Text style={style.descriptionCard}>{item.description}</Text>
            </View>
          </View>
          <Flag caption={item.flag} color={colorFlag} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.greeting}>
          Bom dia, <Text style={{ fontWeight: "bold" }}>Ruan</Text>
        </Text>

        <View style={style.boxInput}>
          <Input IconLeft={MaterialIcons} IconLeftName="search" />
        </View>
      </View>

      <View style={style.boxList}>
        <Text>Histórico</Text>

        <FlatList
          data={depositoList}
          keyExtractor={(item) => String(item.item)}
          renderItem={_renderCard}
          style={{ marginTop: 40, paddingHorizontal: 30 }}
        />
      </View>
    </View>
  )
}
