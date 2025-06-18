
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// QueryClient 생성 및 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30초 동안 데이터를 신선하게 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리패치 비활성화
      retry: 1, // 실패 시 1번만 재시도
    },
    mutations: {
      retry: false, // 뮤테이션 실패 시 재시도 안함
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
