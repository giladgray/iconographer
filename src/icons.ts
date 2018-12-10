import { IconName, IconNames, IconSvgPaths16 } from "@blueprintjs/icons";
import chroma from "chroma-js";

export function averages() {
    return Object.keys(IconNames)
        .map(key => {
            const iconName: IconName = IconNames[key];
            const img = svg2img(iconName);
            const average = getAverageColor(img);
            return { iconName, average };
        })
        .sort((a, b) => a.average - b.average);
}

function svg2img(iconName: IconName) {
    const img = document.createElement("img");
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" view-box="0 0 16 16">`,
        ...IconSvgPaths16[iconName].map(p => `<path fill="#000000" d="${p}" fill-rule="evenodd" />`),
        `</svg>`,
    ].join("\n");
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
    img.height = 16;
    img.width = 16;
    return img;
}

function getAverageColor(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext && canvas.getContext("2d");
    if (!context) {
        console.error("non-compliant browser. must support canvas context.");
        return 0;
    }

    // set the height and width of the canvas element to that of the image
    canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    context.drawImage(img, 0, 0);

    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    const length = data.data.length;

    const colors = [];
    let i = 0;
    while (i < length) {
        const alpha = data.data[i + 3] / 255;
        colors.push(chroma(255 * alpha, 255 * alpha, 255 * alpha));
        i += 4;
    }
    return chroma.average(colors).rgba()[0];
}
