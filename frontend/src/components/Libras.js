// src/components/Libras.js
import React, { useEffect } from 'react';

const Libras = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
      new window.VLibras.Widget('https://vlibras.gov.br/app');

      // Aguarda o carregamento do VLibras para aplicar estilo
      const interval = setInterval(() => {
        const plugin = document.querySelector('.vw-plugin-top-wrapper');
        if (plugin) {
          plugin.style.position = 'fixed';
          plugin.style.left = '50%';
          plugin.style.bottom = '40px';
          plugin.style.transform = 'translateX(-50%)';
          plugin.style.zIndex = '9999';
          plugin.style.maxWidth = '350px';
          clearInterval(interval); // Para de tentar aplicar depois que encontrar
        }
      }, 500); // tenta aplicar a cada meio segundo
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div vw className="enabled" style={{ marginTop: '20px' }}>
      <div vw-access-button className="active"></div>
      <div vw-plugin-wrapper>
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
};

export default Libras;
