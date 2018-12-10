import { IconName, IconNames, IconSvgPaths16 } from "@blueprintjs/icons";

export const averages = Object.keys(IconNames)
    .slice(0, 1)
    .map(async key => {
        const iconName: IconName = IconNames[key];
        const img = svg2img(iconName);
        const average = getAverageColor(img);
        return { iconName, average };
    });

function svg2img(iconName: IconName) {
    const img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    img.setAttribute("fill", "black");
    img.setAttribute("width", "16");
    img.setAttribute("height", "16");
    img.setAttribute("view-box", "0 0 16 16");
    IconSvgPaths16[iconName].forEach(p => (img.innerHTML += `<path d="${p}" fill-rule="evenodd"></path>`));
    document.body.appendChild(img);
    return img;
}

function getAverageColor(img: SVGSVGElement) {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const context = canvas.getContext && canvas.getContext("2d");
    const rgb = { r: 102, g: 102, b: 102 }; // Set a base colour as a fallback for non-compliant browsers
    const pixelInterval = 1;
    let count = 0;
    let i = -4;
    let data: ImageData;

    // return the base colour for non-compliant browsers
    if (!context) {
        return rgb;
    }

    // set the height and width of the canvas element to that of the image
    canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    context.drawImage(img, 0, 0);

    try {
        data = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
        // catch errors - usually due to cross domain security issues
        console.error(e);
        return rgb;
    }

    const length = data.data.length;
    // tslint:disable-next-line:no-conditional-assignment
    while ((i += pixelInterval * 4) < length) {
        count++;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // floor the average values to give correct rgb values (ie: round number values)
    rgb.r = Math.floor(rgb.r / count);
    rgb.g = Math.floor(rgb.g / count);
    rgb.b = Math.floor(rgb.b / count);

    return rgb;
}
