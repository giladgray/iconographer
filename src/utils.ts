import { Color } from "chroma-js";

/**
 * Invoke a callback for each group of pixel data in the `ImageData` array and
 * collect the results into a new array.
 */
export function mapPixels<T>({ data }: ImageData, callback: (r: number, g: number, b: number, a: number) => T) {
    const colors: T[] = [];
    let i = 0;
    while (i < data.length) {
        colors.push(callback(data[i], data[i + 1], data[i + 2], data[i + 3]));
        i += 4;
    }
    return colors;
}

/** One place for logic to convert color to magic comparison value. */
export function getMagicNumber(color: Color) {
    return color.hsl()[2];
}
