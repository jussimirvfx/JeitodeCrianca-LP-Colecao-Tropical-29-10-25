import React, { useState, useEffect, useRef } from 'react';

const CountUp: React.FC<{ end: number, duration?: number }> = ({ end, duration = 1200 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const startAnimation = () => {
        const startTime = Date.now();
        const animate = () => {
            const now = Date.now();
            const timePassed = now - startTime;
            const progress = Math.min(timePassed / duration, 1);
            const currentNum = Math.floor(progress * end);
            setCount(currentNum);

            if (progress < 1) {
                animationFrameId.current = requestAnimationFrame(animate);
            }
        };
        animationFrameId.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startAnimation();
                } else {
                    stopAnimation();
                    setCount(0); 
                }
            },
            { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            stopAnimation();
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [end, duration]);

    return <span ref={ref}>{count.toLocaleString('pt-BR')}</span>;
};


const StatItem: React.FC<{ prefix?: string; value: number; suffix?: string; label: string; }> = ({ prefix, value, suffix, label }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-extrabold">
        {prefix && <span>{prefix}</span>}
        <CountUp end={value} />
        {suffix && <span>{suffix}</span>}
    </p>
    <p className="text-sm md:text-base uppercase tracking-wider">{label}</p>
  </div>
);

const StatsBanner: React.FC = () => {
  return (
    <div className="bg-brand-blue text-white py-8 md:py-10 mt-16 rounded-lg">
        <div className="flex flex-col md:flex-row justify-around items-center gap-8">
            <StatItem value={35} label="Anos de Indústria" />
            <StatItem prefix="+ " value={5} suffix=" Milhões" label="de Peças Entregues" />
            <StatItem prefix="+" value={1500} label="Lojistas Parceiros" />
        </div>
    </div>
  );
};

export default StatsBanner;