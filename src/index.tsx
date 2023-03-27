import { createRoot } from 'react-dom/client';
import App from './App';
import AuthProvider from './store/authProvider';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root') as
  | Element
  | DocumentFragment;

const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
