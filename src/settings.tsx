import { Button, Card, Classes, Divider, FormGroup, Slider, Switch, Tooltip } from "@blueprintjs/core";
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

interface ISettingsState {
    showSettings: boolean;
}

export class Settings extends React.Component<ISettingsProps, ISettingsState> {
    public state: ISettingsState = { showSettings: true };

    public render() {
        const { showSettings } = this.state;
        return (
            <>
                {showSettings && (
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
                        <Button
                            fill={true}
                            text="Refresh"
                            disabled={!this.props.fileName}
                            onClick={this.props.onRefresh}
                        />
                    </Card>
                )}
                <Tooltip className="toggle" content={`${showSettings ? "Hide" : "Show"} settings`} position="left">
                    <Button icon={showSettings ? "eye-off" : "cog"} onClick={this.handleSettingsToggle} />
                </Tooltip>
            </>
        );
    }

    private handleColorChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) =>
        this.props.onColorChange(checked);

    private handleSettingsToggle = () => this.setState({ showSettings: !this.state.showSettings });
}
