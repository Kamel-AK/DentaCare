import { useEffect, useRef } from 'react';
import Raphael from 'raphael';

window.Raphael = Raphael;

export default function DentalChart({ onToothSelect }) {
  const selectedToothRef = useRef(null);
  const chartInstance = useRef({ paper: null, teeth: {} });
  const scriptRef = useRef(null);
  const initialized = useRef(false);

  const loadCustomRaphael = () => {
    return new Promise((resolve) => {
      if (scriptRef.current) return resolve();
      
      const script = document.createElement('script');
      script.src = '/js/Raphael.js';
      script.async = true;
      script.onload = resolve;
      document.head.appendChild(script);
      scriptRef.current = script;
    });
  };

  useEffect(() => {
    const initializeChart = async () => {
      try {
        if (initialized.current) return;
        
        await loadCustomRaphael();

        if (typeof window.initChart === 'function' && !initialized.current) {
          initialized.current = true;
          
          const container = document.getElementById('canvas_container');
          if (container) container.innerHTML = '';
          
          const instance = window.initChart(onToothSelect);
          
          if (instance) {
            chartInstance.current = {
              paper: instance.paper,
              teeth: instance.teeth
            };

            // Store original colors and setup hover effects
            Object.entries(chartInstance.current.teeth).forEach(([name, tooth]) => {
              const toothNumber = name.split('_')[1];
              if (!tooth) return;

              const textElement = window[`t${toothNumber}_text`];
              const originalFill = tooth.attr('fill');
              const originalTextFill = textElement?.attr('fill');

              // Store original colors
              tooth.originalFill = originalFill;
              if (textElement) textElement.originalFill = originalTextFill;

              // Unified hover handler
              const handleHover = (isHover) => {
                tooth.animate({ fill: isHover ? '#1693A5' : tooth.originalFill }, 200);
                if (textElement) textElement.animate(
                  { fill: isHover ? '#1693A5' : textElement.originalFill }, 
                  200
                );
              };

              // Modern event listeners
              tooth.node.addEventListener('pointerover', () => handleHover(true));
              tooth.node.addEventListener('pointerout', () => handleHover(false));
              
              // Click handler
              tooth.node.addEventListener('click', () => {
                if (selectedToothRef.current === tooth) {
                  selectedToothRef.current = null;
                  onToothSelect(null);
                } else {
                  if (selectedToothRef.current) {
                    selectedToothRef.current.animate(
                      { fill: selectedToothRef.current.originalFill }, 
                      200
                    );
                  }
                  selectedToothRef.current = tooth;
                  tooth.animate({ fill: '#3B82F6' }, 200);
                  onToothSelect(toothNumber);
                }
              });
            });
          }
        }
      } catch (error) {
        console.error('Error initializing dental chart:', error);
      }
    };

    initializeChart();

    return () => {
      if (chartInstance.current.paper) {
        chartInstance.current.paper.remove();
        chartInstance.current.paper = null;
      }
      initialized.current = false;
    };
  }, [onToothSelect]);

  return <div id="canvas_container" className="w-full max-w-2xl mx-auto" />;
}