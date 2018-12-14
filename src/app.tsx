import React from "react";
import { IIconCell, replacePicCells, SIZE } from "./face";
import { getIconPixelData } from "./icons";
import { ISettings, Settings } from "./settings";

import { Button, NonIdealState, Spinner } from "@blueprintjs/core";
import { ImageInput } from "./imageInput";

import "./app.css";

interface IState extends ISettings {
    status: "empty" | "loading" | "processing" | "done" | "error";
    icons: IIconCell[][];
}

export class App extends React.Component<{}, IState> {
    public state: IState = { color: true, fileName: undefined, icons: [], noise: 3, status: "empty" };

    private canvas: HTMLCanvasElement | null;
    private image: HTMLImageElement | null;

    public componentDidUpdate() {
        if (this.canvas == null || this.image == null || this.state.status !== "done") {
            return;
        }
        const context = this.canvas.getContext("2d");
        // clear canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, this.image.width, this.image.height);
        // paint image using icons
        context.font = "16px Icons16";
        context.textBaseline = "top";
        this.state.icons.forEach((row, y) => {
            row.forEach((c, x) => {
                context.fillStyle = this.state.color ? c.color : "black";
                const icon = noisyGet(c.icons, this.state.noise);
                context.fillText(icon.content, x * SIZE, y * SIZE);
            });
        });
    }

    public render() {
        return (
            this.renderStatus() || (
                <>
                    <Settings
                        {...this.state}
                        onColorChange={this.handleColorChange}
                        onFileChange={this.handleChange}
                        onNoiseChange={this.handleNoiseChange}
                        onRefresh={this.repaint}
                    />
                    <canvas
                        height={this.image && this.image.height}
                        width={this.image && this.image.width}
                        ref={ref => (this.canvas = ref)}
                    />
                </>
            )
        );
    }

    private renderStatus() {
        switch (this.state.status) {
            case "empty":
                return (
                    <NonIdealState
                        icon="image-rotate-left"
                        title="Choose an image"
                        action={<ImageInput onChange={this.handleChange} />}
                    />
                );
            case "error":
                return (
                    <NonIdealState
                        icon="error"
                        title="An error occured. Please try again."
                        action={<ImageInput onChange={this.handleChange} />}
                    />
                );
            case "loading":
                return <NonIdealState icon={<Spinner size={50} />} title="Loading image..." />;
            case "processing":
                return (
                    <NonIdealState
                        icon={<Spinner intent="primary" size={50} />}
                        title="Processing image..."
                        description="This can take several minutes for large images."
                    />
                );
            default:
                return null;
        }
    }

    private handleChange = async (files: FileList) => {
        this.setState({ status: "loading", fileName: files[0] ? files[0].name : undefined });
        this.image = await loadImage(files);
        if (this.image == null) {
            this.setState({ status: "error" });
            return;
        }
        this.setState({ status: "processing" });
        setTimeout(this.compute, 150);
    };

    private handleColorChange = (color: boolean) => this.setState({ color });

    private handleNoiseChange = (noise: number) => this.setState({ noise });

    private compute = () => {
        // this operation takes quite a while, increasing exponentially for larger photos.
        // re-compute icon values.
        const icons = replacePicCells(this.image, getIconPixelData());
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
