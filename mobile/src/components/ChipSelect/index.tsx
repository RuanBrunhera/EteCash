import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { style } from "./styles"

type Option<T> = {
  label: string
  value: T
}

type ChipSelectProps<T> = {
  label?: string
  options: Option<T>[]
  value: T | null
  onChange: (value: T | null) => void
}

export function ChipSelect<T>({
  label,
  options,
  value,
  onChange,
}: ChipSelectProps<T>) {
  const handlePress = (optionValue: T) => {
    if (optionValue === value) {
      onChange(null) // desmarca
    } else {
      onChange(optionValue)
    }
  }

  return (
    <View style={style.wrapper}>
      {label && <Text style={style.label}>{label}</Text>}

      <View style={style.container}>
        {options.map(option => {
          const selected = option.value === value

          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                style.chip,
                selected && style.chipSelected,
              ]}
              onPress={() => handlePress(option.value)}
            >
              <Text
                style={[
                  style.text,
                  selected && style.textSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
