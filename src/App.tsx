import { CanvasState } from './context/canvas/CanvasState';
import { Content } from './pages/Content';

export const App = () => {
	return (
		<CanvasState>
			<Content />
		</CanvasState>
	);
};
