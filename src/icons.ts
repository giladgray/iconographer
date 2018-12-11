import { IconContents, IconName, IconNames, IconSvgPaths16 } from "@blueprintjs/icons";
import chroma from "chroma-js";

const blacklist: IconName[] = ["blank", "drag-handle-horizontal", "drag-handle-vertical", "full-circle"];

export interface IIconData {
    content: string;
    iconName: IconName;
    lightness: number[];
}

export function averages() {
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

function getLightness(icon: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext("2d")!;
    context.font = "16px Icons16";
    context.textBaseline = "top";
    context.fillText(icon, 0, 0);

    const data = context.getImageData(0, 0, 16, 16);
    const length = data.data.length;

    const colors = [];
    let i = 0;
    while (i < length) {
        const alpha = 1 - data.data[i + 3] / 255;
        const color = chroma(255 * alpha, 255 * alpha, 255 * alpha);
        colors.push(color.luminance());
        i += 4;
    }
    return colors;
}
