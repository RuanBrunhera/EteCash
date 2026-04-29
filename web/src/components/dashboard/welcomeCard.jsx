import quandale from '../../assets/knpgsvnouo191.jpg';

function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        {/* Lado esquerdo - Texto */}
        <div className="max-w-xl md:w-3/5">
          <h1 className="text-3xl font-semibold">Bem-vindo ao EteCash!</h1>
          <p className="mt-2 text-sm leading-6 text-white/90">
            Sistema de pagamentos digitais da cantina escolar.
          </p>
          <div className="mt-10 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-sm">
            <span className="text-2xl font-bold">R$</span>
            <div>
              <div className="font-medium">Saldo atual</div>
              <div className="text-white/80">R$ 1.000,00</div>
            </div>
          </div>
        </div>

        {/* Lado direito - Imagem */}
        <div className="relative lg:w-2/5">
          <div className="relative w-full h-64 md:h-full min-h-[250px]">
            <img
              src={quandale}
              alt="Ilustração cantina"
              className="w-full h-full object-cover rounded-2xl opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Efeito de blur decorativo */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
    </section>
  )
}

export default WelcomeCard