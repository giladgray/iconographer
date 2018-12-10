import { replacePicCells } from "./face";
import { averages } from "./icons";
import { findClosestIcon } from "./iconValues";

// Gilad Gray [11:07 AM]
// 1. for each icon: svg -> png -> average
// 2. for each pixel/sample of piotr: find most suitable icon, maybe colorize (edited)

// Bill Dwyer [11:08 AM]
// svg -> png
// for each png, create an array of `{avgLightness , iconName }`. sort by `avgLightness`
// for each piotr pixel, binary search to find nearest `avgLightness`
// colorize icon using hue/sat from piotr pixel

// Gilad Gray [11:10 AM]
// perhaps 1 “piotr-pixel” `pp` == 16x16 “actual pixels”

// Bill Dwyer [11:10 AM]
// now it gets more interesting
// and you probably actually want to match 16x16 piotr pixels with 16x16 icon pixels
// for that i would do the `sqrt(sum((piotr.lightness - icon.lightness)^2))`

const icons = averages();
console.log(icons.slice(0, 5));

const input = document.getElementById("file") as HTMLInputElement;
input.onchange = () => {
    if (input.files.length < 1) {
        return;
    }

    const image = document.createElement("img");
    image.src = window.URL.createObjectURL(input.files[0]);
    image.addEventListener("load", () => {
        console.log("loaded");
        replacePicCells(image, icons);
    });
};
