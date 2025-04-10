import GUI from 'lil-gui';

import { SkySystem } from './SkySystem';

export class UIManager {
  public gui: GUI;

  constructor() {
    this.gui = new GUI({
      width: 300,
      closeFolders: true,
      title: 'Scene of Lights',
      container: document.querySelector('.debug-ui') as HTMLDivElement,
    });
    this.gui.close();
  }

  public initSkyInterface(skySystem: SkySystem): void {
    skySystem.setTimeDisplayCallback(timeString => {
      this.updateTimeDisplay(timeString);
    });

    this.createSkyControls(skySystem);
  }

  public updateTimeDisplay(timeString: string): void {
    const timeDisplay = document.querySelector('.time-display');

    if (timeDisplay) {
      timeDisplay.textContent = `Time: ${timeString}`;
    }
  }

  private createSkyControls(skySystem: SkySystem): void {
    const skyFolder = this.gui.addFolder('Sky System');

    skyFolder
      .add({ animate: false }, 'animate')
      .name('Enable Sun Animation')
      .onChange((value: boolean) => {
        skySystem.setAnimationEnabled(value);
      });

    skyFolder
      .add({ time: skySystem.getDayTime() }, 'time', 0, 24, 0.1)
      .name('Time of Day')
      .onChange((value: number) => {
        skySystem.setDayTime(value);
      });

    skyFolder
      .add({ speed: 8 }, 'speed', 1, 80, 1)
      .name('Sun Animation Speed')
      .onChange((value: number) => {
        skySystem.setAnimationSpeed(value);
      });

    const locationFolder = skyFolder.addFolder('Location Settings');

    locationFolder
      .add({ value: skySystem.getLatitude() }, 'value', -80, 80, 1)
      .name('Latitude')
      .onChange((value: number) => {
        skySystem.setLatitude(value);
      });

    locationFolder
      .add({ value: skySystem.getDayOfYear() }, 'value', 1, 365, 1)
      .name('Day of Year')
      .onChange((value: number) => {
        skySystem.setDayOfYear(value);
      });

    const visibilityFolder = skyFolder.addFolder('Visibility');

    visibilityFolder
      .add({ helpers: false }, 'helpers')
      .name('Show Helpers')
      .onChange((value: boolean) => {
        skySystem.setHelpersVisibility(value);
      });

    visibilityFolder
      .add({ showSunPath: false }, 'showSunPath')
      .name('Show Sun Path')
      .onChange((value: boolean) => {
        skySystem.setSunPathVisibility(value);
      });
  }
}
