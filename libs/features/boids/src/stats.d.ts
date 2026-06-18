declare module 'stats.js' {
  export default class Stats {
    dom: HTMLElement;
    begin(): void;
    end(): void;
    update(): void;
  }
}

declare module 'cannon-es-debugger' {
  import type { Scene } from 'three';
  import type { World } from 'cannon-es';

  type DebuggerOptions = {
    color?: number;
    onInit?: (body: unknown, mesh: { visible: boolean }) => void;
  };

  export default function Debugger(
    scene: Scene,
    world: World,
    options?: DebuggerOptions
  ): { update: () => void };
}
