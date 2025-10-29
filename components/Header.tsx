import React from 'react';

const Logo: React.FC = () => (
    <div className="mb-4 mt-28 lg:mt-0 drop-shadow-lg">
        <img 
            src="https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/logo-jeito-de-crianca-1-1754565023528.webp" 
            alt="Logo Jeito de Criança"
            className="w-56 md:w-72 lg:w-80 brightness-0 invert md:brightness-100 md:invert-0"
        />
    </div>
);

const Header: React.FC = () => {
  const handleCTAClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <header className="relative bg-gray-800 text-white min-h-[85vh] md:min-h-screen flex items-center justify-center md:justify-start text-center md:text-left p-8 md:px-16 lg:px-24">
      <style>
        {`
          .shine-button {
            position: relative;
            overflow: hidden;
          }
          .shine-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 75%;
            height: 100%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 100%);
            transform: skewX(-25deg);
            animation: shine 4s infinite linear;
          }
          @keyframes shine {
            from {
              left: -100%;
            }
            to {
              left: 125%;
            }
          }
        `}
      </style>
      
      {/* Background Image */}
      <img 
        src="https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/hero-jdc-tropical-2-1761745261930.webp" 
        alt="Crianças vestindo roupas da coleção Tropical Papeliê" 
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'right 0 top -2rem' }}
      />

      {/* Mobile Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:hidden z-5"></div>

      <div className="relative z-10 flex flex-col items-center md:items-start">
        <Logo />
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mt-6 mb-4 max-w-4xl uppercase text-white md:text-black">
          NOVA COLEÇÃO<br />TROPICAL 2026
          <span className="font-baloo block my-1 text-6xl sm:text-8xl md:text-[10rem] md:leading-[1] font-extrabold text-white md:text-black">PAPELIÊ</span>
        </h2>
        <p className="text-lg md:text-2xl font-light mb-8 text-white md:text-black">
          EXCLUSIVA PARA LOJISTAS
        </p>
        <button 
          onClick={handleCTAClick}
          className="shine-button bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-8 text-md md:py-4 md:px-10 md:text-lg rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
        >
          QUERO SER UM LOJISTA PARCEIRO
        </button>
      </div>
    </header>
  );
};

export default Header;