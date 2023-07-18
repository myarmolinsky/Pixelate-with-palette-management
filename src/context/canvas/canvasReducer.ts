import { CanvasStateInterface } from './CanvasState';

type TYPE =
	| 'SET_STATS'
	| 'SET_BLOCK_SIZE'
	| 'SET_CANVAS_HIDDEN'
	| 'SET_BLOB'
	| 'SET_CANVAS'
	| 'SET_IMAGE';

export const reducer = (
	state: CanvasStateInterface,
	action: { type: TYPE; payload: any }
) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_BLOB':
			return { ...state, blob: payload };
		case 'SET_BLOCK_SIZE':
			return {
				...state,
				blockSize: payload,
			};
		case 'SET_CANVAS':
			return { ...state, canvas: payload };
		case 'SET_CANVAS_HIDDEN':
			return { ...state, canvasHidden: payload };
		case 'SET_IMAGE':
			return { ...state, image: payload };
		case 'SET_STATS':
			return { ...state, stats: payload };
		default:
			return state;
	}
};
