 
import React from 'react';

const Segments = ({ segments }) => {
  const segmentKeys = Object.keys(segments);
  return (
    <div>
      <h2>User Segments</h2>
      {segmentKeys.length === 0 ? (
        <p>No segments available yet.</p>
      ) : (
        <ul>
          {segmentKeys.map((key) => (
            <li key={key}>
              <strong>{key}</strong>: {JSON.stringify(segments[key])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Segments;
