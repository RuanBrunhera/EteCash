import React, { useContext, useRef, useEffect, useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { Swipeable } from "react-native-gesture-handler"

import { style } from "./styles"
import { Input } from "../../components/Input"
import Ball from "../../components/Ball"
import Flag from "../../components/Flag"
import { temas } from "../../global/themes"

import { AuthContextList } from "../../context/authContext_list"
import type { AuthContextType, PropCard, MovementType } from "../../global/Props"
import { DateFilterModal } from "../../components/DateFilterModal"
import { ChipSelect } from "../../components/ChipSelect"

export default function HomeScreen() {
  const {
    depositoList,
    handleDelete,
    applyFilters,
  } = useContext<AuthContextType>(AuthContextList)

  const swipeableRefs = useRef<Array<Swipeable | null>>([])

  /** --------------------
   *  Estados de filtro
   * ------------------- */
  const [showDateFilter, setShowDateFilter] = useState(false)

  const [month, setMonth] = useState<number | null>(null)
  const [year, setYear] = useState<number | null>(2025)

  const [paymentType, setPaymentType] = useState<string | null>(null)
  const [movementType, setMovementType] = useState<MovementType | null>(null)

  const paymentOptions = [
  { label: 'Pix', value: 'Pix' },
  { label: 'Boleto', value: 'Boleto' },
]

 const movementOptions: {label: string; value: MovementType}[] = [
  { label: 'Débito', value: 'débito' },
  { label: 'Crédito', value: 'crédito' },
];


  /** --------------------
   *  Aplica filtros
   * ------------------- */
  useEffect(() => {
    applyFilters({
      month,
      year,
      paymentType,
      movementType,
    })
  }, [month, year, paymentType, movementType])

  /** --------------------
   *  Render card
   * ------------------- */
  const renderCard = ({ item, index }: { item: PropCard; index: number }) => {
    const colorFlag =
      item.flag === "crédito" ? temas.colors.green : temas.colors.red

    const renderRightActions = () => (
      <View style={style.button}>
        <AntDesign name="delete" size={20} color="#FFF" />
      </View>
    )

    const handleSwipeOpen = (direction: "right" | "left") => {
      if (direction === "right") {
        handleDelete(item)
        swipeableRefs.current[index]?.close()
      }
    }

    return (
      <Swipeable
  ref={(ref) => {
    swipeableRefs.current[index] = ref
  }}
  renderRightActions={renderRightActions}
  onSwipeableOpen={handleSwipeOpen}
>

        <View style={style.card}>
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              <Ball color={colorFlag} />
              <View>
                <Text style={style.titleCard}>{item.title}</Text>
                <Text style={style.descriptionCard}>{item.description}</Text>
                <Text style={style.descriptionCard}>{item.time.toLocaleDateString('pt-BR')}</Text>
                <Text style={style.descriptionCard}>{item.paymentType}</Text>
              </View>
            </View>
            <Flag caption={item.flag} color={colorFlag} />
          </View>
        </View>
      </Swipeable>
    )
  }

  return (
    <View style={style.container}>
      {/* HEADER */}
      <View style={style.header}>
        <Text style={style.greeting}>
          Bem vindo(a), <Text style={{ fontWeight: "bold" }}>Usuário(a)</Text>
        </Text>

        <View>
          <Text style={style.textSaldo}>Saldo disponível:</Text>
          <Text style={style.saldo}>R$ 1000,00</Text>
        </View>
      </View>

      {/* LISTA */}
      <View style={style.boxList}>
        <Text style={style.textHistorico}>Histórico de transações:</Text>

        {/* FILTRO DATA */}
        <TouchableOpacity
          style={style.boxInput}
          onPress={() => setShowDateFilter(true)}
        >
          <Input
            IconLeft={MaterialIcons}
            IconLeftName="date-range"
            placeholder="Filtrar por mês / ano"
            editable={false}
          />
        <ChipSelect
  label="Filtrar por método de pagamento"
  options={paymentOptions}
  value={paymentType}
  onChange={setPaymentType}
/>
        <ChipSelect
  label="Filtrar por tipo de transação"
  options={movementOptions}
  value={movementType}
  onChange={setMovementType}
/>
        </TouchableOpacity>

        <FlatList
          data={depositoList}
          keyExtractor={(item) => String(item.item)}
          renderItem={renderCard}
          style={{ marginTop: 40, paddingHorizontal: 30 }}
        />
      </View>

      {/* MODAL DE DATA */}
      <DateFilterModal
        visible={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        month={month}
        year={year}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
      />
    </View>
  )
}
