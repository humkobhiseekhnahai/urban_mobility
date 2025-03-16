<<<<<<< HEAD
// atoms.js
import { atom } from "jotai";

export const startingLocationAtom = atom("");
export const deliveryStopsAtom = atom([]);
export const apiResponseAtom = atom(null);
export const routeAtom = atom(null);
export const hoveredRouteAtom = atom(null);

export const markerAtom = atom((get) => {
  const start = get(startingLocationAtom);
  const stops = get(deliveryStopsAtom);

  const allLocations = [start, ...stops.map((stop) => stop.location)].filter(
    (location) => location
  );

  return allLocations
    .map((location) =>
      location
        .split(",")
        .map((num) => parseFloat(num.trim()))
        .filter((num) => !isNaN(num))
    )
    .filter((coords) => coords.length === 2);
=======
// atoms.js (updated for Jotai)
import { atom } from 'jotai';

export const inputAtom = atom([{ location: "", capacity: 0 }]);

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
>>>>>>> aa5370f84fa0dacff31fc133428352fface2ea58
});
