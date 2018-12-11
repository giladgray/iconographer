// break image into piccells of size #x#
// replace piccell with closest icon

import { IconName } from "@blueprintjs/icons";
import chroma, { Color } from "chroma-js";
import { IIconData } from "./icons";

const SIZE = 16;

export function replacePicCells(img: HTMLImageElement, icons: IIconData[]) {
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = img.width;
    canvas.height = img.height;
    document.getElementById("canvas").remove();
    document.body.appendChild(canvas);

    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    context.font = "16px Icons16";

    const cells: Array<Array<{ iconName: IconName; color: string; content: string }>> = [];
    for (let y = 0; y < img.height; y += SIZE) {
        const row: Array<{ iconName: IconName; color: string; content: string }> = [];
        for (let x = 0; x < img.width; x += SIZE) {
            const { data } = context.getImageData(x, y, SIZE, SIZE);
            const colors: Color[] = [];
            let i = 0;
            while (i < data.length) {
                colors.push(chroma(data[i], data[i + 1], data[i + 2], "rgb"));
                i += 4;
            }
            const icon = findClosestIcon(colors.map(c => c.luminance()), icons);
            row.push({ iconName: icon.iconName, color: chroma.average(colors).hex(), content: icon.content });
        }
        cells.push(row);
    }

    context.fillStyle = "white";
    context.fillRect(0, 0, img.width, img.height);
    cells.forEach((row, y) => {
        row.forEach((c, x) => {
            context.fillStyle = c.color;
            context.fillText(c.content, x * SIZE, y * SIZE);
        });
    });
    return cells;
}

export function findClosestIcon(data: number[], icons: IIconData[]) {
    let min = Infinity;
    let minIndex = -1;
    icons.reverse().forEach((entry, i) => {
        const diff = meanSquareError(data, entry.lightness);
        if (diff < min) {
            min = diff;
            minIndex = i;
        }
    });
    return icons[minIndex];
}

// closest array match
function meanSquareError(a: number[], b: number[]) {
    let sum = 0;
    for (let i = 0; i < 256; i++) {
        const noise = Math.random() - 0.5;
        const error = a[i] - b[i] + noise;
        sum += error * error;
    }
    return Math.sqrt(sum / 256.0);
}
