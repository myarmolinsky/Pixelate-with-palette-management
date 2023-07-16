import { useContext, useEffect, useRef } from "react";
import { UIState } from "../App";

export const useImage = () => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const image = useRef<HTMLImageElement | null>(null);

    const { setStats } = useContext(UIState);

    useEffect(() => {
        canvas.current = document.getElementById("canvas") as HTMLCanvasElement;
    }, []);

    const pixelate = () => {
        if (canvas.current == null) {
            return;
        }
        console.log("*** canvas.current", canvas.current);
        // get dimensions from the image that we just put into the canvas
        const { height, width } = canvas.current;
        const stats = {
            colorCounts: {},
            colors: [],
            map: [],
        };
        const blockSize = 10;
        // looping through every new "block" that will be created with the pixelation
        for (let y = 0; y < height; y += blockSize) {
            const row = [];
            for (let x = 0; x < width; x += blockSize) {
                const remainingX = width - x;
                const remainingY = height - y;
                const blockX = remainingX > blockSize ? blockSize : remainingX;
                const blockY = remainingY > blockSize ? blockSize : remainingY;
                // get the image data for the current block and calculate its average color
                const averageColor = calculateAverageColor(
                    context.current.getImageData(x, y, blockX, blockY)
                );
                averageColor.name = `${averageColor.red}_${averageColor.green}_${averageColor.blue}`;
                // add this color to the row array so it can be added to the image stats
                row.push(averageColor);
                if (Object.hasOwn(stats.colorCounts, averageColor.name))
                    stats.colorCounts[averageColor.name]++;
                else {
                    stats.colorCounts[averageColor.name] = 1;
                    stats.colors.push(averageColor);
                }
                // draw the new block over the top of the existing image that exists in the canvas
                context.current.fillStyle = `rgb(${averageColor.red}, ${averageColor.green}, ${averageColor.blue})`;
                context.current.fillRect(x, y, blockX, blockY);
            }
            stats.map.push(row);
        }
        return stats;
    };

    const create = (src: string) => {
        const newImage = new Image();
        newImage.src = src;
        newImage.onload = () => {
            image.current = newImage;
            if (canvas.current == null) {
                return;
            }
            canvas.current.width = newImage.width;
            canvas.current.height = newImage.height;
            context.current = canvas.current.getContext("2d", {
                alpha: false,
                willReadFrequently: true,
            });
            context.current!.drawImage(newImage, 0, 0);
            let stats = pixelate();
            setStats(stats);
        };
    };

    return {
        create,
    };
};
