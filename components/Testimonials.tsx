
import React, { useState, useEffect, useRef } from 'react';
import { StarIcon } from '../constants';

const testimonialsData = [
  {
    name: "Maria Silva",
    location: "Florianópolis, SC",
    text: "A qualidade das peças é incrível e minhas clientes amam. A coleção de inverno superou todas as expectativas, vendi quase todo o estoque na primeira semana!"
  },
  {
    name: "João Pereira",
    location: "Curitiba, PR",
    text: "Ser parceiro da Jeito de Criança foi a melhor decisão para minha loja. O suporte da equipe é excelente e o material de campanha ajuda muito nas vendas."
  },
  {
    name: "Ana Costa",
    location: "Porto Alegre, RS",
    text: "As coleções são sempre um sucesso. O giro é rápido e a lucratividade é ótima. Recomendo para todos os lojistas do segmento infantil."
  }
];

const TestimonialCard: React.FC<{ name: string; location: string; children: React.ReactNode }> = ({ name, location, children }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 h-full flex flex-col">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
    <p className="text-gray-600 mb-6 italic flex-grow">"{children}"</p>
    <div>
      <p className="font-bold text-brand-blue">{name}</p>
      <p className="text-sm text-gray-500">{location}</p>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // State for dragging
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const dragThreshold = 50; // Minimum pixels to swipe to trigger a slide change

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, isPaused]);


  // --- Drag Handlers ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent dragging with right-click
    if ('button' in e && e.button !== 0) return;

    setIsPaused(true); // Pause auto-play on interaction
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX === null) return;

    const finalX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const dragDistance = finalX - dragStartX;

    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance < 0) { // Swiped left
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
        );
      } else { // Swiped right
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
        );
      }
    }
    
    setDragStartX(null);
    // Auto-play will resume via onMouseLeave or the useEffect dependency on isPaused
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
    // If the user is dragging and the mouse leaves the container, cancel the drag
    if (dragStartX !== null) {
        setDragStartX(null);
    }
  }

  return (
    <section className="py-12 md:py-24 bg-brand-light">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-blue mb-12 uppercase">
          Lojistas que confiam na Jeito de Criança
        </h2>
        
        {/* Mobile Carousel */}
        <div 
          className="md:hidden relative cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          // Mouse events for dragging
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          // Touch events for swiping
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform ease-in-out duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonialsData.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2" draggable="false">
                  <TestimonialCard name={testimonial.name} location={testimonial.location}>
                    {testimonial.text}
                  </TestimonialCard>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonialsData.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-brand-blue' : 'bg-gray-300'}`}
                aria-label={`Ir para o depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} name={testimonial.name} location={testimonial.location}>
              {testimonial.text}
            </TestimonialCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
