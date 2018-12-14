// tslint:disable
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// tslint:enable

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

ReactDOM.render(React.createElement(App), document.getElementById("app"));
