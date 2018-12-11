import React from "react";
import { replacePicCells } from "./face";
import { averages } from "./icons";

interface IState {
    state: "empty" | "loading" | "processing" | "done" | "error";
    fileName?: string;
    noise: number;
}

export class App extends React.Component<{}, IState> {
    public state: IState = { state: "empty", noise: 0.3 };

    private readonly icons = averages();

    private canvas: HTMLCanvasElement | null;
    private image: HTMLImageElement | null;

    public componentDidMount() {
        console.log(this.icons);
    }

    public render() {
        return (
            <div>
                <div>
                    <input type="file" accept="image/png, image/jpeg" autoFocus={true} onChange={this.handleChange} />
                    <input type="number" value={this.state.noise} onChange={this.handleNoiseChange} />
                    <button children="Refresh" disabled={!this.state.fileName} onClick={this.repaint} />
                </div>
                <hr />
                <canvas ref={ref => (this.canvas = ref)} />
            </div>
        );
    }

    private handleChange: React.ChangeEventHandler<HTMLInputElement> = async ({ target: { files } }) => {
        this.setState({ state: "loading", fileName: files[0] ? files[0].name : undefined });
        this.image = await loadImage(files);
        if (this.image == null) {
            this.setState({ state: "error" });
            return;
        }
        this.setState({ state: "processing" }, this.repaint);
    };

    private handleNoiseChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        this.setState({ noise: +value });
    };

    private repaint = () => {
        return new Promise(resolve => resolve(replacePicCells(this.canvas, this.image, this.icons, this.state.noise)));
    };
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
