import { ChangeEvent, useRef } from "react";
import { useFile } from "../../hooks/useFiles";
import { Button } from "@mui/material";

export const Index = () => {
    const selectImageInputRef = useRef<HTMLInputElement | null>(null);
    const file = useFile();

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const source = event.target.files?.[0];
        if (source != null) {
            file.read(source);
        }
    };

    const handleImageButton = () => {
        selectImageInputRef.current && selectImageInputRef.current.click();
    };

    return (
        <>
            <input
                accept="image/*"
                className="displayNone"
                onChange={handleFile}
                ref={selectImageInputRef}
                type="file"
                hidden
            />
            <Button onClick={handleImageButton} variant="contained">
                Select Image
            </Button>
        </>
    );
};
