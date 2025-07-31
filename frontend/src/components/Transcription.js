import React, { useState, useEffect, useRef } from 'react';

function Transcription() {
  const [capturedText, setCapturedText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setCapturedText((prevText) =>
        prevText.endsWith(text.trim()) ? prevText : prevText + ' ' + text.trim()
      );
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
          fontSize: '18px'
        }}
      >
        {capturedText}
      </div>
    </div>
  );
}

export default Transcription;
setCapturedText((prevText) => {
  const updatedText = prevText.endsWith(text.trim())
    ? prevText
    : prevText + ' ' + text.trim();

  // Força o VLibras a reprocessar o texto
  setTimeout(() => {
    const container = document.getElementById('conteudo-vlibras');
    if (container) {
      const temp = container.innerHTML;
      container.innerHTML = '';
      container.innerHTML = temp;
    }
  }, 300);

  return updatedText;
});
