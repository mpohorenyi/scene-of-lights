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

    this.createHouse();

    this.createTableWithChairsAndLantern();

    this.createCarWithStreetLight();

    this.skySystem = new SkySystem(this.sceneManager.scene, this.sceneManager.timer);
  }

  public getSkySystem(): SkySystem {
    return this.skySystem;
  }

  private createTerrain(): void {
    const terrainAlphaTexture = this.loadManager.loadTexture('textures/terrain/alpha.jpg');
    const terrainColorTexture = this.loadManager.loadTexture(
      'textures/terrain/aerial_grass_rock/diff_512.webp'
    );
    const terrainARMTexture = this.loadManager.loadTexture(
      'textures/terrain/aerial_grass_rock/arm_512.webp'
    );
    const terrainNormalTexture = this.loadManager.loadTexture(
      'textures/terrain/aerial_grass_rock/nor_gl_512.webp'
    );
    const terrainDisplacementTexture = this.loadManager.loadTexture(
      'textures/terrain/aerial_grass_rock/disp_512.webp'
    );

    terrainColorTexture.colorSpace = THREE.SRGBColorSpace;

    terrainColorTexture.repeat.set(8, 8);
    terrainARMTexture.repeat.set(8, 8);
    terrainNormalTexture.repeat.set(8, 8);
    terrainDisplacementTexture.repeat.set(8, 8);

    terrainColorTexture.wrapS = THREE.RepeatWrapping;
    terrainARMTexture.wrapS = THREE.RepeatWrapping;
    terrainNormalTexture.wrapS = THREE.RepeatWrapping;
    terrainDisplacementTexture.wrapS = THREE.RepeatWrapping;

    terrainColorTexture.wrapT = THREE.RepeatWrapping;
    terrainARMTexture.wrapT = THREE.RepeatWrapping;
    terrainNormalTexture.wrapT = THREE.RepeatWrapping;
    terrainDisplacementTexture.wrapT = THREE.RepeatWrapping;

    const terrain = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50, 100, 100),
      new THREE.MeshStandardMaterial({
        color: 'white',
        alphaMap: terrainAlphaTexture,
        transparent: true,
        map: terrainColorTexture,
        aoMap: terrainARMTexture,
        roughnessMap: terrainARMTexture,
        metalnessMap: terrainARMTexture,
        normalMap: terrainNormalTexture,
        displacementMap: terrainDisplacementTexture,
        displacementScale: 0.2,
        displacementBias: -0.1,
      })
    );

    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    this.sceneManager.scene.add(terrain);
  }

  private createHouse(): void {
    this.loadManager.loadGLTF('models/lp_americans_house_mobile_draco/scene.gltf', gltf => {
      const house = gltf.scene.children[0].children[0].children[0].children[0];

      house.scale.set(0.007, 0.007, 0.007);
      house.position.set(-4.2, 0, 1.4);
      house.rotation.y = Math.PI * 0.53;

      house.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.sceneManager.scene.add(house);
    });
  }

  private createTableWithChairsAndLantern(): void {
    const tableGroup = new THREE.Group();

    this.loadManager.loadGLTF(
      'models/outdoor_table_chair_set_01_1k.gltf/outdoor_table_chair_set_01_1k.gltf',
      gltf => {
        const tableWithChairs = gltf.scene;

        tableWithChairs.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        tableGroup.add(tableWithChairs);
      }
    );

    this.loadManager.loadGLTF('models/candle_lantern/scene.gltf', gltf => {
      const lantern = gltf.scene.children[0].children[0].children[0];

      lantern.scale.set(0.001, 0.001, 0.001);
      lantern.position.set(-0.19, 0.735, 0.16);
      lantern.rotation.x = -Math.PI * 0.5;

      lantern.traverse(child => {
        if (child.name === 'Material2' || child.name === 'Material2_2') {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      tableGroup.add(lantern);
    });

    tableGroup.position.set(2.1, -0.02, 3.3);
    tableGroup.rotation.y = Math.PI * 0.95;

    const maxCandleLightIntensity = 1.2;

    const candleLight = new THREE.PointLight(0xffb347, maxCandleLightIntensity, 2.7, 1.7);
    candleLight.position.set(-0.1, 0.86, 0.06);

    candleLight.castShadow = true;

    candleLight.shadow.mapSize.set(128, 128);

    candleLight.shadow.radius = 6;
    candleLight.shadow.bias = -0.005;

    candleLight.shadow.camera.near = 0.01;
    candleLight.shadow.camera.far = 2.7;

    tableGroup.add(candleLight);

    const maxGlowIntensity = 0.3;

    const glow = new THREE.PointLight(0xffb347, maxGlowIntensity, 0.8);
    glow.position.copy(candleLight.position);
    tableGroup.add(glow);

    this.sceneManager.scene.add(tableGroup);

    this.sceneManager.addToAnimationLoop(() => {
      const nightLightIntensity = this.skySystem.getNightLightIntensity();

      candleLight.intensity = maxCandleLightIntensity * nightLightIntensity;
      glow.intensity = maxGlowIntensity * nightLightIntensity;
    });
  }

  private createCarWithStreetLight(): void {
    const carGroup = new THREE.Group();

    this.loadManager.loadGLTF('models/covered_car_draco/scene.gltf', gltf => {
      const car = gltf.scene;

      car.scale.set(1.1, 1.1, 1.1);
      car.rotation.y = Math.PI * 0.4;

      car.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      carGroup.add(car);
    });

    this.loadManager.loadGLTF('models/stylized_street_light/scene.gltf', gltf => {
      const lamp = gltf.scene.children[0].children[0].children[0].children[0];

      lamp.scale.set(0.01, 0.01, 0.01);

      lamp.position.set(2.5, -0.03, -1);
      lamp.rotation.y = -Math.PI * 0.2;

      lamp.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      carGroup.add(lamp);
    });

    const maxStreetLightIntensity = 1.7;

    const streetLight = new THREE.SpotLight(
      '#ffffc2',
      maxStreetLightIntensity,
      5,
      Math.PI * 0.35,
      0.6,
      1
    );
    streetLight.position.set(2.1, 2.6, -0.51);
    streetLight.target.position.set(2.1, -3, 0);

    streetLight.castShadow = true;

    streetLight.shadow.mapSize.set(256, 256);

    streetLight.shadow.radius = 6;
    streetLight.shadow.bias = -0.005;

    streetLight.shadow.camera.near = 0.5;
    streetLight.shadow.camera.far = 4;

    carGroup.add(streetLight);
    carGroup.add(streetLight.target);

    carGroup.position.set(0.5, -0.03, -4.5);

    this.sceneManager.scene.add(carGroup);

    this.sceneManager.addToAnimationLoop(() => {
      const nightLightIntensity = this.skySystem.getNightLightIntensity();

      streetLight.intensity = maxStreetLightIntensity * nightLightIntensity;
    });
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
