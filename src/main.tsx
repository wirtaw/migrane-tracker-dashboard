import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Client } from 'appwrite';
import { env } from './config/env';
import './index.css';

const client = new Client();
client.setProject(env.REACT_APP_APPWRITE_PROJECT_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
