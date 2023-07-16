import { createContext } from "react";
import { Index } from "../Index";

export const IndexState = createContext({});

export const IndexContainer = () => {
    return (
        <IndexState.Provider value={{}}>
            <Index />
        </IndexState.Provider>
    );
};
