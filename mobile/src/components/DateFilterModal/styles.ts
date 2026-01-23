import { StyleSheet } from 'react-native'
import { temas } from '../../global/themes'

export const style = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: temas.colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },

  clear: {
    fontSize: 16,
    color: temas.colors.gray,
  },

  apply: {
    fontSize: 16,
    fontWeight: 'bold',
    color: temas.colors.primary,
  },
})
