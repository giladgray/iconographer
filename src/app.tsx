import React from "react";
import { IconGrid, replacePicCells, SIZE } from "./face";
import { averages } from "./icons";

interface IState {
    state: "empty" | "loading" | "processing" | "done" | "error";
    fileName?: string;
    noise: number;
    icons: IconGrid;
}

export class App extends React.Component<{}, IState> {
    public state: IState = { state: "empty", noise: 3, icons: [] };

    private readonly icons = averages();

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
        this.state.icons.forEach((row, y) => {
            row.forEach((c, x) => {
                context.fillStyle = c.color;
                const index = noisyGet(c.iconIndices, this.state.noise);
                context.fillText(this.icons[index].content, x * SIZE, y * SIZE);
            });
        });
    }

    public render() {
        return (
            <div>
                <div>
                    <input type="file" accept="image/png, image/jpeg" autoFocus={true} onChange={this.handleChange} />
                    <input type="number" min={0} max={10} value={this.state.noise} onChange={this.handleNoiseChange} />
                    <button children="Refresh" disabled={!this.state.fileName} onClick={this.repaint} />
                </div>
                <hr />
                {this.renderMessage()}
                <canvas
                    height={this.image && this.image.height}
                    width={this.image && this.image.width}
                    ref={ref => (this.canvas = ref)}
                />
            </div>
        );
    }

    private renderMessage() {
        switch (this.state.state) {
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
        this.setState({ state: "loading", fileName: files[0] ? files[0].name : undefined });
        this.image = await loadImage(files);
        if (this.image == null) {
            this.setState({ state: "error" });
            return;
        }
        this.setState({ state: "processing" });
        setTimeout(this.compute);
    };

    private handleNoiseChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        this.setState({ noise: +value });
    };

    private compute = () => {
        // this operation takes quite a while, increasing expo for larger photos.
        const icons = replacePicCells(this.image, this.icons);
        this.setState({ state: "done", icons });
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
    return items[Math.min(items.length - 1, Math.floor(Math.random() * noise))];
}
