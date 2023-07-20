import { createContext, useReducer } from 'react';
import { reducer } from './canvasReducer';

export interface Color {
	red: number;
	green: number;
	blue: number;
	count: number;
	hidden: boolean;
}

const calculateAverageColor = (
	imageData: ReturnType<CanvasRenderingContext2D['getImageData']>
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
	imageData: ReturnType<CanvasRenderingContext2D['getImageData']>,
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
	imageData: ReturnType<CanvasRenderingContext2D['getImageData']>,
	x: number,
	y: number
) => {
	return (imageData.width * y + x) * 4;
};

const getRgbFromImageData = (
	imageData: ReturnType<CanvasRenderingContext2D['getImageData']>,
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
	};
};

export interface CanvasStateInterface {
	blob: string | null;
	blockSize: number;
	canvas: HTMLCanvasElement | null;
	canvasHidden: boolean;
	colors: Record<string, Color> | null;
	context: CanvasRenderingContext2D | null;
	image: HTMLImageElement | null;
	create: (
		blob: string,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		colors: Record<string, Color>
	) => void;
	read: (
		chosenFile: File,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize']
	) => void;
	setBlockSize: (
		blockSize: number,
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => void;
	setCanvas: (canvas: HTMLCanvasElement) => void;
	setImage: (image: HTMLImageElement) => void;
}

const initialState: CanvasStateInterface = {
	blob: null,
	blockSize: 10,
	canvas: null,
	canvasHidden: true,
	colors: null,
	context: null,
	image: null,
	create: () => null,
	read: () => null,
	setBlockSize: () => null,
	setCanvas: () => null,
	setImage: () => null,
};

export const CanvasContext = createContext<CanvasStateInterface>(initialState);

export const CanvasState = ({ children }: { children: any }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const setBlob = (blob: string) => {
		dispatch({ type: 'SET_BLOB', payload: blob });
	};

	const setBlockSize = (
		blockSize: number,
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => {
		dispatch({ type: 'SET_BLOCK_SIZE', payload: blockSize });
		if (!canvasHidden && !!blob) {
			create(blob, canvas, context, blockSize, colors);
		}
	};

	const setCanvas = (canvas: HTMLCanvasElement) => {
		dispatch({ type: 'SET_CANVAS', payload: canvas });
	};

	const setCanvasHidden = (canvasHidden: boolean) => {
		dispatch({ type: 'SET_CANVAS_HIDDEN', payload: canvasHidden });
	};

	const setImage = (image: HTMLImageElement) => {
		dispatch({ type: 'SET_IMAGE', payload: image });
	};

	const setColors = (colors: Record<string, Color>) => {
		dispatch({ type: 'SET_COLORS', payload: colors });
	};

	const pixelate = (
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		colors: Record<string, Color>
	) => {
		if (canvas == null || context == null) {
			return;
		}
		// get dimensions from the image that we just put into the canvas
		const { height, width } = canvas;
		const newColors: Record<string, Color> = {};
		// looping through every new "block" that will be created with the pixelation
		for (let y = 0; y < height; y += blockSize) {
			for (let x = 0; x < width; x += blockSize) {
				const remainingX = width - x;
				const remainingY = height - y;
				const blockX = remainingX > blockSize ? blockSize : remainingX;
				const blockY = remainingY > blockSize ? blockSize : remainingY;
				// get the image data for the current block and calculate its average color
				const averageColor = calculateAverageColor(
					context.getImageData(x, y, blockX, blockY)
				);
				const name = `rgb(${averageColor.red}, ${averageColor.green}, ${averageColor.blue})`;
				if (newColors[name] != null) {
					newColors[name] = {
						...newColors[name],
						count: newColors[name].count + 1,
						hidden: colors[name]?.hidden ?? false,
					};
				} else {
					newColors[name] = {
						...averageColor,
						count: 1,
						hidden: colors[name]?.hidden ?? false,
					};
				}
				if (colors[name]?.hidden) {
					context.clearRect(x, y, blockX, blockY);
				} else {
					// draw the new block over the top of the existing image that exists in the canvas
					context.fillStyle = name;
					context.fillRect(x, y, blockX, blockY);
				}
			}
		}
		return newColors;
	};

	const create = (
		blob: string,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		colors: Record<string, Color>
	) => {
		const newImage = new Image();
		newImage.src = blob;
		newImage.onload = () => {
			setImage(newImage);
			if (canvas == null) {
				return;
			}
			canvas.width = newImage.width;
			canvas.height = newImage.height;
			context = canvas.getContext('2d', {
				alpha: false,
				willReadFrequently: true,
			});
			context?.drawImage(newImage, 0, 0);
			let newColors = pixelate(canvas, context, blockSize, colors);
			if (newColors != null) {
				setColors(newColors);
				setCanvasHidden(false);
			}
		};
	};

	const read = (
		chosenFile: File,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize']
	) => {
		const fileReader = new FileReader();
		fileReader.onloadend = (event) => {
			const newBlob = event.target?.result as string;
			setBlob(newBlob);
			create(newBlob, canvas, context, blockSize, {});
		};
		fileReader.readAsDataURL(chosenFile);
	};

	return (
		<CanvasContext.Provider
			value={{
				...state,
				setBlockSize,
				setCanvas,
				read,
				create,
			}}
		>
			{children}
		</CanvasContext.Provider>
	);
};
