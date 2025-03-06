import React from 'react';

function InitialPage({ onVisit }) {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to GiftLink</h1>
      <p>Share Gifts and Joy!</p>
      <button className="btn btn-primary" onClick={onVisit}>
        Get Started
      </button>
    </div>
  );
}

export default InitialPage;
