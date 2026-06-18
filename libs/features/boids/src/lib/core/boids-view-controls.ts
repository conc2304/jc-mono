import type { Group } from 'three';

type BoidsViewControlsOptions = {
  element: HTMLElement;
  target: Group;
  onDragChange?: (isDragging: boolean) => void;
};

const ROTATE_SPEED = 0.004;
const MAX_PITCH = Math.PI / 2 - 0.15;

export class BoidsViewControls {
  #element: HTMLElement;
  #target: Group;
  #onDragChange?: (isDragging: boolean) => void;
  #isDragging = false;
  #yaw = 0;
  #pitch = 0;
  #lastX = 0;
  #lastY = 0;

  #onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.#isDragging = true;
    this.#lastX = event.clientX;
    this.#lastY = event.clientY;
    this.#element.setPointerCapture(event.pointerId);
    this.#onDragChange?.(true);
  };

  #onPointerMove = (event: PointerEvent) => {
    if (!this.#isDragging) return;

    const deltaX = event.clientX - this.#lastX;
    const deltaY = event.clientY - this.#lastY;
    this.#lastX = event.clientX;
    this.#lastY = event.clientY;

    this.#yaw -= deltaX * ROTATE_SPEED;
    this.#pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, this.#pitch - deltaY * ROTATE_SPEED));
    this.#applyRotation();
  };

  #onPointerUp = (event: PointerEvent) => {
    if (!this.#isDragging) return;
    this.#isDragging = false;
    this.#element.releasePointerCapture(event.pointerId);
    this.#onDragChange?.(false);
  };

  constructor({ element, target, onDragChange }: BoidsViewControlsOptions) {
    this.#element = element;
    this.#target = target;
    this.#onDragChange = onDragChange;

    this.#element.style.touchAction = 'none';
    this.#element.style.cursor = 'grab';
    this.#element.addEventListener('pointerdown', this.#onPointerDown);
    this.#element.addEventListener('pointermove', this.#onPointerMove);
    this.#element.addEventListener('pointerup', this.#onPointerUp);
    this.#element.addEventListener('pointerleave', this.#onPointerUp);
    this.#element.addEventListener('pointercancel', this.#onPointerUp);
  }

  #applyRotation(): void {
    this.#target.rotation.set(this.#pitch, this.#yaw, 0);
  }

  dispose(): void {
    this.#element.removeEventListener('pointerdown', this.#onPointerDown);
    this.#element.removeEventListener('pointermove', this.#onPointerMove);
    this.#element.removeEventListener('pointerup', this.#onPointerUp);
    this.#element.removeEventListener('pointerleave', this.#onPointerUp);
    this.#element.removeEventListener('pointercancel', this.#onPointerUp);
    this.#element.style.cursor = '';
    this.#element.style.touchAction = '';
  }
}
