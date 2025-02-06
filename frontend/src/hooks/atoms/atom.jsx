import { atom, selector } from "recoil";

export const inputAtom = atom({
    key: "inputAtom",
    default: [""], // Default value is an array with an empty string
});

export const markerSelector = selector({
    key: "markerSelector",
    get: ({ get }) => {
        const input = get(inputAtom);
        const numbers = input.map(str =>
            str.split(',')
               .map(num => parseFloat(num))
               .filter(num => !isNaN(num)) // Keep only valid numbers
        );
        console.log(numbers);
        return numbers;
    },
});
