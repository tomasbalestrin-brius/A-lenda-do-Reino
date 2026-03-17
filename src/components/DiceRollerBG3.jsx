import React, { useState, useEffect } from 'react';

// BG3 Inspired Dice Roller
export default function DiceRollerBG3({ skillName, modifier, onClose }) {
  const [stage, setStage] = useState('entering'); // entering -> rolling -> resolving -> result -> exit
  const [currentFace, setCurrentFace] = useState(20);
  const [finalRoll, setFinalRoll] = useState(null);
  
  useEffect(() => {
    // 1. Enter animation
    const tEnter = setTimeout(() => {
      setStage('rolling');
      
      // Target roll 1-20
      const roll = Math.floor(Math.random() * 20) + 1;
      setFinalRoll(roll);
      
      // 2. Rapid spinning effect (faking 3D spin by rapidly changing a number and shaking)
      let spinInterval = setInterval(() => {
        setCurrentFace(Math.floor(Math.random() * 20) + 1);
      }, 50);
      
      // 3. Resolve the roll after 1.5s
      setTimeout(() => {
        clearInterval(spinInterval);
        setCurrentFace(roll);
        setStage('resolving');
        
        // 4. Show final result with modifier sliding in after 800ms
        setTimeout(() => {
          setStage('result');
        }, 800);
        
      }, 1500);
      
    }, 400); // 400ms entrance delay
    
    return () => clearTimeout(tEnter);
  }, []);

  const handleClose = () => {
    setStage('exit');
    setTimeout(() => {
      onClose();
    }, 400); // Wait for exit animation
  };

  const isCritSuccess = finalRoll === 20;
  const isCritFail = finalRoll === 1;
  const isRolling = stage === 'rolling';
  const showResult = stage === 'result';
  const finalTotal = finalRoll !== null ? finalRoll + modifier : 0;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ${
        stage === 'exit' ? 'bg-transparent backdrop-blur-none' : 'bg-black/80 backdrop-blur-sm'
      }`}
      onClick={showResult ? handleClose : undefined}
    >
      {/* Title */}
      <h2 className={`absolute top-24 text-3xl font-black uppercase tracking-widest transition-all duration-500 delay-100 ${
        ['entering', 'exit'].includes(stage) ? 'opacity-0 -translate-y-4' : 'text-gray-200 opacity-100 translate-y-0'
      }`}>
        {skillName}
      </h2>

      {/* Main Container */}
      <div className={`relative flex items-center justify-center transition-all duration-500 ease-out transform ${
        stage === 'entering' ? 'scale-0 opacity-0' :
        stage === 'exit' ? 'scale-110 opacity-0' :
        'scale-100 opacity-100'
      }`}>

        {/* Outer Glowing Ring */}
        <div className={`absolute w-48 h-48 rounded-full border border-gray-700 transition-all duration-700 ${
          isRolling ? 'animate-spin border-t-amber-500 border-b-amber-500 opacity-50' : 
          showResult && isCritSuccess ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_50px_rgba(251,191,36,0.5)]' :
          showResult && isCritFail ? 'border-red-600 bg-red-600/20 shadow-[0_0_50px_rgba(220,38,38,0.5)]' :
          'border-gray-600'
        }`} />

        {/* The "Dice" Shape (stylized hexagon/polygon overlay) */}
        <div className={`relative z-10 w-32 h-32 flex items-center justify-center transition-transform duration-75 ${
          isRolling ? 'scale-110 blur-[1px]' : 'scale-100'
        }`}>
           {/* SVG D20 Poly */}
           <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full drop-shadow-xl transition-colors duration-500 ${
             showResult && isCritSuccess ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' :
             showResult && isCritFail ? 'text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]' :
             'text-gray-300'
           }`}>
              <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <polyline points="50,5 50,95" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
              <polyline points="5,30 95,70" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
              <polyline points="5,70 95,30" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4"/>
           </svg>

           {/* The Number */}
           <span className={`z-20 text-5xl font-black font-serif transition-all duration-300 ${
             isRolling ? 'text-white blur-[0.5px] scale-125' : 
             showResult && isCritSuccess ? 'text-amber-400 drop-shadow-md scale-110' :
             showResult && isCritFail ? 'text-red-500 scale-110 drop-shadow-md' :
             'text-white'
           }`}>
             {currentFace}
           </span>
        </div>

        {/* Modifier Slider (Appears after roll resolves) */}
        <div className={`absolute top-1/2 left-full ml-4 -translate-y-1/2 flex items-center transition-all duration-500 ease-in-out ${
          showResult ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}>
          <span className="text-3xl font-bold text-gray-500 mr-4">+</span>
          <div className="bg-gray-800/80 backdrop-blur border border-gray-700 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4">
            <span className="text-2xl font-black text-gray-300">{modifier}</span>
            <div className="h-8 w-px bg-gray-600" />
            <span className={`text-4xl font-black ${
              isCritSuccess ? 'text-amber-400' :
              isCritFail ? 'text-red-500' :
              'text-white'
            }`}>{finalTotal}</span>
          </div>
        </div>

        {/* Critical Text */}
        <div className={`absolute -bottom-16 w-64 text-center transition-all duration-500 ${
          showResult && isCritSuccess ? 'opacity-100 translate-y-0 text-amber-400 font-black tracking-widest uppercase text-xl' :
          showResult && isCritFail ? 'opacity-100 translate-y-0 text-red-500 font-black tracking-widest uppercase text-xl' :
          'opacity-0 translate-y-4'
        }`}>
          {isCritSuccess ? 'Sucesso Cr├¡tico!' : isCritFail ? 'Falha Cr├¡tica!' : ''}
        </div>
      </div>

      {/* Dismiss Instruction */}
      <p className={`absolute bottom-8 text-gray-500 text-sm font-medium tracking-widest uppercase transition-opacity duration-1000 ${
        showResult ? 'opacity-100' : 'opacity-0'
      }`}>
        Clique para continuar
      </p>
    </div>
  );
}
