const ANALYSIS_WIDTH = 176;
const MAX_HEIGHT = 144;

/** Creates a small, feathered mask around the largest wall-colored area near the image center. */
export function createAutoWallMask(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const scale = Math.min(ANALYSIS_WIDTH / image.naturalWidth, MAX_HEIGHT / image.naturalHeight, 1);
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const sample = document.createElement("canvas");
        sample.width = width;
        sample.height = height;
        const sampleContext = sample.getContext("2d", { willReadFrequently: true });
        sampleContext.drawImage(image, 0, 0, width, height);
        const pixels = sampleContext.getImageData(0, 0, width, height).data;
        const seedX = Math.max(0, Math.min(width - 1, Math.floor(width * 0.5)));
        const seedY = Math.max(0, Math.min(height - 1, Math.floor(height * 0.46)));
        const seedIndex = (seedY * width + seedX) * 4;
        const seed = [pixels[seedIndex], pixels[seedIndex + 1], pixels[seedIndex + 2]];

        const visited = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0;
        let tail = 0;
        const seedPixel = seedY * width + seedX;
        queue[tail++] = seedPixel;
        visited[seedPixel] = 1;
        const maxDistanceSquared = 92 * 92;
        const bottomLimit = Math.floor(height * 0.92);

        while (head < tail) {
          const pixel = queue[head++];
          const x = pixel % width;
          const y = Math.floor(pixel / width);
          const neighbors = [x > 0 ? pixel - 1 : -1, x < width - 1 ? pixel + 1 : -1, y > 0 ? pixel - width : -1, y < bottomLimit ? pixel + width : -1];
          for (const next of neighbors) {
            if (next < 0 || visited[next]) continue;
            const offset = next * 4;
            const red = pixels[offset] - seed[0];
            const green = pixels[offset + 1] - seed[1];
            const blue = pixels[offset + 2] - seed[2];
            if (red * red + green * green + blue * blue > maxDistanceSquared) continue;
            visited[next] = 1;
            queue[tail++] = next;
          }
        }

        const areaRatio = tail / (width * height);
        const mask = document.createElement("canvas");
        mask.width = width;
        mask.height = height;
        const maskContext = mask.getContext("2d");
        const maskPixels = maskContext.createImageData(width, height);
        for (let index = 0; index < visited.length; index += 1) {
          if (!visited[index]) continue;
          const offset = index * 4;
          maskPixels.data[offset] = 255;
          maskPixels.data[offset + 1] = 255;
          maskPixels.data[offset + 2] = 255;
          maskPixels.data[offset + 3] = 255;
        }
        maskContext.putImageData(maskPixels, 0, 0);

        const feathered = document.createElement("canvas");
        feathered.width = width * 3;
        feathered.height = height * 3;
        const featherContext = feathered.getContext("2d");
        featherContext.filter = "blur(2px)";
        featherContext.drawImage(mask, 0, 0, feathered.width, feathered.height);
        resolve({ mask: feathered.toDataURL("image/png"), areaRatio });
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error("Could not read the selected photo."));
    image.src = source;
  });
}
