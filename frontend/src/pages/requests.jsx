import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RouteRequestCard } from "../components/requestsComponents/RequestCard";
import { NavBarComponent } from "../components/navBarComponent";
import { useFetch } from "@mantine/hooks";

export const Requests = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const { data, error, loading } = useFetch(
    `${serverUrl}/api/suggested-routes`
  );

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (data) {
      setRequests(data);
    }
  }, [data]);

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`${serverUrl}/api/suggested-routes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await handleStatusChange(id, "approved");
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "approved" } : request
        )
      );
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const handleDeny = async (id) => {
    try {
      await handleStatusChange(id, "denied");
      setRequests(
        requests.map((request) =>
          request.id === id ? { ...request, status: "denied" } : request
        )
      );
    } catch (error) {
      console.error("Error denying request:", error);
    }
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
        <motion.div
          className="grid grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {loading && <p>Loading suggested bus routes...</p>}
          {error && <p>There was an error loading the data</p>}
          {requests &&
            requests.map((request, index) => (
              <RouteRequestCard
                key={request.id}
                request={request}
                index={index + 1}
                onApprove={async () => await handleApprove(request.id)}
                onDeny={async () => await handleDeny(request.id)}
              />
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Requests;
