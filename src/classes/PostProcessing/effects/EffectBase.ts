import { GUI } from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

/**
 * Base class for all post-processing effects
 */
export abstract class EffectBase {
  protected effectComposer: EffectComposer;
  protected name: string;

  constructor(effectComposer: EffectComposer, name: string) {
    this.effectComposer = effectComposer;
    this.name = name;
  }

  public abstract setup(): void;
  public abstract createUI(folder: GUI): void;

  public getName(): string {
    return this.name;
  }
}
