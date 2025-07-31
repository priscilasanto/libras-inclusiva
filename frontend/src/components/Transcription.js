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

      // Tenta detectar a quantidade de palavras repetidas no final
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
      fullTranscriptRef.current = ''; // limpa antes de iniciar nova sessão
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
    <div>
      <h3>Transcrição de Fala em Tempo Real</h3>
      <button onClick={handleStart}>Iniciar</button>
      <button onClick={handleStop} disabled={!listening}>Parar</button>

      <h4>Texto capturado:</h4>
      <div
        id="conteudo-vlibras"
        style={{
          backgroundColor: '#111',
          color: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          marginTop: '10px',
          minHeight: '100px',
          fontSize: '18px',
        }}
      >
        {capturedText}
      </div>

      {/* Avatar VLibras centralizado */}
      <div
        id="vlibras"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.2)',
          zIndex: 9999,
        }}
      ></div>
    </div>
  );
}

export default Transcription;
