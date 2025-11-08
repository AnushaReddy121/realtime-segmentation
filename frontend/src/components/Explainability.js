 
import React from 'react';

const Explainability = ({ segments, metrics }) => (
  <div>
    <h2>Explainability Insights</h2>
    <p>Explainable AI insights for each user segment will appear here.</p>
    <pre>{JSON.stringify({ segments, metrics }, null, 2)}</pre>
  </div>
);

export default Explainability;
