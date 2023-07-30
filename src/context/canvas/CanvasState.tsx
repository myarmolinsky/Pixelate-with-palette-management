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

const getClosestColorInPalette = (
	color: ReturnType<typeof calculateAverageColor>,
	palette: Record<string, Color>
) => {
	let closestColor: Color | undefined;
	let shortestDistance = Number.MAX_SAFE_INTEGER;
	// loop through every paint color
	Object.values(palette).forEach((paletteColor) => {
		if (shortestDistance === 0) {
			return;
		}
		// calculate the "distance" between color and this particular paint color
		const distance =
			Math.abs(paletteColor.red - color.red) +
			Math.abs(paletteColor.green - color.green) +
			Math.abs(paletteColor.blue - color.blue);
		// if this paint color is "closer" than any of the others we examined, save it
		// as the paint that is currently the "closest"
		if (distance < shortestDistance) {
			shortestDistance = distance;
			closestColor = paletteColor;
		}
	});
	return closestColor;
};

const reduceColors = (
	colors: Record<string, Color>,
	numberOfColors: number
): Record<string, Color> => {
	const colorsArray = Object.entries(colors);
	if (colorsArray.length < numberOfColors) {
		return colors;
	}
	const sortedColors = colorsArray.sort(([_nameA, colorA], [_nameB, colorB]) =>
		Math.abs(0 - colorA.red) +
			Math.abs(0 - colorA.green) +
			Math.abs(0 - colorA.blue) >
		Math.abs(0 - colorB.red) +
			Math.abs(0 - colorB.green) +
			Math.abs(0 - colorB.blue)
			? 1
			: -1
	);
	const skipper = sortedColors.length / numberOfColors;
	const reducedColors: typeof sortedColors = [];
	for (let i = 0; i < sortedColors.length; i += skipper) {
		reducedColors.push(
			sortedColors
				.slice(Math.floor(i), Math.floor(i + skipper))
				.sort(([_nameA, colorA], [_nameB, colorB]) =>
					colorA.count > colorB.count ? 1 : -1
				)[0]
		);
	}
	return Object.fromEntries(reducedColors);
};

export interface CanvasStateInterface {
	blob: string | null;
	blockSize: number;
	canvas: HTMLCanvasElement | null;
	canvasHidden: boolean;
	colors: Record<string, Color> | null;
	context: CanvasRenderingContext2D | null;
	image: HTMLImageElement | null;
	numberOfColors: number | null;
	create: (
		blob: string,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		numberOfColors: CanvasStateInterface['numberOfColors'],
		colors: Record<string, Color>
	) => void;
	read: (
		chosenFile: File,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		numberOfColors: CanvasStateInterface['numberOfColors']
	) => void;
	setBlockSize: (
		blockSize: number,
		numberOfColors: CanvasStateInterface['numberOfColors'],
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => void;
	setCanvas: (canvas: HTMLCanvasElement) => void;
	setImage: (image: HTMLImageElement) => void;
	setNumberOfColors: (
		numberOfColors: number | null,
		blockSize: CanvasStateInterface['blockSize'],
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => void;
}

const initialState: CanvasStateInterface = {
	blob: null,
	blockSize: 10,
	canvas: null,
	canvasHidden: true,
	colors: null,
	context: null,
	image: null,
	numberOfColors: null,
	create: () => null,
	read: () => null,
	setBlockSize: () => null,
	setCanvas: () => null,
	setImage: () => null,
	setNumberOfColors: () => null,
};

export const CanvasContext = createContext<CanvasStateInterface>(initialState);

export const CanvasState = ({ children }: { children: any }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const setBlob = (blob: string) => {
		dispatch({ type: 'SET_BLOB', payload: blob });
	};

	const setBlockSize = (
		blockSize: number,
		numberOfColors: CanvasStateInterface['numberOfColors'],
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => {
		dispatch({ type: 'SET_BLOCK_SIZE', payload: blockSize });
		if (!canvasHidden && !!blob) {
			create(blob, canvas, context, blockSize, numberOfColors, colors);
		}
	};

	const setNumberOfColors = (
		numberOfColors: number | null,
		blockSize: number,
		canvasHidden: boolean,
		blob: CanvasStateInterface['blob'],
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		colors: Record<string, Color>
	) => {
		dispatch({ type: 'SET_NUMBER_OF_COLORS', payload: numberOfColors });
		if (!canvasHidden && !!blob) {
			create(blob, canvas, context, blockSize, numberOfColors, colors);
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

	const pixelateWithPalette = (
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		palette: Record<string, Color>
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
				const closestColorInPalette = getClosestColorInPalette(
					averageColor,
					palette
				)!;
				const name = `rgb(${closestColorInPalette.red}, ${closestColorInPalette.green}, ${closestColorInPalette.blue})`;
				if (newColors[name] != null) {
					newColors[name] = {
						...newColors[name],
						count: newColors[name].count + 1,
						hidden: palette[name].hidden ?? false,
					};
				} else {
					newColors[name] = {
						...averageColor,
						count: 1,
						hidden: palette[name].hidden ?? false,
					};
				}
				if (palette[name].hidden) {
					context.clearRect(x, y, blockX, blockY);
				} else {
					// draw the new block over the top of the existing image that exists in the canvas
					context.fillStyle = name;
					context.fillRect(x, y, blockX, blockY);
				}
			}
		}
	};

	const pixelate = (
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		numberOfColors: CanvasStateInterface['numberOfColors'],
		colors: Record<string, Color>
	): Record<string, Color> | undefined => {
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
				if (numberOfColors === null) {
					if (colors[name]?.hidden) {
						context.clearRect(x, y, blockX, blockY);
					} else {
						// draw the new block over the top of the existing image that exists in the canvas
						context.fillStyle = name;
						context.fillRect(x, y, blockX, blockY);
					}
				}
			}
		}
		if (numberOfColors) {
			const reducedColors = reduceColors(newColors, numberOfColors);
			pixelateWithPalette(canvas, context, blockSize, reducedColors);
			return reducedColors;
		}
		return newColors;
	};

	const create = (
		blob: string,
		canvas: CanvasStateInterface['canvas'],
		context: CanvasStateInterface['context'],
		blockSize: CanvasStateInterface['blockSize'],
		numberOfColors: CanvasStateInterface['numberOfColors'],
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
			let newColors = pixelate(
				canvas,
				context,
				blockSize,
				numberOfColors,
				colors
			);
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
		blockSize: CanvasStateInterface['blockSize'],
		numberOfColors: CanvasStateInterface['numberOfColors']
	) => {
		const fileReader = new FileReader();
		fileReader.onloadend = (event) => {
			const newBlob = event.target?.result as string;
			setBlob(newBlob);
			create(newBlob, canvas, context, blockSize, numberOfColors, {});
		};
		fileReader.readAsDataURL(chosenFile);
	};

	return (
		<CanvasContext.Provider
			value={{
				...state,
				setBlockSize,
				setCanvas,
				setNumberOfColors,
				read,
				create,
			}}
		>
			{children}
		</CanvasContext.Provider>
	);
};
