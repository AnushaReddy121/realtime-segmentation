import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Dashboard from './components/Dashboard';
import Segments from './components/Segments';
import Explainability from './components/Explainability';
import './App.css';

const socket = io('http://localhost:5000');

const ABSTRACT = `Real-time adaptive segmentation is vital for personalization, marketing, fraud detection, and UX optimization. Proposed pipeline processes behavioural event streams (clicks, views, transactions). Uses online learning and drift adaptation to update segment models continuously. Integrates explainability methods (SHAP, LIME, rule summaries, prototypes). Balances responsiveness to new patterns with segment stability. Evaluates using metrics: purity, stability, latency, interpretability. Demonstrates operational value and ethical transparency. Improves business KPIs (CTR, churn prediction) with auditable segment definitions.`;

function App() {
  const [data, setData] = useState({ segments: {}, metrics: {} });

  useEffect(() => {
    socket.on('initialData', setData);
    socket.on('segmentsUpdate', setData);
    return () => {
      socket.off('initialData');
      socket.off('segmentsUpdate');
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Realtime Adaptive and Explainable Behavior Based Online User Segmentation</h1>
        <div className="abstract">
          <h2>Project Abstract</h2>
          <p>{ABSTRACT}</p>
        </div>
      </header>
      <main>
        <Dashboard metrics={data.metrics} />
        <Segments segments={data.segments} />
        <Explainability segments={data.segments} metrics={data.metrics} />
      </main>
    </div>
  );
}

export default App;