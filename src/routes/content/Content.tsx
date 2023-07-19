import {
	Card,
	Grid,
	Pagination,
	List,
	ListItem,
	ListItemText,
	Divider,
	Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { CanvasContext } from '../../context/canvas/CanvasState';
import { Index } from '../index/Index';
import { Stop } from '@mui/icons-material';

const COLORS_PER_PAGE = 10;

export const Content = () => {
	const { canvasHidden, setCanvas, stats } = useContext(CanvasContext);

	const [page, setPage] = useState(1);
	const handlePagination = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

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
					<Index />
				</Grid>
			</Grid>
			{stats && (
				<Grid item>
					<Card variant="outlined" sx={{ p: 1 }}>
						<Typography variant="h5" align="center">
							Palette
						</Typography>
						<Divider />
						<List>
							{stats.colors
								.slice((page - 1) * COLORS_PER_PAGE, page * COLORS_PER_PAGE)
								.map((color) => (
									<>
										<ListItem disablePadding>
											<Stop
												sx={{
													color: `rgb(${color.red}, ${color.green}, ${color.blue})`,
												}}
											/>
											<Divider
												orientation="vertical"
												flexItem
												sx={{ mx: 1 }}
												variant="middle"
											/>
											<ListItemText>
												{`rgb(${color.red}, ${color.green}, ${color.blue})`}
											</ListItemText>
										</ListItem>
										<Divider />
									</>
								))}
						</List>
						<Pagination
							count={Math.ceil(stats.colors.length / COLORS_PER_PAGE)}
							onChange={handlePagination}
						/>
					</Card>
				</Grid>
			)}
		</Grid>
	);
};
