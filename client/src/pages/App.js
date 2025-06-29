import React from 'react';
import { UserProvider } from '../shared/context/UserContext';

function App() {
  return (
    <UserProvider>
      {/* ...resto de la app... */}
    </UserProvider>
  );
}

export default App; 