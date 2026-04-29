function StatCard({ title, value, icon: Icon, color }) {
  
  const colors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  red: 'text-red-500',
}

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border">
      {/* Seu desafio: montar o card com título, valor e ícone */}
      <p className="text-sm text-gray-500">{title}</p>
      <Icon size={24} color={colors[color]}/>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
  )
}

export default StatCard