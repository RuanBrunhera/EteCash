export type PropCard = {
  item: number
  title: string
  description: string
  paymentType: string
  time: Date,
  flag: PropFlags
}

export interface AuthContextType {
  depositoList: PropCard[]
  onOpen: () => void
  handleDelete: Function
  applyFilters: (params: {
    month: number | null
    year: number | null
    paymentType: string | null
    movementType: 'crédito' | 'débito' | null
  }) => void
}

export type PropFlags = 'crédito' | 'débito'

export type MovementType = 'crédito' | 'débito'