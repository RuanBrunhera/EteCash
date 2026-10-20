import LayoutBase from './LayoutBase'
import { itemsAdmin } from '../../config/navigationConfig'

function LayoutAdmin({ children }) {
  return (
    <LayoutBase items={itemsAdmin} storageKey="sidebar-admin-open" tipoUsuario="funcionario">
      {children}
    </LayoutBase>
  )
}

export default LayoutAdmin