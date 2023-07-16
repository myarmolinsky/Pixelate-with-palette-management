import { Button, Grid } from "@mui/material";
import { ChangeEvent, useState } from "react";

export const App = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleUpload = (event: ChangeEvent) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result as string);
        };

        if (file != null) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <Grid container spacing={1} direction="column">
            <Grid item>
                {imageUrl && <img src={imageUrl} alt="uploaded" height="300" />}
            </Grid>
            <Grid item>
                <Button variant="contained" component="label">
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleUpload}
                    />
                </Button>
            </Grid>
        </Grid>
    );
};
