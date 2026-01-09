'use client'

interface NumberData {
  rowIndex: number
  chamada: string
  data: string
  hora: string
  pais: string
  ddd: string
  numero: string
  cpfCnpj: string
  idLigacao: string
  status: string
  quemRegistrou: string
  timestamp: string
}

interface NumberListProps {
  numbers: NumberData[]
  onFeedbackClick: (number: NumberData, status: string) => void
}

export default function NumberList({ numbers, onFeedbackClick }: NumberListProps) {
  return (
    <div className="space-y-4">
      {numbers.map((number) => (
        <div
          key={number.rowIndex}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {number.numero}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Data:</span> {number.data}
                </div>
                <div>
                  <span className="font-semibold">Hora:</span> {number.hora}
                </div>
                {number.ddd && (
                  <div>
                    <span className="font-semibold">DDD:</span> {number.ddd}
                  </div>
                )}
                {number.pais && (
                  <div>
                    <span className="font-semibold">País:</span> {number.pais}
                  </div>
                )}
              </div>
              {number.cpfCnpj && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">CPF/CNPJ:</span> {number.cpfCnpj}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onFeedbackClick(number, 'Contato efetuado')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
              >
                Contato Efetuado
              </button>
              <button
                onClick={() => onFeedbackClick(number, 'Tentativa falha')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm font-medium"
              >
                Tentativa Falha
              </button>
              <button
                onClick={() => onFeedbackClick(number, 'Número inválido')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
              >
                Número Inválido
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

