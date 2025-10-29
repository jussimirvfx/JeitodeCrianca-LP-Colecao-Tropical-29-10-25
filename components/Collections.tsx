
import React, { useState, useEffect } from 'react';

const imageUrls = [
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/1-1761744440880.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/2-1761744510261.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/3-1761744513141.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/6-1761744516575.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/7-1761744519163.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/8-1761744521164.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/9-1761744523875.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/10-1761744526155.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/11-1761744528764.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/12-1761744531138.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/13-1761744534001.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/14-1761744536096.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/16-1761744538557.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/17-1761744540602.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/18-1761744543123.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/19-1761744545661.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/20-1761744548096.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/21-1761744550162.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/22-1761744552641.webp",
  "https://frwfcibbvbj5zog7.public.blob.vercel-storage.com/geral/23-1761744554944.webp"
];

const ImageSlot: React.FC<{ src: string; alt: string; }> = ({ src, alt }) => (
    <div className="bg-gray-200 aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 group shadow-md">
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
);

const Collections: React.FC = () => {
  const handleCTAClick = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalItems = imageUrls.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const getPagesInfo = () => {
        if (window.matchMedia('(min-width: 768px)').matches) {
            return { totalPages: Math.ceil(totalItems / 4) }; 
        }
        return { totalPages: Math.ceil(totalItems / 2) }; 
    };

    let { totalPages } = getPagesInfo();

    const handleResize = () => {
        const newPagesInfo = getPagesInfo();
        if (newPagesInfo.totalPages !== totalPages) {
            totalPages = newPagesInfo.totalPages;
            setCurrentPage(0); 
        }
    };

    window.addEventListener('resize', handleResize);
    
    if (isPaused) {
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    const interval = setInterval(() => {
      setCurrentPage(prevPage => (prevPage + 1) % totalPages);
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [totalItems, isPaused]);


  return (
    <section className="py-12 md:py-24 bg-brand-blue">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 uppercase">
          CONHEÇA A COLEÇÃO PAPELIÊ
        </h2>
        
        <div 
          className="overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {imageUrls.map((url, index) => (
                <div key={index} className="w-1/2 md:w-1/4 flex-shrink-0 p-2 md:p-4">
                  <ImageSlot src={url} alt={`Look ${index + 1} da coleção Tropical Papeliê 2026`} />
                </div>
              ))}
            </div>
        </div>
        
        <div className="mt-12">
            <button 
              onClick={handleCTAClick}
              className="bg-white hover:bg-gray-200 text-brand-blue font-bold py-3 px-8 text-md md:py-4 md:px-10 md:text-lg rounded-lg transition-transform duration-300 transform hover:scale-105"
            >
              QUERO JEITO DE CRIANÇA NA MINHA LOJA
            </button>
        </div>
      </div>
    </section>
  );
};

export default Collections;
