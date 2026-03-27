import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
}

/**
 * Componente para renderizar fórmulas matemáticas usando KaTeX
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ math, block = false }) => {
  if (block) {
    return <BlockMath math={math} />;
  }
  return <InlineMath math={math} />;
};
