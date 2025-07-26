import React from 'react';

export const PixelMoodIcons = {
  sad: () => (
    <div className="w-12 h-12 grid grid-cols-8 gap-px">
      {/* Sad face in 8x8 pixel grid */}
      {[
        0,0,1,1,1,1,0,0,
        0,1,1,1,1,1,1,0,
        1,1,0,1,1,0,1,1,
        1,1,1,1,1,1,1,1,
        1,1,1,0,0,1,1,1,
        1,1,0,1,1,0,1,1,
        0,1,1,1,1,1,1,0,
        0,0,1,1,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-cyan' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  tired: () => (
    <div className="w-12 h-12 grid grid-cols-8 gap-px">
      {/* Tired face in 8x8 pixel grid */}
      {[
        0,0,1,1,1,1,0,0,
        0,1,1,1,1,1,1,0,
        1,0,0,1,1,0,0,1,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        1,0,1,1,1,1,0,1,
        0,1,0,0,0,0,1,0,
        0,0,1,1,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-purple' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  okay: () => (
    <div className="w-12 h-12 grid grid-cols-8 gap-px">
      {/* Neutral face in 8x8 pixel grid */}
      {[
        0,0,1,1,1,1,0,0,
        0,1,1,1,1,1,1,0,
        1,1,0,1,1,0,1,1,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,
        1,1,0,0,0,0,1,1,
        0,1,1,1,1,1,1,0,
        0,0,1,1,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-pink' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  energized: () => (
    <div className="w-12 h-12 grid grid-cols-8 gap-px">
      {/* Happy face in 8x8 pixel grid */}
      {[
        0,0,1,1,1,1,0,0,
        0,1,1,1,1,1,1,0,
        1,1,0,1,1,0,1,1,
        1,1,1,1,1,1,1,1,
        1,0,1,1,1,1,0,1,
        1,1,0,1,1,0,1,1,
        0,1,1,0,0,1,1,0,
        0,0,1,1,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-green' : 'bg-transparent'} ${pixel ? 'animate-pulse' : ''}`}
        />
      ))}
    </div>
  )
};

export const PixelPlantIcons = {
  sprout: () => (
    <div className="w-8 h-8 grid grid-cols-6 gap-px">
      {[
        0,0,0,1,0,0,
        0,0,1,1,1,0,
        0,1,1,1,1,0,
        0,0,1,1,0,0,
        0,0,1,1,0,0,
        1,1,1,1,1,1
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-green' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  plant: () => (
    <div className="w-10 h-10 grid grid-cols-8 gap-px">
      {[
        0,0,1,1,1,0,0,0,
        0,1,1,1,1,1,0,0,
        1,1,1,1,1,1,1,0,
        0,1,1,1,1,1,0,0,
        0,0,1,1,1,0,0,0,
        0,0,1,1,1,0,0,0,
        0,0,1,1,1,0,0,0,
        1,1,1,1,1,1,1,1
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-green animate-pulse' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  tree: () => (
    <div className="w-12 h-12 grid grid-cols-10 gap-px">
      {[
        0,0,0,1,1,1,1,0,0,0,
        0,0,1,1,1,1,1,1,0,0,
        0,1,1,1,1,1,1,1,1,0,
        1,1,1,1,1,1,1,1,1,1,
        0,1,1,1,1,1,1,1,1,0,
        0,0,1,1,1,1,1,1,0,0,
        0,0,0,1,1,1,1,0,0,0,
        0,0,0,1,1,1,1,0,0,0,
        0,0,0,1,1,1,1,0,0,0,
        1,1,1,1,1,1,1,1,1,1
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-green animate-pulse' : 'bg-transparent'}`}
          style={{ animationDelay: `${(i % 5) * 0.1}s` }}
        />
      ))}
    </div>
  )
};

export const PixelActionIcons = {
  heart: () => (
    <div className="w-8 h-8 grid grid-cols-6 gap-px">
      {[
        0,1,0,0,1,0,
        1,1,1,1,1,1,
        1,1,1,1,1,1,
        1,1,1,1,1,1,
        0,1,1,1,1,0,
        0,0,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-pink animate-pulse' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  star: () => (
    <div className="w-8 h-8 grid grid-cols-6 gap-px">
      {[
        0,0,1,1,0,0,
        0,1,1,1,1,0,
        1,1,1,1,1,1,
        0,1,1,1,1,0,
        1,0,1,1,0,1,
        0,0,1,1,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-laser-orange animate-pulse' : 'bg-transparent'}`}
        />
      ))}
    </div>
  ),
  
  checkmark: () => (
    <div className="w-8 h-8 grid grid-cols-6 gap-px">
      {[
        0,0,0,0,0,1,
        0,0,0,0,1,1,
        0,0,0,1,1,0,
        1,0,1,1,0,0,
        1,1,1,0,0,0,
        0,1,0,0,0,0
      ].map((pixel, i) => (
        <div
          key={i}
          className={`w-1 h-1 ${pixel ? 'bg-neon-green' : 'bg-transparent'}`}
        />
      ))}
    </div>
  )
};