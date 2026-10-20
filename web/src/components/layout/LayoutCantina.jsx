import LayoutBase from './LayoutBase'
import { itemsCantina, itemAdminNoMenuCantina } from '../../config/navigationConfig'

function LayoutCantina({ children }) {
  const items =
    localStorage.getItem('role') === 'admin'
      ? [...itemsCantina, itemAdminNoMenuCantina]
      : itemsCantina

  return (
    <LayoutBase items={items} storageKey="sidebar-cantina-open" tipoUsuario="funcionario">
      {children}
    </LayoutBase>
  )
}

export default LayoutCantina