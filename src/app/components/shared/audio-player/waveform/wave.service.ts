import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WaveService {

  private readonly centerOfPixelPadding = 0.5;

  drawWave(canvasContext: CanvasRenderingContext2D, waveData: number[], width: number, height: number, color: string): void {
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.globalAlpha = 1;
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = 1;
    waveData.forEach((data, i) => this.drawWaveLine(canvasContext, data, i, height));
  }

  private drawWaveLine(canvasContext: CanvasRenderingContext2D, data: number, x: number, height: number): void {
    const value = Math.min(data, 0.5); // FIXME: Cap to 0.5, need to review processWave() to understand data
    const y1 = Math.round((height / 2) - (height * value));
    const y2 = height - y1;

    canvasContext.beginPath();
    canvasContext.moveTo(x + this.centerOfPixelPadding, y1);
    canvasContext.lineTo(x + this.centerOfPixelPadding, y2);
    canvasContext.stroke();
  }

  processWave(waveInput: number[], width: number): number[] {
    const waveData = [];
    const samplesPerPixel = Object.keys(waveInput).length / width;

    let nValue;
    for (let w = 0; w < width; w++) {
      const c = w * samplesPerPixel;
      nValue = 0.0;
      for (let s = 0; s < samplesPerPixel; s++) {
        nValue += Math.abs(waveInput[Math.floor(c) + s]) / 65536.0;
      }

      waveData[w] = nValue / samplesPerPixel;
    }
    return waveData;
  }
}
