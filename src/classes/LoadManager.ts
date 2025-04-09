import * as THREE from 'three';
import { DRACOLoader, GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';

export class LoadManager {
  private LoadingManager: THREE.LoadingManager;
  private TextureLoader: THREE.TextureLoader;
  private DRACOLoader: DRACOLoader;
  private GLTFLoader: GLTFLoader;

  constructor() {
    this.LoadingManager = new THREE.LoadingManager();

    this.TextureLoader = new THREE.TextureLoader(this.LoadingManager);

    this.DRACOLoader = new DRACOLoader(this.LoadingManager);
    this.DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    this.GLTFLoader = new GLTFLoader(this.LoadingManager);
    this.GLTFLoader.setDRACOLoader(this.DRACOLoader);

    this.setupLoadingManager();
  }

  public loadTexture(url: string): THREE.Texture {
    const texture = this.TextureLoader.load(url, undefined, undefined, error => {
      console.error(`Error loading texture ${url}:`, error);
    });

    return texture;
  }

  public loadTextures(urls: string[]): THREE.Texture[] {
    return urls.map(url => this.loadTexture(url));
  }

  public loadGLTF(
    url: string,
    onLoad: (data: GLTF) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void
  ): void {
    this.GLTFLoader.load(
      url,
      gltf => {
        onLoad(gltf);
      },
      onProgress,
      error => {
        if (onError) {
          onError(error);
        } else {
          console.error(`Error loading GLTF ${url}:`, error);
        }
      }
    );
  }

  private setupLoadingManager(): void {
    this.LoadingManager.onStart = (url: string, loaded: number, total: number) => {
      console.log(`Loading asset: ${url}: ${loaded}/${total}`);
    };

    this.LoadingManager.onLoad = () => {
      console.log('All assets loaded');
    };

    this.LoadingManager.onProgress = (url: string, loaded: number, total: number) => {
      console.log(`Loading asset: ${url}: ${loaded}/${total}`);
    };

    this.LoadingManager.onError = (url: string) => {
      console.error(`Error loading asset: ${url}`);
    };
  }
}
