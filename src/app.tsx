import { IconContents, IconName } from "@blueprintjs/icons";
import React from "react";
import { IconGrid, replacePicCells, SIZE } from "./face";
import { averages } from "./icons";

import "./app.css";

interface IState {
    status: "empty" | "loading" | "processing" | "done" | "error";

    color: boolean;
    fileName?: string;
    icons: IconGrid;
    noise: number;
}

export class App extends React.Component<{}, IState> {
    public state: IState = { status: "empty", noise: 3, icons: [], color: true };

    private icons = averages();
    private canvas: HTMLCanvasElement | null;
    private image: HTMLImageElement | null;

    public componentDidUpdate() {
        if (this.canvas == null || this.image == null) {
            return;
        }
        const context = this.canvas.getContext("2d");
        // clear canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, this.image.width, this.image.height);
        // paint image using icons
        context.font = "16px Icons16";
        context.textBaseline = "top";
        const usedIcons = new Set<IconName>();
        this.state.icons.forEach((row, y) => {
            row.forEach((c, x) => {
                context.fillStyle = this.state.color ? c.color : "black";
                const icon = this.icons[noisyGet(c.iconIndices, this.state.noise)];
                context.fillText(icon.content, x * SIZE, y * SIZE);
                usedIcons.add(icon.iconName);
            });
        });
        console.log("Unique icons used:", Array.from(usedIcons.keys()));
    }

    public render() {
        return (
            <div>
                <div className="settings">
                    <span>File</span>
                    <input type="file" accept="image/png, image/jpeg" autoFocus={true} onChange={this.handleChange} />
                    <span>Noise</span>
                    <input type="number" min={0} max={10} value={this.state.noise} onChange={this.handleNoiseChange} />
                    <span>Color</span>
                    <input type="checkbox" checked={this.state.color} onChange={this.handleColorChange} />
                    <button children="Refresh" disabled={!this.state.fileName} onClick={this.repaint} />
                </div>
                {this.renderMessage()}
                <canvas
                    height={this.image && this.image.height}
                    width={this.image && this.image.width}
                    ref={ref => (this.canvas = ref)}
                />
                <span className="preload-font" style={{ fontFamily: "Icons16" }} />
            </div>
        );
    }

    private renderMessage() {
        switch (this.state.status) {
            case "empty":
                return <p>Choose an image to iconifize!</p>;
            case "error":
                return <p>An error occurred. Please try again.</p>;
            case "loading":
                return <p>Loading image...</p>;
            case "processing":
                return <p>Processing image... This can take a while...</p>;
            default:
                return null;
        }
    }

    private handleChange: React.ChangeEventHandler<HTMLInputElement> = async ({ target: { files } }) => {
        this.setState({ status: "loading", fileName: files[0] ? files[0].name : undefined });
        this.image = await loadImage(files);
        if (this.image == null) {
            this.setState({ status: "error" });
            return;
        }
        this.setState({ status: "processing" });
        setTimeout(this.compute, 20);
    };

    private handleColorChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
        this.setState({ color: checked });
    };

    private handleNoiseChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        this.setState({ noise: +value });
    };

    private compute = () => {
        // this operation takes quite a while, increasing expo for larger photos.
        this.icons = averages();
        const icons = replacePicCells(this.image, this.icons);
        this.setState({ status: "done", icons });
    };

    private repaint = () => this.forceUpdate();
}

export function loadImage(files: FileList) {
    return new Promise<HTMLImageElement>(resolve => {
        if (files.length < 1) {
            resolve(null);
        }
        const image = document.createElement("img");
        image.src = window.URL.createObjectURL(files[0]);
        image.addEventListener("load", () => resolve(image));
    });
}

/** Get an element within the first `noise` items. */
function noisyGet<T>(items: T[], noise: number) {
    return items[Math.min(items.length - 1, Math.round(Math.random() * noise))];
}
