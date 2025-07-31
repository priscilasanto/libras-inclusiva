import React, { useEffect } from 'react';
import Transcription from './components/Transcription';

function App() {
  useEffect(() => {
    // Inicializa o VLibras
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  }, []);

  return (
    <div className="App" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h1>Teacher Talk</h1>
      <h2>Palestra do Professor</h2>
      <Transcription />
    </div>
  );
}

export default App;
