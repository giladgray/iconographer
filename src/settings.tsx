import { Button, Card, Classes, Divider, FormGroup, Slider, Switch } from "@blueprintjs/core";
import React from "react";
import { ImageInput } from "./imageInput";

export interface ISettings {
    color: boolean;
    fileName: string | undefined;
    noise: number;
}

interface ISettingsProps extends ISettings {
    onColorChange: (color: boolean) => void;
    onFileChange: (files: FileList) => void;
    onNoiseChange: (noise: number) => void;
    onRefresh: () => void;
}

export class Settings extends React.Component<ISettingsProps> {
    public render() {
        return (
            <Card className="settings">
                <ImageInput fill={true} onChange={this.props.onFileChange} text={this.props.fileName} />
                <Divider className="divider" />
                <p className={Classes.TEXT_MUTED}>Right-click image to save to your computer.</p>
                <FormGroup label="Noise" inline={true} helperText="Choose randomly from the top N icons.">
                    <Slider min={0} max={10} value={this.props.noise} onChange={this.props.onNoiseChange} />
                </FormGroup>
                <FormGroup label="Color" inline={true}>
                    <Switch checked={this.props.color} onChange={this.handleColorChange}>
                        Colorize icons
                    </Switch>
                </FormGroup>
                <Button fill={true} text="Refresh" disabled={!this.props.fileName} onClick={this.props.onRefresh} />
            </Card>
        );
    }

    private handleColorChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) =>
        this.props.onColorChange(checked);
}
