'use client'

import { useSession, signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import NumberList from '@/components/NumberList'
import FeedbackModal from '@/components/FeedbackModal'

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

export default function Home() {
  const { data: session, status } = useSession()
  const [numbers, setNumbers] = useState<NumberData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNumber, setSelectedNumber] = useState<NumberData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNumbers()
    }
  }, [status, session])

  const fetchNumbers = async () => {
    try {
      setLoading(true)
      // Backend agora usa Service Account, não precisa mais do token OAuth
      const response = await axios.get('http://localhost:9080/api/numbers')
      setNumbers(response.data)
    } catch (error) {
      console.error('Erro ao buscar números:', error)
      alert('Erro ao carregar números da planilha')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackClick = (number: NumberData, status: string) => {
    setSelectedNumber(number)
    setSelectedStatus(status)
    setShowModal(true)
  }

  const handleFeedbackSubmit = async (comentario: string) => {
    if (!selectedNumber || !session?.user?.email) return

    try {
      // Backend agora usa Service Account, não precisa mais do token OAuth
      await axios.post('http://localhost:9080/api/feedback', {
        rowIndex: selectedNumber.rowIndex,
        status: selectedStatus,
        comentario,
        userEmail: session.user.email,
      })

      // Remover número da listagem
      setNumbers(numbers.filter((n) => n.rowIndex !== selectedNumber.rowIndex))
      setShowModal(false)
      setSelectedNumber(null)
      setSelectedStatus('')
      
      alert('Feedback registrado com sucesso!')
    } catch (error) {
      console.error('Erro ao registrar feedback:', error)
      alert('Erro ao registrar feedback')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Sistema de Números Fora Do Horário</h1>
          <p className="text-gray-600 mb-6">Faça login com sua conta Google para continuar</p>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Números Fora Do Horário</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session?.user?.email}
            </span>
            <button
              onClick={() => window.location.href = '/api/auth/signout'}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl">Carregando números...</div>
          </div>
        ) : numbers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">
              Nenhum número pendente encontrado
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Total de números pendentes: {numbers.length}
            </div>
            <NumberList
              numbers={numbers}
              onFeedbackClick={handleFeedbackClick}
            />
          </>
        )}
      </main>

      {showModal && selectedNumber && (
        <FeedbackModal
          number={selectedNumber}
          status={selectedStatus}
          onClose={() => {
            setShowModal(false)
            setSelectedNumber(null)
            setSelectedStatus('')
          }}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  )
}

