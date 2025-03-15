import { useState } from "react";
import { motion } from "framer-motion";
import { RouteRequestCard } from "../components/requestsComponents/RequestCard";
import { NavBarComponent } from "../components/navBarComponent";
import { useFetch } from "@mantine/hooks";

export const Requests = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const { data, error, loading } = useFetch(
    `${serverUrl}/api/suggested-routes`
  );

  console.log(data);

  const [requests, setRequests] = useState([
    {
      id: "1",
      source: "Central Station",
      destination: "Business District",
      coordinates: [
        { lat: 40.7128, lon: -74.006, name: "Central Station" },
        { lat: 40.7138, lon: -74.013, name: "Market Square" },
        { lat: 40.7148, lon: -74.02, name: "Business District" },
      ],
      status: "pending",
    },
    {
      id: "2",
      source: "Central Station",
      destination: "Business District",
      coordinates: [
        { lat: 40.7128, lon: -74.006, name: "Central Station" },
        { lat: 40.7138, lon: -74.013, name: "Market Square" },
        { lat: 40.7148, lon: -74.02, name: "Business District" },
      ],
      status: "pending",
    },
    {
      id: "3",
      source: "Central Station",
      destination: "Business District",
      coordinates: [
        { lat: 40.7128, lon: -74.006, name: "Central Station" },
        { lat: 40.7138, lon: -74.013, name: "Market Square" },
        { lat: 40.7148, lon: -74.02, name: "Business District" },
      ],
      status: "pending",
    },
    {
      id: "4",
      source: "Central Station",
      destination: "Business District",
      coordinates: [
        { lat: 40.7128, lon: -74.006, name: "Central Station" },
        { lat: 40.7138, lon: -74.013, name: "Market Square" },
        { lat: 40.7148, lon: -74.02, name: "Business District" },
      ],
      status: "pending",
    },
    {
      id: "5",
      source: "Central Station",
      destination: "Business District",
      coordinates: [
        { lat: 40.7128, lon: -74.006, name: "Central Station" },
        { lat: 40.7138, lon: -74.013, name: "Market Square" },
        { lat: 40.7148, lon: -74.02, name: "Business District" },
      ],
      status: "pending",
    },
    // Other requests...
  ]);

  const handleApprove = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );
  };

  const handleDeny = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "denied" } : request
      )
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex">
      <NavBarComponent />
      <div className="p-8 w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Route Requests</h1>
          <p className="text-gray-400">
            Review and manage user-submitted route suggestions
          </p>
        </header>

        <div
          className="grid grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {requests.map((request) => (
            <RouteRequestCard
              key={request.id}
              request={request}
              onApprove={() => handleApprove(request.id)}
              onDeny={() => handleDeny(request.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
