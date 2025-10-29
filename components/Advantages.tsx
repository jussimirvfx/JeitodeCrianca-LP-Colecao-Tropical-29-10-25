
import React, { useState, useEffect, useRef } from 'react';

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const AdvantageItem: React.FC<{ title: string; children: React.ReactNode; delay: number }> = ({ title, children, delay }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set visibility based on whether the element is intersecting
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div 
            ref={ref}
            className={`flex items-start space-x-3 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="flex-shrink-0 pt-1">
                <CheckIcon />
            </div>
            <div>
                <h3 className="text-lg font-bold text-brand-blue">{title}</h3>
                <p className="mt-1 text-gray-600">{children}</p>
            </div>
        </div>
    );
};

const advantagesList = [
    {
        title: "Alto Giro e Lucratividade",
        description: "Nossas coleções são criadas com base nas últimas tendências, garantindo peças que vendem rápido e aumentam sua margem de lucro."
    },
    {
        title: "Pagamento Facilitado e Frete Grátis",
        description: "Oferecemos condições de pagamento flexíveis e frete grátis para que você possa investir no seu estoque sem preocupações."
    },
    {
        title: "Coleções para Todas as Idades",
        description: "Do infantil ao juvenil, temos um mix completo de produtos para atender a todos os seus clientes com uma única marca."
    },
    {
        title: "Coleção Essencial à Pronta Entrega",
        description: "Comece com nossas peças essenciais, de alta demanda, e comprove a qualidade e o sucesso de vendas do Jeito de Criança."
    },
    {
        title: "Suporte e Material de Campanha",
        description: "Receba catálogo completo, fotos profissionais e até um kit de boas-vindas para encantar no seu ponto de venda."
    },
    {
        title: "Qualidade que Fideliza",
        description: "Peças com acabamento impecável e tecidos confortáveis que fazem seus clientes voltarem sempre em busca de mais."
    }
];

const Advantages: React.FC = () => {
  const handleCTAClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-16 uppercase">
          Vantagens de ser nosso lojista parceiro
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 mb-16">
            <div className="md:w-2/5 w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                <img 
                    src="https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/jdc1-1761743417866.webp" 
                    alt="Criança com roupa da coleção"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
            </div>
            <div className="md:w-1/2 w-full">
                <div className="space-y-8">
                    {advantagesList.slice(0, 3).map((advantage, index) => (
                        <AdvantageItem key={advantage.title} title={advantage.title} delay={index * 200}>
                            {advantage.description}
                        </AdvantageItem>
                    ))}
                </div>
                 <div className="mt-10">
                    <button 
                        onClick={handleCTAClick}
                        className="bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-8 text-md md:py-4 md:px-10 md:text-lg rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
                    >
                        QUERO REVENDER A COLEÇÃO
                    </button>
                </div>
            </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-16 mb-16">
            <div className="md:w-1/2 w-full">
                <div className="space-y-8">
                     {advantagesList.slice(3, 6).map((advantage, index) => (
                        <AdvantageItem key={advantage.title} title={advantage.title} delay={index * 200}>
                            {advantage.description}
                        </AdvantageItem>
                    ))}
                </div>
                <div className="mt-10">
                    <button 
                        onClick={handleCTAClick}
                        className="bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-8 text-md md:py-4 md:px-10 md:text-lg rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
                    >
                        QUERO REVENDER A COLEÇÃO
                    </button>
                </div>
            </div>
            <div className="md:w-2/5 w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                 <img 
                    src="https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/jdc2-1761743420652.webp" 
                    alt="Jovens com roupa da coleção"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
