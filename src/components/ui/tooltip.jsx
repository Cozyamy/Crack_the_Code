import { useState } from 'react';

export function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(!isVisible)} // show on touch for mobile
    >
      {children}
      {isVisible && (
        <div
          className="
            absolute z-50 bottom-full mb-2 left-2 -translate-x-1/2 
            whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white shadow
            max-w-[70vw] overflow-hidden text-ellipsis
          "
        >
          {content}
        </div>
      )}
    </div>
  );
}