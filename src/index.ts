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

// tslint:disable-next-line:no-submodule-imports
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

ReactDOM.render(React.createElement(App), document.getElementById("app"));
