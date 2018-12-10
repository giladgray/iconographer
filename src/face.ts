// break image into piccells of size #x#
// replace piccell with closest icon

import { IconName } from "@blueprintjs/icons";
import chroma from "chroma-js";
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

    const cells: IconName[][] = [];
    for (let y = 0; y < img.height; y += SIZE) {
        const row: IconName[] = [];
        for (let x = 0; x < img.width; x += SIZE) {
            const { data } = context.getImageData(x, y, SIZE, SIZE);
            const colors = [];
            let i = 0;
            while (i < data.length) {
                colors.push(chroma(data[i], data[i + 1], data[i + 2], "rgb").luminance());
                i += 4;
            }
            const icon = findClosestIcon(colors, icons);
            context.drawImage(icon.img, x, y);
            row.push(icon.iconName);
        }
        cells.push(row);
    }
    console.log(cells);

    return cells;
}

export function findClosestIcon(data: number[], icons: IIconData[]) {
    let min = Infinity;
    let minIndex = -1;
    icons.forEach((entry, i) => {
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
        const error = a[i] - b[i];
        sum += error * error;
    }
    return Math.sqrt(sum / 256.0);
}
