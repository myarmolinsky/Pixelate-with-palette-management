import { useContext, useEffect, useMemo, useState } from 'react';
import { CanvasContext } from '../context/canvas/CanvasState';
import {
	Card,
	Divider,
	List,
	ListItem,
	ListItemText,
	Pagination,
	Typography,
} from '@mui/material';
import { Stop } from '@mui/icons-material';

const COLORS_PER_PAGE = 10;

export const Palette = () => {
	const { colors, blob } = useContext(CanvasContext);

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
							</ListItem>
							<Divider />
						</>
					))}
			</List>
			<Pagination page={page} count={totalPages} onChange={handlePagination} />
		</Card>
	);
};
