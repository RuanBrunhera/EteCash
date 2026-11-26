import CarrinhoVenda from '../../../components/venda/CarrinhoVenda'

export default function VendasCantina() {
  return ( 
    <div className='p-4 sm:p-6 lg:p-8'>
      <h1 className='mb-6 text-xl font-semibold text-white'>Efetuar venda</h1>
      <CarrinhoVenda />
    </div>
  )
}