import { Grid } from '@mui/material';
import { useContext, useEffect } from 'react';
import { CanvasContext } from '../../context/canvas/CanvasState';
import { Index } from '../index/Index';

export const Content = () => {
	const { canvasHidden, setCanvas } = useContext(CanvasContext);

	useEffect(() => {
		setCanvas(document.getElementById('canvas') as HTMLCanvasElement);
		// eslint-disable-next-line
	}, []);

	return (
		<Grid container spacing={1} direction="column">
			<Grid item display={canvasHidden ? 'none' : 'block'}>
				<canvas id="canvas" />
			</Grid>
			<Grid item>
				<Index />
			</Grid>
		</Grid>
	);
};
