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
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNumbers()
    }
  }, [status, session])

  const fetchNumbers = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      // Limpar números anteriores para mostrar que está atualizando
      if (showRefreshing) {
        // Não limpar, apenas mostrar loading
      }
      
      // Adicionar timestamp para evitar cache e garantir dados atualizados
      const timestamp = new Date().getTime()
      console.log(`🔄 Buscando dados atualizados da planilha (timestamp: ${timestamp})...`)
      
      const response = await axios.get(`/api/numbers?t=${timestamp}&_=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      // Atualizar estado com os novos dados (sempre substituir, não fazer merge)
      const newNumbers = response.data || []
      setNumbers(newNumbers)
      console.log(`✅ Dados atualizados com sucesso: ${newNumbers.length} números encontrados`)
      
      if (showRefreshing) {
        console.log('🔄 Lista atualizada da planilha!')
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar números:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido'
      alert(`Erro ao carregar números da planilha: ${errorMessage}`)
    } finally {
      setLoading(false)
      setRefreshing(false)
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
      console.log('📝 Enviando feedback:', {
        rowIndex: selectedNumber.rowIndex,
        status: selectedStatus,
        comentario,
        userEmail: session.user.email
      })
      
      const response = await axios.post('/api/feedback', {
        rowIndex: selectedNumber.rowIndex,
        status: selectedStatus,
        comentario,
        userEmail: session.user.email,
      })

      console.log('✅ Feedback enviado com sucesso:', response.data)

      // Remover número da listagem
      setNumbers(numbers.filter((n) => n.rowIndex !== selectedNumber.rowIndex))
      setShowModal(false)
      setSelectedNumber(null)
      setSelectedStatus('')
      
      alert('Feedback registrado com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao registrar feedback:', error)
      console.error('Resposta do erro:', error.response?.data)
      
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido'
      const errorDetails = error.response?.data?.error || 'Erro ao registrar feedback'
      
      alert(`Erro ao registrar feedback: ${errorDetails}\n\nDetalhes: ${errorMessage}`)
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
            <button
              onClick={() => fetchNumbers(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              title="Atualizar dados da planilha"
            >
              <svg
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
            </button>
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
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total de números pendentes: {numbers.length}
              </div>
              <button
                onClick={() => fetchNumbers(true)}
                disabled={refreshing || loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                title="Atualizar dados da planilha"
              >
                <svg
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </button>
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

