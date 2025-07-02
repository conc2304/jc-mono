import { useEffect, useState } from 'react';

export const useDynamicShadow = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  maxShadowDistance = 20
) => {
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateShadow = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        const elementCenterX = rect.x + rect.width / 2;
        const elementCenterY = rect.y + rect.height / 2;

        const deltaX = elementCenterX - viewportCenterX;
        const deltaY = elementCenterY - viewportCenterY;

        const normalizedX = deltaX / (window.innerWidth / 2);
        const normalizedY = deltaY / (window.innerHeight / 2);

        const shadowX = normalizedX * maxShadowDistance;
        const shadowY = normalizedY * maxShadowDistance;

        setShadowOffset({
          x: Math.round(shadowX),
          y: Math.round(shadowY),
        });
      }
    };

    updateShadow();
    window.addEventListener('scroll', updateShadow);
    window.addEventListener('resize', updateShadow);

    return () => {
      window.removeEventListener('scroll', updateShadow);
      window.removeEventListener('resize', updateShadow);
    };
  }, [containerRef, maxShadowDistance]);

  return shadowOffset;
};
