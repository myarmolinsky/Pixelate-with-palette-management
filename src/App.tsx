import { MutableRefObject, createContext, useRef, useState } from "react";
import { IndexContainer } from "./routes/index/components/IndexContainer";
import { Color } from "./hooks/useImage";

export interface Stats {
    colorCounts: Record<string, number>;
    colors: Array<Color>;
    map: Array<Array<Color>>;
}

export const UIState = createContext<{
    file: MutableRefObject<File | null> | null;
    blob: MutableRefObject<string | null> | null;
    setStats: (stats: Stats) => void;
    stats: Stats | null;
}>({
    blob: null,
    file: null,
    setStats: () => null,
    stats: null,
});

export const App = () => {
    const blob = useRef<string | null>(null);
    const file = useRef<File | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);

    return (
        <UIState.Provider
            value={{
                blob,
                file,
                setStats,
                stats,
            }}
        >
            <IndexContainer />
            <canvas id="canvas" />
        </UIState.Provider>
    );
};
