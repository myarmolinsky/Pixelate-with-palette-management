import { useContext, useEffect, useMemo, useState } from 'react';
import { CanvasContext } from '../context/canvas/CanvasState';
import {
	Card,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Pagination,
	Typography,
} from '@mui/material';
import { Stop, Visibility, VisibilityOff } from '@mui/icons-material';

const COLORS_PER_PAGE = 10;

export const Palette = () => {
	const { colors, blob, create, canvas, context, blockSize } =
		useContext(CanvasContext);

	const [page, setPage] = useState(1);

	const handlePagination = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value);
	};

	const totalPages = useMemo(() => {
		if (!colors) {
			return 1;
		}
		return Math.ceil(Object.entries(colors).length / COLORS_PER_PAGE);
	}, [colors]);

	useEffect(() => {
		setPage(1);
	}, [blob]);

	useEffect(() => {
		if (colors) {
			if (page > totalPages) {
				setPage(totalPages);
			}
		}
	}, [page, colors, totalPages]);

	if (!colors) {
		return null;
	}

	return (
		<Card variant="outlined" sx={{ p: 1 }}>
			<Typography variant="h5" align="center">
				Palette
			</Typography>
			<Divider />
			<List>
				{Object.entries(colors)
					.slice((page - 1) * COLORS_PER_PAGE, page * COLORS_PER_PAGE)
					.map(([name]) => (
						<>
							<ListItem disablePadding>
								<Stop
									sx={{
										color: name,
									}}
								/>
								<Divider
									orientation="vertical"
									flexItem
									sx={{ mx: 1 }}
									variant="middle"
								/>
								<ListItemText>{name}</ListItemText>
								<IconButton
									onClick={() => {
										if (blob) {
											const newColors = { ...colors };
											if (colors[name].hidden) {
												newColors[name] = { ...newColors[name], hidden: false };
											} else {
												newColors[name] = { ...newColors[name], hidden: true };
											}
											create(blob, canvas, context, blockSize, newColors);
										}
									}}
								>
									{colors[name].hidden ? (
										<VisibilityOff sx={{ color: 'lightgray' }} />
									) : (
										<Visibility />
									)}
								</IconButton>
							</ListItem>
							<Divider />
						</>
					))}
			</List>
			<Pagination page={page} count={totalPages} onChange={handlePagination} />
		</Card>
	);
};
