import { StyleSheet } from 'react-native'
import { temas } from '../../global/themes'

export const style = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: temas.colors.primary,
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: temas.colors.lightgray,
  },

  chipSelected: {
    backgroundColor: temas.colors.primary,
  },

  text: {
    color: '#333',
    fontSize: 14,
  },

  textSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
})
