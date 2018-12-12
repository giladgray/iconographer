// break image into piccells of size #x#
// replace piccell with closest icon

import chroma from "chroma-js";
import { IIconData } from "./icons";
import { getMagicNumber, mapPixels } from "./utils";

export const SIZE = 16;

export interface IIconCell {
    color: string;
    icons: IIconData[];
}

export function replacePicCells(img: HTMLImageElement, iconData: IIconData[]): IIconCell[][] {
    // prepare canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // draw image
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    context.font = "16px Icons16";
    context.textBaseline = "top";

    // find closest icon for each SIZExSIZE block
    const cells: IIconCell[][] = [];
    for (let y = 0; y < img.height; y += SIZE) {
        const row: IIconCell[] = [];
        for (let x = 0; x < img.width; x += SIZE) {
            const colors = mapPixels(context.getImageData(x, y, SIZE, SIZE), (r, g, b) => chroma(r, g, b, "rgb"));
            const icons = findClosestIcons(colors.map(getMagicNumber), iconData);
            row.push({ color: chroma.average(colors).hex(), icons });
        }
        cells.push(row);
    }
    return cells;
}

function findClosestIcons(data: number[], icons: IIconData[]) {
    return icons
        .map(icon => ({ icon, v: meanSquareError(data, icon.lightness) }))
        .sort((a, b) => a.v - b.v)
        .slice(0, 10)
        .map(x => x.icon);
}

function meanSquareError(a: number[], b: number[]) {
    let sum = 0;
    for (let i = 0; i < 256; i++) {
        const error = a[i] - b[i];
        sum += error * error;
    }
    return Math.sqrt(sum / 256.0);
}
