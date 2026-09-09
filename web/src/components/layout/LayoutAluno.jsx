import LayoutBase from './LayoutBase'
import { itemsAluno } from '../../config/navigationConfig'

function LayoutAluno({ children }) {
  return (
    <LayoutBase items={itemsAluno} storageKey="sidebar-open" tipoUsuario="aluno">
      {children}
    </LayoutBase>
  )
}

export default LayoutAluno