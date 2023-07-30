import { ChangeEvent, useRef, useContext } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { CanvasContext } from '../context/canvas/CanvasState';

export const ManageCanvas = () => {
	const selectImageInputRef = useRef<HTMLInputElement | null>(null);
	const {
		read,
		blob,
		canvas,
		canvasHidden,
		context,
		blockSize,
		setBlockSize,
		colors,
		numberOfColors,
		setNumberOfColors,
	} = useContext(CanvasContext);

	const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
		const source = event.target.files?.[0];
		if (source != null) {
			read(source, canvas, context, blockSize, numberOfColors);
		}
	};

	const handleImageButton = () => {
		selectImageInputRef.current && selectImageInputRef.current.click();
	};

	const handleBlockSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if (
			(newValue.match(/^-?\d+$/) || newValue.match(/^\d+\.\d+$/)) &&
			newValue !== '0'
		) {
			// valid integer (positive or negative) or float
			setBlockSize(
				Math.abs(parseInt(newValue)),
				numberOfColors,
				canvasHidden,
				blob,
				canvas,
				context,
				colors ?? {}
			);
		}
	};

	const handleNumberOfColorsChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if (
			newValue === '' ||
			((newValue.match(/^-?\d+$/) || newValue.match(/^\d+\.\d+$/)) &&
				newValue !== '0')
		) {
			// valid integer (positive or negative) or float
			setNumberOfColors(
				newValue === '' ? null : Math.abs(parseInt(newValue)),
				blockSize,
				canvasHidden,
				blob,
				canvas,
				context,
				colors ?? {}
			);
		}
	};

	return (
		<Grid container direction="column" spacing={2}>
			<Grid item>
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
			</Grid>
			<Grid item>
				<TextField
					label="Block size"
					defaultValue={blockSize}
					onChange={handleBlockSizeChange}
					type="number"
				/>
			</Grid>
			<Grid item>
				<TextField
					label="Number of Colors"
					defaultValue={numberOfColors}
					onChange={handleNumberOfColorsChange}
					type="number"
					sx={{ mr: 2 }}
				/>
			</Grid>
		</Grid>
	);
};
