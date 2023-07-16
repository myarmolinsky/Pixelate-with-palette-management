import { useContext } from "react";
import { useImage } from "./useImage";
import { UIState } from "../App";

export const useFile = () => {
    const image = useImage();
    const { file, blob } = useContext(UIState);

    const read = (chosenFile: File) => {
        const fileReader = new FileReader();
        fileReader.onloadend = (event) => {
            if (file == null || blob == null) {
                return;
            }
            file.current = chosenFile;
            blob.current = event.target?.result as string;
            image.create(blob.current);
        };
        try {
            fileReader.readAsDataURL(chosenFile);
        } catch (e) {
            // no file - do nothing
        }
    };

    return {
        read,
    };
};
