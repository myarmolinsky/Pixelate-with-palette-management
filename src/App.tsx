import { CanvasState } from './context/canvas/CanvasState';
import { Content } from './routes/content/Content';

export const App = () => {
	return (
		<CanvasState>
			<Content />
		</CanvasState>
	);
};
