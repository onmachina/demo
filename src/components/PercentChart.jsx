import React from 'react';
import './PercentChart.css';

// The crazy radius numbers give us a perfect 100 circumference
// making it easy to set the stroke-dasharray to any percent

export default function PercentChart({ percent }) {
  const isCommplete = () => percent === 100;
  return (
    <svg viewbox="0 0 40 40" height="40" width="40" xmlns="http://www.w3.org/2000/svg">
      <circle
        class="circle-chart__background"
        stroke="#084f95"
        stroke-width="4"
        fill="none"
        cx="20"
        cy="20"
        r="15.91549430918954"
      />
      <circle
        class="circle-chart__circle"
        stroke="white"
        stroke-width="4"
        stroke-dasharray={`${percent},${100 - percent}`}
        fill="none"
        cx="20"
        cy="20"
        r="15.91549430918954"
      />
      <path
        d="M14 20.5L17.3478 24L25 16"
        stroke="white"
        stroke-width="2"
        fill="none"
        className={`transition-all duration-400 ${isCommplete() ? 'opacity-100' : 'opacity-0'}`}
      />
    </svg>
  );
}