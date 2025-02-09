// atoms.js
import { atom, selector } from "recoil";

export const inputAtom = atom({
    key: "inputAtom",
    default: [{ location: "", capacity: 0 }],
});

export const markerSelector = selector({
    key: "markerSelector",
    get: ({ get }) => {
        const input = get(inputAtom);
        return input
            .filter(stop => stop.location) // Only include stops with non-empty locations
            .map(stop => 
                stop.location.split(',')
                    .map(num => parseFloat(num.trim()))
                    .filter(num => !isNaN(num))
            )
            .filter(coords => coords.length === 2); // Only include valid coordinate pairs
    },
});
