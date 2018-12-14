import { FileInput, HTMLInputProps } from "@blueprintjs/core";
import React from "react";

interface IProps {
    fill?: boolean;
    text?: string;
    onChange: (files: FileList) => void;
}

export const ImageInput: React.SFC<IProps> = props => (
    <FileInput
        className="image-input"
        fill={props.fill}
        large={true}
        inputProps={{ accept: "image/png, image/jpeg", autoFocus: true, onChange: getFiles(props.onChange) }}
        text={props.text}
    />
);

function getFiles(onChange: IProps["onChange"]) {
    return ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => onChange(files);
}
