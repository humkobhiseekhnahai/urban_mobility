// Inventory.js
import { useRecoilState } from "recoil";
import { inputAtom } from "../../hooks/atoms/atom";
import { useState } from "react";

export const Inventory = () => {
    const [stops, setStops] = useRecoilState(inputAtom);
    const [priority, setPriority] = useState("Priority");

    const handleCapacityChange = (index, value) => {
        const newStops = [...stops];
        newStops[index].capacity = Number(value);
        setStops(newStops);
    };

    return (
        <div className="w-full h-fit flex justify-center items-center">
            <div className="text-white w-fit h-fit border-2 border-gray-100 my-10 px-20">
                <div className="font-medium flex justify-center items-center underline text-xl my-5">
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="font-medium">Priority</div>
                </div>

                {stops.map((stop, index) => (
                    <div key={index} className="flex justify-center items-center space-x-4 m-5">
                        <div>

                            <input
                                value={stop.location}
                                readOnly
                                placeholder={index === 0 ? 'Starting Point' : `Stop ${index}`}
                                className="border-2 border-gray-100 p-2"
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
                        <div>
                            <input
                                type="number"
                                placeholder="Enter weight"
                                value={stop.capacity}
                                onChange={(e) => handleCapacityChange(index, e.target.value)}
                                className="border-2 border-gray-100 p-2"
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
                        <div>
                           
                                <select 
                                    id="priorityId" 
                                    value={priority}
                                    className="bg-inherit border border-white text-white text-sm block w-full p-3 "
                                    onChange={(e)=>{
                                        setPriority(e.target.value)
                                    }}
                                >
                                    <option value="low">low</option>
                                    <option value="medium">medium</option>
                                    <option value="high">high</option>
                                </select>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
