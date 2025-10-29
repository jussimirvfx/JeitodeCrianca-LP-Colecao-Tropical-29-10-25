
import React from 'react';
import StatsBanner from './StatsBanner';

const AboutUs: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6 uppercase">
              Sobre nós
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A Jeito de Criança carrega mais de 35 anos de trajetória na moda infantil. O que começou como uma produção local, se transformou em uma marca consolidada em todo o Brasil, com estrutura própria, logística ágil e uma operação pensada para atender lojistas de forma prática e profissional.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Hoje, somos uma empresa sinônimo de confiança. Trabalhamos com processos bem definidos, campanhas bem produzidas e um relacionamento direto que valoriza o lojista em todas as etapas, desde a apresentação da coleção até o fechamento do pedido.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex justify-center">
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.instagram.com/jeitodecrianca.club/embed"
                  className="w-full h-[480px] sm:h-[540px] border-0"
                  title="Perfil do Instagram Jeito de Criança"
                  allowFullScreen
                  frameBorder="0"
                  scrolling="no"
                ></iframe>
            </div>
          </div>
        </div>
        <StatsBanner />
      </div>
    </section>
  );
};

export default AboutUs;
