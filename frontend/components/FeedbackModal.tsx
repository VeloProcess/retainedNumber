'use client'

import { useState } from 'react'

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

interface FeedbackModalProps {
  number: NumberData
  status: string
  onClose: () => void
  onSubmit: (comentario: string) => void
}

export default function FeedbackModal({
  number,
  status,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comentario.trim()) {
      setError('Por favor, preencha o campo de comentário')
      return
    }

    onSubmit(comentario.trim())
  }

  const getStatusColor = () => {
    switch (status) {
      case 'Contato efetuado':
        return 'bg-green-600'
      case 'Tentativa falha':
        return 'bg-yellow-600'
      case 'Número inválido':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Registrar Feedback</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Número:</span> {number.numero}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Data/Hora:</span> {number.data} {number.hora}
            </div>
            <div className="mt-4">
              <span className={`inline-block px-4 py-2 rounded text-white font-semibold ${getStatusColor()}`}>
                {status}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
                Comentário <span className="text-red-600">*</span>
              </label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => {
                  setComentario(e.target.value)
                  setError('')
                }}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva o resultado do contato ou motivo do status..."
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

