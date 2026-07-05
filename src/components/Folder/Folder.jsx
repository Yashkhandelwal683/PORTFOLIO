import { useState } from 'react';
import './Folder.css';

export default function Folder({
  color = '#3B82F6',
  size = 1,
  items = [],
  className = '',
  open = false,
  glowColor,
  intensity = 0.5,
}) {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [paperOffsets, setPaperOffsets] = useState(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const gColor = glowColor || color;

  const handlePaperMouseMove = (e, index) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (e, index) => {
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle = {
    '--folder-color': 'rgba(17, 24, 39, 0.7)',
    '--folder-back-color': 'rgba(17, 24, 39, 0.85)',
    '--folder-border': 'rgba(255,255,255,0.08)',
    '--paper-1': 'rgba(30, 41, 59, 0.5)',
    '--paper-2': 'rgba(30, 41, 59, 0.45)',
    '--paper-3': 'rgba(30, 41, 59, 0.4)',
  };

  const folderClassName = `folder ${open ? 'open' : ''}`.trim();
  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <div className={folderClassName} style={folderStyle}>
        <div className="folder__back">
          {papers.map((item, i) => (
            <div
              key={i}
              className={`paper paper-${i + 1}`}
              onMouseMove={e => handlePaperMouseMove(e, i)}
              onMouseLeave={e => handlePaperMouseLeave(e, i)}
              style={
                open
                  ? {
                      '--magnet-x': `${paperOffsets[i]?.x || 0}px`,
                      '--magnet-y': `${paperOffsets[i]?.y || 0}px`,
                    }
                  : {}
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
          <div
            className="folder__strip"
            style={{
              background: gColor,
              opacity: intensity * 0.5,
              boxShadow: `0 0 ${intensity * 8}px ${gColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
