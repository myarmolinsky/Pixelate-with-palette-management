import { ChangeEvent, useRef, useContext } from 'react';
import { Button, Input, InputLabel } from '@mui/material';
import { CanvasContext } from '../../context/canvas/CanvasState';

export const Index = () => {
	const selectImageInputRef = useRef<HTMLInputElement | null>(null);
	const { read, blob, canvas, canvasHidden, context, blockSize, setBlockSize } =
		useContext(CanvasContext);

	const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
		const source = event.target.files?.[0];
		if (source != null) {
			read(source, canvas, context, blockSize);
		}
	};

	const handleImageButton = () => {
		selectImageInputRef.current && selectImageInputRef.current.click();
	};

	const handleBlockSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if (newValue.match(/^-?\d+$/) || newValue.match(/^\d+\.\d+$/)) {
			// valid integer (positive or negative) or float
			setBlockSize(
				Math.abs(parseInt(newValue)),
				canvasHidden,
				blob,
				canvas,
				context
			);
		}
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
			<Button onClick={handleImageButton} variant="contained" sx={{ mb: 1 }}>
				Select Image
			</Button>
			<InputLabel>Block size</InputLabel>
			<Input
				defaultValue={blockSize}
				onChange={handleBlockSizeChange}
				type="number"
			/>
		</>
	);
};
