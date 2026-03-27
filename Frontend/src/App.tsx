import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewtonPage } from './pages/NewtonPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <NewtonPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
