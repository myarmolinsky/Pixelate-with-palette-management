import { MutableRefObject, createContext, useRef, useState } from "react";
import { IndexContainer } from "./routes/index/components/IndexContainer";

export const UIState = createContext<{
    file: MutableRefObject<File | null> | null;
    blob: MutableRefObject<string | null> | null;
    setStats: (stats: any) => void;
    stats: any | null;
}>({
    blob: null,
    file: null,
    setStats: () => null,
    stats: null,
});

export const App = () => {
    const blob = useRef<string | null>(null);
    const file = useRef<File | null>(null);
    const [stats, setStats] = useState({});

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
