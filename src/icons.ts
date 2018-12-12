import { IconContents, IconName, IconNames } from "@blueprintjs/icons";
import chroma from "chroma-js";
import { getMagicNumber, mapPixels } from "./utils";

const blacklist: IconName[] = [
    "blank",
    "drag-handle-horizontal",
    "drag-handle-vertical",
    "full-circle",
    "slash",
    "minus",
    "small-minus",
    "numerical",
    "grid-view",
];

export interface IIconData {
    content: string;
    iconName: IconName;
    lightness: number[];
}

/** Get pixel data for all icons. */
export function getIconPixelData() {
    return Object.keys(IconNames)
        .map<IIconData | null>(key => {
            const iconName: IconName = IconNames[key];
            if (blacklist.indexOf(iconName) >= 0) {
                return null;
            }
            return { content: IconContents[key], iconName, lightness: getLightness(IconContents[key]) };
        })
        .filter(x => x != null);
}

// for some reason, the first time this is called it returns completely
// incorrect results. so we do it once here and throw away results.
// <App> calls it each time before computing icon cells on an image.
getIconPixelData();

function getLightness(icon: string) {
    // prepare canvas
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext("2d")!;
    context.font = "16px Icons16";
    context.textBaseline = "top";

    // render icon
    context.fillText(icon, 0, 0);

    // extract pixel data
    return mapPixels(context.getImageData(0, 0, 16, 16), (_r, _g, _b, a) => {
        const alpha = 1 - a / 255;
        const color = chroma(255 * alpha, 255 * alpha, 255 * alpha);
        return getMagicNumber(color);
    });
}
