export function mapPixels<T>({ data }: ImageData, callback: (r: number, g: number, b: number, a: number) => T) {
    const colors: T[] = [];
    let i = 0;
    while (i < data.length) {
        colors.push(callback(data[i], data[i + 1], data[i + 2], data[i + 3]));
        i += 4;
    }
    return colors;
}
