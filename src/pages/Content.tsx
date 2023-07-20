import { Grid } from '@mui/material';
import { useContext, useEffect } from 'react';
import { CanvasContext } from '../context/canvas/CanvasState';
import { ManageCanvas } from '../components/ManageCanvas';
import { Palette } from '../components/Palette';

export const Content = () => {
	const { canvasHidden, setCanvas, colors } = useContext(CanvasContext);

	useEffect(() => {
		setCanvas(document.getElementById('canvas') as HTMLCanvasElement);
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container spacing={2} direction="row">
			<Grid item direction="column">
				<Grid item display={canvasHidden ? 'none' : 'block'} mb={1}>
					<canvas id="canvas" />
				</Grid>
				<Grid item>
					<ManageCanvas />
				</Grid>
			</Grid>
			{colors && (
				<Grid item>
					<Palette />
				</Grid>
			)}
		</Grid>
	);
};
