import React, { useContext, useState } from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { AuthContextList } from '../../context/authContext_list'
import { ChipSelect } from '../ChipSelect'
import { AntDesign } from '@expo/vector-icons'
import { style } from './styles'

type Props = {
  visible: boolean
  onClose: () => void
  month: number | null
  year: number | null
  onChangeMonth: (value: number | null) => void
  onChangeYear: (value: number | null) => void
}


export function DateFilterModal({
  visible,
  onClose,
  month,
  year,
  onChangeMonth,
  onChangeYear,
}: Props) {


  // Opções de mês
  const months = [
    { label: 'Jan', value: 0 },
    { label: 'Fev', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Abr', value: 3 },
    { label: 'Mai', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6 },
    { label: 'Ago', value: 7 },
    { label: 'Set', value: 8 },
    { label: 'Out', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dez', value: 11 },
  ]

  // Opções de ano (pode adaptar depois)
  const years = [2023, 2024, 2025, 2026].map(y => ({
    label: String(y),
    value: y,
  }))

  // Aplica filtro
  const handleApply = () => {
  onClose()
}

const handleClear = () => {
  onChangeMonth(null)
  onChangeYear(null)
  onClose()
}


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={style.overlay}>
        <View style={style.container}>
          <Text style={style.title}>Filtrar por período</Text>
          <ChipSelect
  label="Mês"
  options={months}
  value={month}
  onChange={onChangeMonth}
/>

<ChipSelect
  label="Ano"
  options={years}
  value={year}
  onChange={onChangeYear}
/>


          <View style={style.actions}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={style.clear}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleApply}>
              <Text style={style.apply}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
