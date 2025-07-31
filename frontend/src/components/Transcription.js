import React, { useState, useEffect, useRef } from 'react';

function Transcription() {
  const [capturedText, setCapturedText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const fullTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de fala.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      const prevWords = fullTranscriptRef.current.trim().split(/\s+/);
      const newWords = transcript.split(/\s+/);

      // Detecta sobreposição de palavras repetidas
      let overlap = 0;
      const maxCheck = Math.min(prevWords.length, newWords.length);
      for (let i = 1; i <= maxCheck; i++) {
        const endSlice = prevWords.slice(-i).join(' ');
        const startSlice = newWords.slice(0, i).join(' ');
        if (endSlice === startSlice) {
          overlap = i;
        }
      }

      const uniquePart = newWords.slice(overlap).join(' ');
      fullTranscriptRef.current = (fullTranscriptRef.current + ' ' + uniquePart).trim();
      setCapturedText(fullTranscriptRef.current);
    };

    recognition.onerror = (event) => {
      console.error('Erro:', event.error);
      if (event.error === 'no-speech') {
        recognition.stop();
        setListening(false);
      }
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [listening]);

  const handleStart = () => {
    if (recognitionRef.current && !listening) {
      fullTranscriptRef.current = '';
      setCapturedText('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleStop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h3 style={{ color: '#1565c0' }}>Transcrição de Fala em Tempo Real</h3>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleStart}
          disabled={listening}
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            marginRight: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Iniciar
        </button>

        <button
          onClick={handleStop}
          disabled={!listening}
          style={{
            backgroundColor: '#ef5350',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Parar
        </button>
      </div>

      <h4 style={{ color: '#0d47a1' }}>Texto capturado:</h4>
      <div
        id="conteudo-vlibras"
        style={{
          backgroundColor: '#e3f2fd',
          color: '#0d47a1',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px',
          minHeight: '120px',
          fontSize: '18px',
          lineHeight: '1.5',
          textAlign: 'left',
        }}
      >
        {capturedText}
      </div>
    </div>
  );
}

export default Transcription;
