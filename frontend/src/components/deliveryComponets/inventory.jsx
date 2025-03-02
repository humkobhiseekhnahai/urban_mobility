// Inventory.js
import { useAtom } from 'jotai';
import { inputAtom } from "../../hooks/atoms/atom";

export const Inventory = () => {
    const [stops, setStops] = useAtom(inputAtom);

    const handleCapacityChange = (index, value) => {
        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
            const newStops = stops.map((stop, i) =>
                i === index ? { ...stop, capacity: numericValue } : stop
            );
            setStops(newStops);
        }
    };

    const handlePriorityChange = (index, value) => {
        const newStops = [...stops];
        newStops[index].priority = value;
        setStops(newStops);
    };

    return (
        <div className="w-full px-4 py-8">
            <div className="max-w-4xl mx-auto bg-neutral-800 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-200 p-6 border-b border-neutral-700">
                    Inventory Management
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-sm text-gray-400 border-b border-neutral-700">
                                <th className="px-6 py-4 text-left">Location</th>
                                <th className="px-6 py-4 text-left">Weight (kg)</th>
                                <th className="px-6 py-4 text-left">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stops.map((stop, index) => (
                                <tr key={index} className="hover:bg-neutral-700/50 transition-colors border-b border-neutral-700 last:border-0">
                                    <td className="px-6 py-4">
                                        <input
                                            value={stop.location}
                                            readOnly
                                            className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="number"
                                            placeholder="Enter weight"
                                            value={stops[index].capacity || ''}
                                            onChange={(e) => handleCapacityChange(index, e.target.value)}
                                            className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={stop.priority || 'low'} // Set default to low
                                            onChange={(e) => handlePriorityChange(index, e.target.value)}
                                            className="w-full bg-neutral-800 text-gray-200 px-3 py-2 rounded-md border border-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
