import React from 'react';
import { ReasoningPipeline } from '../components/pipeline/ReasoningPipeline';

export function PipelineView({ activeCity = "Jodhpur", lang = 'en', t = (k, f) => f || k }) {
  return (
    <div className="page-fade-in" style={{ padding: '0.5rem 0' }}>
      <ReasoningPipeline activeCity={activeCity} lang={lang} t={t} />
    </div>
  );
}
