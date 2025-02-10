// Inventory.js
import { useRecoilState } from "recoil";
import { inputAtom } from "../../hooks/atoms/atom";

export const Inventory = () => {
    const [stops, setStops] = useRecoilState(inputAtom);

    const handleCapacityChange = (index, value) => {
        const newStops = [...stops];
        newStops[index].capacity = Number(value);
        setStops(newStops);
    };

    return (
        <div className="w-full h-fit flex justify-center items-center">
            <div className="text-white max-w-screen-lg h-fit border-2 border-gray-100 my-10 px-4 sm:px-6 md:px-10 overflow-hidden">
                <div className="font-medium flex justify-center items-center underline text-xl my-5 sm:text-xl">
                    INVENTORY
                </div>

                {/* Column Headers */}
                <div className="flex justify-center items-center space-x-4 m-5">
                    <div className="font-medium">Location</div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="font-medium">Weight</div>
                </div>

                {stops.map((stop, index) => (
                    <div key={index} className="flex justify-between sm:justify-center items-center  m-5 sm:m-4 md:m-5 w-full sm:w-auto ml-1">

                        <div className="flex w-full sm:w-auto">

                            <input
                                value={stop.location}
                                readOnly
                                placeholder={index === 0 ? 'Starting Point' : `Stop ${index}`}
                                className="text-white text-sm sm:text-base text-center border-2 p-2 sm:m-2 rounded-md min-w-[150px] sm:min-w-[200px] md:min-w-[250px] w-full sm:w-auto"
                            />

                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

                        <div className="flex w-full sm:w-auto">
                            <input
                                type="number"
                                placeholder="Enter weight"
                                value={stop.capacity}
                                onChange={(e) => handleCapacityChange(index, e.target.value)}
                                className="text-white text-sm sm:text-base text-center border-2 p-2 sm:m-2 rounded-md min-w-[100px] sm:min-w-[150px] md:min-w-[200px] w-full sm:w-auto"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
