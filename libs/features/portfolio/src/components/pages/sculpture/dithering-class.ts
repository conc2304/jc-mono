export function createDitherClass() {
  return class DitherTransitionPlaylist {
    container: any;
    options: any;
    state: any;
    canvas1: any;
    canvas2: any;
    ctx1: any;
    ctx2: any;
    imageDataArray: any[];
    scrollTrigger: any;
    dotsContainer: any;

    constructor(container: any, options: any = {}) {
      this.container = container;
      this.options = {
        images: [],
        algorithm: 'floyd-steinberg',
        maxPixelation: 16,
        blendMode: 'normal',
        autoActivate: true,
        ...options,
      };

      this.state = {
        isActive: false,
        currentProgress: 0,
        currentTransitionIndex: 0,
      };

      this.canvas1 = null;
      this.canvas2 = null;
      this.ctx1 = null;
      this.ctx2 = null;
      this.imageDataArray = [];
      this.scrollTrigger = null;

      this.init();
    }

    async init() {
      if (this.options.images.length < 2) {
        return;
      }

      this.setupDOM();
      await this.loadImages();
    }

    setupDOM() {
      this.container.innerHTML = `
        <div class="dither-playlist-wrapper">
          <canvas class="dither-canvas-layer" data-layer="1"></canvas>
          <canvas class="dither-canvas-layer" data-layer="2"></canvas>
        </div>
        <div class="dither-progress-dots"></div>
      `;

      this.canvas1 = this.container.querySelector('[data-layer="1"]');
      this.canvas2 = this.container.querySelector('[data-layer="2"]');
      this.ctx1 = this.canvas1.getContext('2d', { willReadFrequently: true });
      this.ctx2 = this.canvas2.getContext('2d', { willReadFrequently: true });
      this.dotsContainer = this.container.querySelector(
        '.dither-progress-dots'
      );
    }

    async loadImages() {
      const imagePromises = this.options.images.map((src: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        const images = await Promise.all(imagePromises);
        this.processImages(images);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    }

    processImages(images: any[]) {
      const containerRect = this.container.getBoundingClientRect();
      let maxWidth = 0,
        maxHeight = 0;

      images.forEach((img: any) => {
        maxWidth = Math.max(maxWidth, img.width);
        maxHeight = Math.max(maxHeight, img.height);
      });

      const scale = Math.min(
        containerRect.width / maxWidth,
        containerRect.height / maxHeight,
        1
      );

      const width = Math.floor(maxWidth * scale);
      const height = Math.floor(maxHeight * scale);

      this.canvas1.width = this.canvas2.width = width;
      this.canvas1.height = this.canvas2.height = height;

      this.imageDataArray = images.map((img: any) => {
        this.ctx1.clearRect(0, 0, width, height);
        this.ctx1.drawImage(img, 0, 0, width, height);
        return this.ctx1.getImageData(0, 0, width, height);
      });

      this.dotsContainer.innerHTML = images
        .map(
          (_: any, i: number) =>
            `<div class="dither-dot" data-index="${i}"></div>`
        )
        .join('');
    }

    activate() {
      this.state.isActive = true;
    }

    deactivate() {
      this.state.isActive = false;
    }

    updateTransition(totalProgress: number) {
      if (!this.state.isActive) return;

      const transitionsCount = this.imageDataArray.length - 1;
      const scaledProgress = totalProgress * transitionsCount;
      const transitionIndex = Math.floor(scaledProgress);
      let localProgress = scaledProgress - transitionIndex;

      const currentIndex = Math.min(
        Math.max(transitionIndex, 0),
        transitionsCount - 1
      );

      if (totalProgress >= 0.999) localProgress = 1.0;
      else localProgress = Math.min(localProgress, 1);

      this.state.currentTransitionIndex = currentIndex;
      this.state.currentProgress = localProgress;

      this.updateProgressDots(currentIndex, localProgress);
      this.performTransition(currentIndex, localProgress);
    }

    updateProgressDots(index: number, progress: number) {
      this.container
        .querySelectorAll('.dither-dot')
        .forEach((dot: any, i: number) => {
          if (progress < 0.2) {
            dot.classList.toggle('active', i === index);
          } else if (progress > 0.8) {
            dot.classList.toggle('active', i === index + 1);
          } else {
            dot.classList.toggle('active', i === index || i === index + 1);
          }
        });
    }

    performTransition(index: number, progress: number) {
      const imageA = this.imageDataArray[index];
      const imageB = this.imageDataArray[index + 1];

      if (!imageA || !imageB) return;

      const maxPixel = this.options.maxPixelation;

      if (progress < 0.2) {
        this.ctx1.putImageData(imageA, 0, 0);
        this.canvas1.style.opacity = 1;
        this.canvas2.style.opacity = 0;
      } else if (progress < 0.35) {
        const t = (progress - 0.2) / 0.15;
        const dithered = this.applyGrayscaleDither(imageA, 1);
        this.ctx1.putImageData(imageA, 0, 0);
        this.ctx2.putImageData(dithered, 0, 0);
        this.canvas1.style.opacity = 1 - t;
        this.canvas2.style.opacity = t;
      } else if (progress < 0.45) {
        const t = (progress - 0.35) / 0.1;
        const dithered = this.applyGrayscaleDither(imageA, 1);
        const pixelSize = 1 + Math.floor(t * (maxPixel - 1));
        const pixelated = this.pixelate(dithered, pixelSize);
        this.ctx1.putImageData(dithered, 0, 0);
        this.ctx2.putImageData(pixelated, 0, 0);
        this.canvas1.style.opacity = 1 - t;
        this.canvas2.style.opacity = t;
      } else if (progress < 0.55) {
        const t = (progress - 0.45) / 0.1;
        const processedA = this.applyGrayscaleDither(imageA, 1);
        const processedB = this.applyGrayscaleDither(imageB, 1);
        const pixelatedA = this.pixelate(processedA, maxPixel);
        const pixelatedB = this.pixelate(processedB, maxPixel);
        this.ctx1.putImageData(pixelatedA, 0, 0);
        this.ctx2.putImageData(pixelatedB, 0, 0);
        this.canvas1.style.opacity = 1 - t;
        this.canvas2.style.opacity = t;
      } else if (progress < 0.65) {
        const t = (progress - 0.55) / 0.1;
        const dithered = this.applyGrayscaleDither(imageB, 1);
        const pixelSize = maxPixel - Math.floor(t * (maxPixel - 1));
        const pixelated = this.pixelate(dithered, Math.max(1, pixelSize));
        this.ctx1.putImageData(pixelated, 0, 0);
        this.ctx2.putImageData(dithered, 0, 0);
        this.canvas1.style.opacity = 1 - t;
        this.canvas2.style.opacity = t;
      } else if (progress < 0.8) {
        const t = (progress - 0.65) / 0.15;
        const dithered = this.applyGrayscaleDither(imageB, 1);
        this.ctx1.putImageData(imageB, 0, 0);
        this.ctx2.putImageData(dithered, 0, 0);
        this.canvas1.style.opacity = t;
        this.canvas2.style.opacity = 1 - t;
      } else {
        this.ctx1.putImageData(imageB, 0, 0);
        this.canvas1.style.opacity = 1;
        this.canvas2.style.opacity = 0;
      }
    }

    applyGrayscaleDither(originalData: any, amount: number) {
      const imageData = new ImageData(
        new Uint8ClampedArray(originalData.data),
        originalData.width,
        originalData.height
      );

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const gray = r * 0.299 + g * 0.587 + b * 0.114;

        imageData.data[i] = r + (gray - r) * amount;
        imageData.data[i + 1] = g + (gray - g) * amount;
        imageData.data[i + 2] = b + (gray - b) * amount;
      }

      if (amount > 0.3) this.floydSteinberg(imageData, amount);
      return imageData;
    }

    pixelate(imageData: any, size: number) {
      if (size <= 1) return imageData;

      const width = imageData.width;
      const height = imageData.height;
      const output = new ImageData(width, height);

      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          let r = 0,
            g = 0,
            b = 0,
            a = 0,
            count = 0;

          for (let dy = 0; dy < size && y + dy < height; dy++) {
            for (let dx = 0; dx < size && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              r += imageData.data[idx];
              g += imageData.data[idx + 1];
              b += imageData.data[idx + 2];
              a += imageData.data[idx + 3];
              count++;
            }
          }

          r /= count;
          g /= count;
          b /= count;
          a /= count;

          for (let dy = 0; dy < size && y + dy < height; dy++) {
            for (let dx = 0; dx < size && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              output.data[idx] = r;
              output.data[idx + 1] = g;
              output.data[idx + 2] = b;
              output.data[idx + 3] = a;
            }
          }
        }
      }

      return output;
    }

    floydSteinberg(imageData: any, strength: number) {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const oldR = data[idx];
          const newR = oldR < 128 ? 0 : 255;
          const error = (oldR - newR) * strength;

          data[idx] = data[idx + 1] = data[idx + 2] = newR;

          if (x + 1 < width) {
            data[idx + 4] += (error * 7) / 16;
            data[idx + 5] += (error * 7) / 16;
            data[idx + 6] += (error * 7) / 16;
          }
          if (y + 1 < height) {
            if (x > 0) {
              const i = ((y + 1) * width + (x - 1)) * 4;
              data[i] += (error * 3) / 16;
              data[i + 1] += (error * 3) / 16;
              data[i + 2] += (error * 3) / 16;
            }
            const i = ((y + 1) * width + x) * 4;
            data[i] += (error * 5) / 16;
            data[i + 1] += (error * 5) / 16;
            data[i + 2] += (error * 5) / 16;
            if (x + 1 < width) {
              const i = ((y + 1) * width + (x + 1)) * 4;
              data[i] += (error * 1) / 16;
              data[i + 1] += (error * 1) / 16;
              data[i + 2] += (error * 1) / 16;
            }
          }
        }
      }
    }

    destroy() {
      if (this.scrollTrigger) {
        this.scrollTrigger.kill();
      }
      this.container.innerHTML = '';
    }
  };
}
