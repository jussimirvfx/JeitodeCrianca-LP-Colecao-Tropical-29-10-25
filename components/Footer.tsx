
import React from 'react';
import { FacebookIcon, InstagramIcon } from '../constants';


const Logo: React.FC = () => (
    <img 
        src="/images/logo.webp" 
        alt="Logo Jeito de Criança"
        className="w-48"
        loading="lazy"
        decoding="async"
        width="192"
        height="64"
    />
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
            <div className="flex-1 flex flex-col items-center md:items-start">
                <Logo />
                <p className="text-gray-300 mt-4 max-w-xs text-sm">Moda infantil que veste com amor, conforta com qualidade e vende com sucesso.</p>
            </div>
            <div className="flex-1">
                <p className="text-gray-300 text-sm">&copy; 2025, Agência VFX. Todos os direitos reservados.</p>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-end">
                <p className="text-gray-300 mb-2 font-semibold">REDES SOCIAIS</p>
                <div className="flex justify-center md:justify-start space-x-4">
                    <a href="https://www.facebook.com/jeitodecrianca.galeramix/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors"><FacebookIcon /></a>
                    <a href="https://www.instagram.com/jeitodecrianca.club/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors"><InstagramIcon /></a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
