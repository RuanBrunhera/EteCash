export type PropFlags = 'crédito' | 'débito'

export type PropCard = {
  item: number
  title: string
  description: string
  flag: PropFlags
}

export interface AuthContextType {
  depositoList: PropCard[]
  onOpen: () => void
}
