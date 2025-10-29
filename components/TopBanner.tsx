import React from 'react';

const messages = [
  "Pedido mínimo de R$ 2.500 com frete grátis",
  "Parcelamento em até 5x sem juros no boleto",
  "Kit de boas-vindas para novos lojistas",
  "Grade completa do infantil ao juvenil"
];

const Separator: React.FC = () => <span className="mx-4 text-gray-400">◆</span>;

const TopBanner: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 bg-brand-blue text-white text-sm font-semibold h-10 w-full overflow-hidden flex items-center">
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } /* Translate by half the width for a seamless loop */
          }
          .animate-scroll {
            animation: scroll 60s linear infinite; /* Slower speed */
          }
        `}
      </style>
      <div className="animate-scroll flex-shrink-0 flex items-center whitespace-nowrap">
        {/* Content is duplicated to create the seamless loop effect */}
        {[...messages, ...messages].map((message, index) => (
          <React.Fragment key={index}>
            <span>{message.toUpperCase()}</span>
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;