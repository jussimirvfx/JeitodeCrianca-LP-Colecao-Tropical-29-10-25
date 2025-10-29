
import React, { useState, useEffect, useRef } from 'react';

const stepsData = [
    { number: 1, content: 'Deixe suas informações de contato em nosso formulário' },
    { number: 2, content: 'Nossa equipe comercial entrará em contato para entender suas necessidades' },
    { number: 3, content: 'Com tudo aprovado, você já pode fazer seu primeiro pedido e começar a lucrar' }
];

const TimelineStep: React.FC<{ number: number; children: React.ReactNode; side: 'left' | 'right' }> = ({ number, children, side }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
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

    const circlePositionClass = side === 'left' ? 'md:left-auto md:right-[-28px]' : 'md:left-[-28px]';

    const contentBoxAnimation = side === 'left'
        ? (isVisible ? 'opacity-100 md:translate-x-0' : 'opacity-0 md:-translate-x-8')
        : (isVisible ? 'opacity-100 md:translate-x-0' : 'opacity-0 md:translate-x-8');
    
    const mobileAnimation = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
    
    return (
        <div ref={ref} className="relative w-full max-w-sm md:max-w-none md:w-full p-4">
            <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-white border-4 border-brand-blue text-brand-blue rounded-full items-center justify-center text-2xl font-bold z-10 transition-transform duration-500 ease-in-out ${isVisible ? 'scale-100' : 'scale-0'} ${circlePositionClass}`}>
                {number}
            </div>
            <div className={`bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 min-h-[100px] flex items-center transition-all duration-700 ease-out text-left ${mobileAnimation} ${contentBoxAnimation}`}>
                <p className="text-gray-200 font-medium">
                  <span className="font-bold text-xl mr-2 md:hidden">{number}.</span>
                  {children}
                </p>
            </div>
        </div>
    );
};


const HowToBecomePartner: React.FC = () => {
  const handleCTAClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="relative py-16 md:py-24 bg-cover bg-left" style={{backgroundImage: "url('https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/jdcherotropical-1761742453397.webp')"}}>
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
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-20 uppercase">
              Veja como é fácil se tornar um parceiro
            </h2>
            
            <div className="relative max-w-4xl mx-auto">
                <div className="hidden md:block absolute top-0 left-1/2 w-1 h-full bg-white bg-opacity-30 rounded -translate-x-1/2" aria-hidden="true"></div>
                
                <div className="relative flex flex-col items-center gap-y-8 md:gap-y-0">
                    {stepsData.map((step, index) => {
                        const side = index % 2 === 0 ? 'left' : 'right';
                        const justification = side === 'left' ? 'md:self-start' : 'md:self-end';
                        return (
                            <div key={step.number} className={`w-full flex justify-center ${justification}`}>
                                <TimelineStep number={step.number} side={side}>
                                    {step.content}
                                </TimelineStep>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-16 md:mt-20">
              <button 
                onClick={handleCTAClick}
                className="shine-button bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-8 text-md md:py-4 md:px-10 md:text-lg rounded-lg transition-transform duration-300 transform hover:scale-105 shadow-lg"
              >
                QUERO SER UM LOJISTA PARCEIRO
              </button>
            </div>
        </div>
    </section>
  );
};

export default HowToBecomePartner;