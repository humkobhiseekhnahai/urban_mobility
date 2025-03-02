// atoms.js (updated for Jotai)
import { atom } from 'jotai';

export const inputAtom = atom([{ location: "", capacity: 0, priority:"low"}]);

export const markerAtom = atom((get) => {
    const input = get(inputAtom);
    return input
        .filter(stop => stop.location)
        .map(stop => 
            stop.location.split(',')
                .map(num => parseFloat(num.trim()))
                .filter(num => !isNaN(num))
        )
        .filter(coords => coords.length === 2);
});



