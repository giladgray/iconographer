import { IconName, IconNames, IconSvgPaths16 } from "@blueprintjs/icons";
import chroma from "chroma-js";

const blacklist: IconName[] = ["blank", "drag-handle-horizontal", "drag-handle-vertical"];

export interface IIconData {
    iconName: IconName;
    img: HTMLImageElement;
    lightness: number[];
}

export function averages() {
    return Object.keys(IconNames)
        .map<IIconData | null>(key => {
            const iconName: IconName = IconNames[key];
            if (blacklist.indexOf(iconName) >= 0) {
                return null;
            }
            const img = svg2img(iconName);
            return { iconName, img, lightness: getLightness(img) };
        })
        .filter(x => x != null);
}

function svg2img(iconName: IconName) {
    const img = document.createElement("img");
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" view-box="0 0 16 16">`,
        ...IconSvgPaths16[iconName].map(p => `<path d="${p}" fill-rule="evenodd" />`),
        `</svg>`,
    ].join("\n");
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
    img.height = 16;
    img.width = 16;
    return img;
}

function getLightness(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext("2d")!;
    context.drawImage(img, 0, 0);

    const data = context.getImageData(0, 0, img.width, img.height);
    const length = data.data.length;

    const colors = [];
    let i = 0;
    while (i < length) {
        const alpha = data.data[i + 3] / 255;
        const color = chroma(255 * alpha, 255 * alpha, 255 * alpha);
        colors.push(1 - color.luminance());
        i += 4;
    }
    return colors;
}
