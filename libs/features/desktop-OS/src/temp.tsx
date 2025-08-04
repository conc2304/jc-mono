// Modified particles with entry animation
particlesRef.current.forEach((particles) => {
  const entryProgress = isAnimatingEntry
    ? getEntryAnimationProgress('particles', entryTime)
    : 1;

  particles.rotation.y = time * 0.1;

  const positions = particles.geometry.attributes.position.array;
  const colors = particles.geometry.attributes.color.array;
  const sizes = particles.geometry.attributes.size.array;
  const originalColors = particles.userData.originalColors;
  const originalPositions = particles.userData.originalPositions;

  for (let i = 0; i < positions.length; i += 3) {
    const particlePos = new THREE.Vector3(
      positions[i],
      positions[i + 1],
      positions[i + 2]
    );
    const originalPos = new THREE.Vector3(
      originalPositions[i],
      originalPositions[i + 1],
      originalPositions[i + 2]
    );

    // Mouse attraction - adjusted for theme
    const distanceToMouse = particlePos.distanceTo(mouse.world3D);
    const attractionForce = Math.max(0, 1 - distanceToMouse / 10);
    const attractionStrength =
      mouse.distanceFromCenter * (isLight ? 0.08 : 0.1) +
      mouse.clickIntensity * (isLight ? 0.2 : 0.3);

    let targetX, targetY, targetZ;

    if (attractionForce > 0) {
      const direction = new THREE.Vector3()
        .subVectors(mouse.world3D, particlePos)
        .normalize()
        .multiplyScalar(attractionStrength * attractionForce);

      const attractedPos = particlePos.clone().add(direction);
      targetX = attractedPos.x;
      targetZ = attractedPos.z;
    } else {
      // Use swirled position when no mouse attraction
      const angle = time * 0.5 + i * 0.01;
      const radius = Math.sqrt(
        originalPos.x * originalPos.x + originalPos.z * originalPos.z
      );

      targetX = Math.cos(angle) * radius;
      targetZ = Math.sin(angle) * radius;
    }

    // Vertical oscillation with mouse influence
    targetY =
      originalPos.y +
      Math.sin(time * 2 + i * 0.02) * 0.3 +
      mouse.normalized.y * attractionForce * 2;

    // Entry animation: particles start at center and move to target positions
    if (isAnimatingEntry) {
      // Particles emerge from center (0, 0, 0) to their target positions
      positions[i] = targetX * entryProgress;
      positions[i + 1] = targetY * entryProgress;
      positions[i + 2] = targetZ * entryProgress;

      // Fade in colors
      colors[i] = originalColors[i] * entryProgress;
      colors[i + 1] = originalColors[i + 1] * entryProgress;
      colors[i + 2] = originalColors[i + 2] * entryProgress;
    } else {
      // Normal animation after entry is complete
      const blendFactor = 0.7 + attractionForce * 0.3;
      positions[i] = originalPos.x * (1 - blendFactor) + targetX * blendFactor;
      positions[i + 2] =
        originalPos.z * (1 - blendFactor) + targetZ * blendFactor;
      positions[i + 1] = targetY;

      // Color intensity based on progress and mouse influence - theme aware
      const baseIntensity = (isLight ? 0.5 : 0.3) + normalizedProgress * 0.7;
      const pulseIntensity = Math.sin(time * 3 + i * 0.1) * 0.2;
      const mouseColorBoost =
        attractionForce * (1 + mouse.clickIntensity * (isLight ? 1.5 : 2));
      const finalIntensity =
        (baseIntensity + pulseIntensity) * (1 + mouseColorBoost);

      // Apply hue shifting near mouse - subtler in light mode
      let r = originalColors[i];
      let g = originalColors[i + 1];
      let b = originalColors[i + 2];

      if (attractionForce > 0.1) {
        // Shift towards complementary colors when near mouse
        const shiftAmount = attractionForce * hueShift * (isLight ? 0.5 : 1.0);
        r = Math.min(1, r * (1 + shiftAmount));
        g = Math.min(1, g * (1 - shiftAmount * 0.5));
        b = Math.min(1, b * (1 + shiftAmount * 0.3));
      }

      // Apply theme-appropriate intensity
      const themeIntensityMultiplier = isLight ? 0.8 : 1.0;
      colors[i] = Math.min(
        1,
        r * finalIntensity * colorIntensity * themeIntensityMultiplier
      );
      colors[i + 1] = Math.min(
        1,
        g * finalIntensity * colorIntensity * themeIntensityMultiplier
      );
      colors[i + 2] = Math.min(
        1,
        b * finalIntensity * colorIntensity * themeIntensityMultiplier
      );
    }

    // Size variation based on mouse proximity - adjusted for theme
    const baseSizeIndex = Math.floor(i / 3);
    const baseSize = 1 + Math.random() * 2;
    const sizeMultiplier =
      1 +
      attractionForce * (0.5 + mouse.clickIntensity * (isLight ? 0.7 : 1.0));
    sizes[baseSizeIndex] = baseSize * sizeMultiplier * entryProgress;
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.color.needsUpdate = true;
  particles.geometry.attributes.size.needsUpdate = true;

  // Overall particle opacity - theme aware
  const particleOpacityMultiplier = isLight ? 0.7 : 1.0;
  particles.material.opacity =
    particles.userData.baseOpacity *
    particleOpacityMultiplier *
    (0.2 +
      normalizedProgress * 0.8 +
      mouse.distanceFromCenter * (isLight ? 0.15 : 0.2)) *
    entryProgress;
});
