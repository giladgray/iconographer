// break image into piccells of size #x#
// replace piccell with closest icon

import { IconName } from "@blueprintjs/icons";
import chroma, { Color } from "chroma-js";
import { IIconData } from "./icons";
import { mapPixels } from "./mapPixels";

const SIZE = 16;

export function replacePicCells(img: HTMLImageElement, icons: IIconData[]) {
    // prepare canvas
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = img.width;
    canvas.height = img.height;
    document.getElementById("canvas").remove();
    document.body.appendChild(canvas);

    // draw image
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    // find closest icon for each SIZExSIZE block
    const cells: Array<Array<{ iconName: IconName; color: string; content: string }>> = [];
    for (let y = 0; y < img.height; y += SIZE) {
        const row: Array<{ iconName: IconName; color: string; content: string }> = [];
        for (let x = 0; x < img.width; x += SIZE) {
            const colors = mapPixels(context.getImageData(x, y, SIZE, SIZE), (r, g, b) => chroma(r, g, b, "rgb"));
            const icon = findClosestIcon(colors.map(c => c.luminance()), icons);
            row.push({ iconName: icon.iconName, color: chroma.average(colors).hex(), content: icon.content });
        }
        cells.push(row);
    }

    // clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, img.width, img.height);

    // paint icons from above in place of image
    context.font = "16px Icons16";
    context.textBaseline = "top";
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

function meanSquareError(a: number[], b: number[]) {
    let sum = 0;
    const noise = 0; // (Math.random() - 0.5) / 2;
    for (let i = 0; i < 256; i++) {
        const error = a[i] - b[i] + noise;
        sum += error * error;
    }
    return Math.sqrt(sum / 256.0);
}
