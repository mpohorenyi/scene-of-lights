import * as THREE from 'three';

import { LoadManager } from './LoadManager';
import { SceneManager } from './SceneManager';
import { SkySystem } from './SkySystem/SkySystem';

export class SceneSetup {
  private skySystem: SkySystem;

  constructor(
    private sceneManager: SceneManager,
    private loadManager: LoadManager
  ) {
    this.createTerrain();

    this.setupRendering();

    this.skySystem = new SkySystem(this.sceneManager.scene, this.sceneManager.timer);
  }

  public getSkySystem(): SkySystem {
    return this.skySystem;
  }

  private createTerrain(): void {
    const terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 'white' })
    );
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    this.sceneManager.scene.add(terrain);
  }

  private setupRendering(): void {
    this.sceneManager.renderer.shadowMap.enabled = true;
    this.sceneManager.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  public startAnimations(): void {
    this.sceneManager.addToAnimationLoop(() => {
      this.skySystem.update();
    });
  }
}
