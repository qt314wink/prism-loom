import React from 'react';

export type SocraticLayer = 
  | 'epistemic' 
  | 'ontological' 
  | 'axiological' 
  | 'phenomenological' 
  | 'praxeological' 
  | 'semiotic' 
  | 'compositional' 
  | 'narrative';

interface SocraticReceiptProps {
  questionId: number;
  layer: SocraticLayer;
  question: string;
  answerDigest: string;
  visualProof: string;
  tokenImpact: string[];
  confidence: number;
  children: React.ReactNode;
}

const layerColors: Record<SocraticLayer, string> = {
  epistemic: '#00d4aa',
  ontological: '#6b4ee6',
  axiological: '#ff6b9d',
  phenomenological: '#d4a843',
  praxeological: '#b87333',
  semiotic: '#7a9e8c',
  compositional: '#2b3f5c',
  narrative: '#c4b9a8',
};

const layerLabels: Record<SocraticLayer, string> = {
  epistemic: 'What do we know?',
  ontological: 'What exists?',
  axiological: 'What matters?',
  phenomenological: 'What is experienced?',
  praxeological: 'What is done?',
  semiotic: 'What does it mean?',
  compositional: 'How is it arranged?',
  narrative: 'What story is told?',
};

export const SocraticReceipt: React.FC<SocraticReceiptProps> = ({
  questionId,
  layer,
  question,
  answerDigest,
  visualProof,
  tokenImpact,
  confidence,
  children,
}) => {
  const color = layerColors[layer];

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#0d0a12',
        border: `1px solid ${color}33`,
        borderRadius: 12,
        overflow: 'hidden',
        maxWidth: 560,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: color,
              color: '#0d0a12',
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: '"Courier New", monospace',
            }}
          >
            {questionId}
          </span>
          <div>
            <div style={{ fontSize: 11, color, fontFamily: '"Courier New", monospace', letterSpacing: '0.13em', textTransform: 'uppercase' }}>
              {layer}
            </div>
            <div style={{ fontSize: 10, color: '#c4b9a8', marginTop: 2 }}>
              {layerLabels[layer]}
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            background: confidence >= 0.8 ? '#00d4aa22' : confidence >= 0.6 ? '#d4a84322' : '#ff6b9d22',
            color: confidence >= 0.8 ? '#00d4aa' : confidence >= 0.6 ? '#d4a843' : '#ff6b9d',
            fontSize: 11,
            fontFamily: '"Courier New", monospace',
            fontWeight: 700,
          }}
        >
          {Math.round(confidence * 100)}% confidence
        </div>
      </div>

      {/* Visual Component */}
      <div style={{ padding: 24, display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #0d0a12, #14101c)' }}>
        {children}
      </div>

      {/* Receipt Body */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${color}22` }}>
        <div style={{ fontSize: 13, color: '#e8e0d4', lineHeight: 1.5, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
          {question}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 8,
            borderLeft: `3px solid ${color}`,
            fontSize: 12,
            color: '#c4b9a8',
            lineHeight: 1.6,
          }}
        >
          {answerDigest}
        </div>

        {/* Token Impact */}
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tokenImpact.map((token) => (
            <span
              key={token}
              style={{
                padding: '3px 8px',
                borderRadius: 4,
                background: `${color}11`,
                color,
                fontSize: 10,
                fontFamily: '"Courier New", monospace',
                border: `1px solid ${color}22`,
              }}
            >
              {token}
            </span>
          ))}
        </div>

        {/* Visual Proof Ref */}
        <div style={{ marginTop: 10, fontSize: 9, color: '#c4b9a855', fontFamily: '"Courier New", monospace' }}>
          VISUAL PROOF: {visualProof} · image_semantics.json
        </div>
      </div>
    </div>
  );
};

export default SocraticReceipt;
