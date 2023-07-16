import { useContext, useEffect, useRef } from "react";
import { Stats, UIState } from "../App";

export interface Color extends ReturnType<typeof calculateAverageColor> {
    name?: string;
}

const calculateAverageColor = (
    imageData: ReturnType<CanvasRenderingContext2D["getImageData"]>
) => {
    let redSum = 0;
    let redCounter = 0;
    let greenSum = 0;
    let greenCounter = 0;
    let blueSum = 0;
    let blueCounter = 0;
    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            const { red, green, blue } = getRgbFromImageData(imageData, x, y);
            redSum += red;
            redCounter++;
            greenSum += green;
            greenCounter++;
            blueSum += blue;
            blueCounter++;
        }
    }
    return {
        red: Math.round(redSum / redCounter),
        green: Math.round(greenSum / greenCounter),
        blue: Math.round(blueSum / blueCounter),
    };
};

const getPixelFromImageData = (
    imageData: ReturnType<CanvasRenderingContext2D["getImageData"]>,
    x: number,
    y: number
) => {
    const index = getPixelIndex(imageData, x, y);
    return {
        blue: [imageData.data[index + 2], index + 2],
        green: [imageData.data[index + 1], index + 1],
        red: [imageData.data[index], index],
        x,
        y,
    };
};

const getPixelIndex = (
    imageData: ReturnType<CanvasRenderingContext2D["getImageData"]>,
    x: number,
    y: number
) => {
    return (imageData.width * y + x) * 4;
};

const getRgbFromImageData = (
    imageData: ReturnType<CanvasRenderingContext2D["getImageData"]>,
    x: number,
    y: number
) => {
    const pixelObject = getPixelFromImageData(imageData, x, y);
    const [red] = pixelObject.red;
    const [green] = pixelObject.green;
    const [blue] = pixelObject.blue;
    return {
        red,
        green,
        blue,
        name: "",
    };
};

export const useImage = () => {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const image = useRef<HTMLImageElement | null>(null);

    const { setStats } = useContext(UIState);

    useEffect(() => {
        canvas.current = document.getElementById("canvas") as HTMLCanvasElement;
    }, []);

    const pixelate = () => {
        if (canvas.current == null || context.current == null) {
            return;
        }
        // get dimensions from the image that we just put into the canvas
        const { height, width } = canvas.current;
        const stats: Stats = {
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
                const averageColor: Color = calculateAverageColor(
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
            if (stats != null) {
                setStats(stats);
            }
        };
    };

    return {
        create,
    };
};
