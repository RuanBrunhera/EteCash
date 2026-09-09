import LayoutBase from './LayoutBase'
import { itemsCantina } from '../../config/navigationConfig'

function LayoutCantina({ children }) {
  return (
    <LayoutBase items={itemsCantina} storageKey="sidebar-cantina-open" tipoUsuario="funcionario">
      {children}
    </LayoutBase>
  )
}

export default LayoutCantina