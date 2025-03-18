"use client";

import { Copy, Home, Github, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export function DocContent({ activeSection = "introduction" }) {
  const copyAnimation = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
  };

  // Content mapping for each section
  const renderContent = () => {
    switch (activeSection) {
      case "introduction":
        return <IntroductionContent />;
      case "architecture":
        return <ArchitectureContent />;
      case "public":
        return <PublicContent />;
      case "deliverypartner":
        return <DeliveryPartnerContent />;
      case "busoperator":
        return <BusOperatorContent />;
      case "loading-sequence":
        return <LoadingSequenceContent />;
      case "deliveryrouting":
        return <DeliveryRoutingContent />;
      case "bustransportoptimization":
        return <BusTransportOptimizationContent />;
      case "safetyanalysis":
        return <SafetyAnalysisContent />;
      case "authentication":
        return <AuthenticationContent />;
      case "database":
        return <DatabaseContent />;
      default:
        return <IntroductionContent />;
    }
  };

  return (
    <article className="prose prose-invert max-w-4xl mx-auto px-4 lg:px-0">
      {/* Dark Contained Header */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-50 rounded-t-2xl">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-end space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link
              to="/home"
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-900"
            >
              <Home className="h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <a
              href="https://github.com/humkobhiseekhnahai/urban_mobility"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-900"
            >
              <Github className="h-5 w-5" />
            </a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-900"
            >
              <Rocket className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="backdrop-blur-sm bg-gradient-to-b from-black/30 to-transparent rounded-b-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  );
}

function IntroductionContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          UPLYFT Documentation
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          UPLYFT is an AI-driven urban mobility and logistics optimization
          platform designed to enhance
          <span className="font-semibold"> delivery efficiency</span> and{" "}
          <span className="font-semibold"> reduce city-wide congestion</span>.
          This documentation provides an in-depth overview of its problem
          statement, key features, solution architecture, and implementation
          strategies.
        </p>
      </motion.header>

      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="problem-statement"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Problem Statement
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            As urban populations grow, logistical inefficiencies and traffic
            congestion present critical challenges:
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              <span className="font-semibold">Delivery Route Chaos:</span>{" "}
              Warehouses and fleet managers struggle to handle multiple delivery
              requests efficiently, resulting in{" "}
              <span className="font-semibold">
                delayed shipments, higher fuel costs, and inefficient route
                planning
              </span>
              .
            </li>
            <li>
              <span className="font-semibold">City Traffic Gridlock:</span>{" "}
              Public transport systems are often{" "}
              <span className="font-semibold">underutilized</span>, while
              congestion hotspots and accident-prone zones{" "}
              <span className="font-semibold">
                increase travel time and pose safety risks
              </span>
              .
            </li>
            <li>
              <span className="font-semibold">
                Environmental & Economic Impact:
              </span>{" "}
              Inefficiencies in logistics and transport contribute to{" "}
              <span className="font-semibold">higher carbon emissions</span>,
              <span className="font-semibold"> wasted fuel</span>, and{" "}
              <span className="font-semibold">
                {" "}
                increased operational costs
              </span>{" "}
              for businesses.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="getting-started"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Getting Started
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            Follow these steps to create your UPLYFT account and start
            optimizing deliveries and urban transport.
          </p>

          <motion.div className="relative my-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-sm font-medium text-gray-400">Sign Up</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
              </motion.button>
            </div>
            <div className="overflow-x-auto p-6 text-sm bg-gray-950/50 rounded-b-xl text-gray-100">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold">
                    Visit the UPLYFT Sign-Up Page:
                  </span>{" "}
                  Open your browser and go to the official UPLYFT sign-up page.
                </li>
                <li>
                  <span className="font-semibold">
                    Enter Your Personal Details:
                  </span>{" "}
                  Provide your full name, email address, and create a strong
                  password.
                </li>
                <li>
                  <span className="font-semibold">Verify Your Email:</span>{" "}
                  Check your inbox for a verification email and click the
                  confirmation link.
                </li>
                <li>
                  <span className="font-semibold">Set Up Your Profile:</span>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Select your role:{" "}
                      <span className="font-semibold">
                        User, Bus Operator, or Delivery Partner
                      </span>
                      .
                    </li>
                    <li>Configure your delivery or transport preferences.</li>
                    <li>Enable notifications for real-time updates.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Complete Registration:</span>{" "}
                  Click the "Get Started" button and log in to access your
                  dashboard.
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="key-features"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              <span className="font-semibold">
                Delivery Route Optimization:
              </span>{" "}
              Uses AI-driven routing based on K-Means clustering and the
              Traveling Salesman Problem (TSP).
            </li>
            <li>
              <span className="font-semibold">Loading Sequence Planner:</span>{" "}
              Implements the Bin Packing Algorithm to maximize truck capacity
              and optimize unloading order.
            </li>
            <li>
              <span className="font-semibold">Traffic Pattern Analyzer:</span>{" "}
              Uses real-time data visualization to detect congestion hotspots
              and recommend alternative routes.
            </li>
            <li>
              <span className="font-semibold">Safety Analysis Service:</span>{" "}
              Uses historical accident data to identify high-risk zones for
              improved urban planning.
            </li>
            <li>
              <span className="font-semibold">
                Public Transport Optimization:
              </span>{" "}
              Enhances scheduling efficiency by analyzing geospatial data and
              reducing overlapping routes.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="next-steps"
        >
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Next Steps
          </h3>
          <p className="text-gray-300 mt-4 leading-7">
            After setting up your account, explore UPLYFT’s features:
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              Monitor{" "}
              <span className="font-semibold">live traffic congestion</span> and
              analyze heatmaps.
            </li>
            <li>
              Utilize{" "}
              <span className="font-semibold">AI-driven route planning</span> to
              optimize deliveries.
            </li>
            <li>
              Enhance{" "}
              <span className="font-semibold">public transport scheduling</span>{" "}
              for peak-hour efficiency.
            </li>
            <li>
              Use <span className="font-semibold">safety analysis tools</span>{" "}
              to mitigate accident risks.
            </li>
          </ul>
          <p className="text-gray-300 mt-4 leading-7">
            For further assistance, refer to the full documentation or contact
            support.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function ArchitectureContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Architecture
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          A comprehensive overview of UPLYFT’s system architecture, detailing
          its
          <span className="font-semibold"> microservices framework</span>,{" "}
          <span className="font-semibold"> data processing flow</span>, and{" "}
          <span className="font-semibold"> real-time analytics pipeline</span>.
        </p>
      </motion.header>

      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="system-overview"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            System Overview
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT is built on a{" "}
            <span className="font-semibold">
              {" "}
              cloud-native microservices architecture
            </span>{" "}
            that enables
            <span className="font-semibold"> scalability</span>,{" "}
            <span className="font-semibold"> resilience</span>, and
            <span className="font-semibold"> independent deployment</span> of
            services. The platform integrates multiple AI-driven modules to
            handle complex routing, logistics, and traffic management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="core-components"
        >
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Core Components
          </h3>
          <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
            {[
              "Route Optimization Engine - AI-powered logistics planning",
              "Data Processing Pipeline - Ingests and processes live traffic, weather, and logistics data",
              "Real-time Analytics Service - Generates heatmaps and predictive models",
              "User Authentication System - Secures access via OAuth and multi-factor authentication",
              "API Gateway - Manages communication between frontend, backend, and external APIs",
              "Traffic & Safety Analysis - Identifies congestion hotspots and accident-prone areas",
              "Public Transport Optimization - Dynamically adjusts schedules based on demand",
            ].map((component, index) => (
              <motion.li
                key={index}
                className="text-gray-300 pl-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {component}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="data-flow"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Data Flow & Processing
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT employs a structured{" "}
            <span className="font-semibold"> multi-stage data pipeline</span> to
            ensure
            <span className="font-semibold">
              {" "}
              efficient real-time decision-making
            </span>
            . The system processes data through several key stages:
          </p>

          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              <span className="font-semibold">Data Collection:</span> Gathers
              real-time data from traffic sensors, GPS devices, and external
              APIs.
            </li>
            <li>
              <span className="font-semibold">Data Processing:</span> Cleans,
              filters, and aggregates data using a distributed computing
              framework.
            </li>
            <li>
              <span className="font-semibold">AI & ML Analysis:</span> Applies
              predictive models to optimize routing and congestion forecasting.
            </li>
            <li>
              <span className="font-semibold">Visualization:</span> Generates
              dashboards with real-time heatmaps and analytics.
            </li>
            <li>
              <span className="font-semibold">User Interaction:</span> Provides
              insights and recommendations through the web and mobile
              interfaces.
            </li>
          </ul>

          <motion.div
            className="relative my-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-sm font-medium text-gray-400">
                Data Flow Diagram
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                <span className="sr-only">Copy code</span>
              </motion.button>
            </div>
            <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
              <code className="language-bash text-gray-100">
                {`Data Sources → Data Collection → Processing → AI/ML Analysis → Visualization → User Interface`}
              </code>
            </pre>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="infrastructure-scalability"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Infrastructure & Scalability
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT leverages a{" "}
            <span className="font-semibold"> cloud-based infrastructure</span>{" "}
            to ensure high availability and
            <span className="font-semibold"> fault tolerance</span>. The system
            is designed with:
          </p>

          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              <span className="font-semibold">Containerized Deployment:</span>{" "}
              Uses Docker and Kubernetes for efficient service management.
            </li>
            <li>
              <span className="font-semibold">Event-Driven Architecture:</span>{" "}
              Implements Kafka and Redis for real-time data streaming.
            </li>
            <li>
              <span className="font-semibold">Auto-Scaling:</span> Dynamically
              scales resources based on traffic demand.
            </li>
            <li>
              <span className="font-semibold">Security Measures:</span> Includes
              role-based access control (RBAC) and data encryption.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="next-steps"
        >
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Next Steps
          </h3>
          <p className="text-gray-300 mt-4 leading-7">
            Now that you understand UPLYFT’s architecture, you can:
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>
              Explore{" "}
              <span className="font-semibold"> real-time analytics</span>{" "}
              through the dashboard.
            </li>
            <li>
              Monitor{" "}
              <span className="font-semibold">
                {" "}
                AI-driven route optimization
              </span>{" "}
              in action.
            </li>
            <li>
              Leverage{" "}
              <span className="font-semibold">
                {" "}
                public transport and traffic safety insights
              </span>{" "}
              for urban planning.
            </li>
          </ul>
          <p className="text-gray-300 mt-4 leading-7">
            For more details, refer to the full documentation or contact
            support.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function PublicContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Public Interface
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          UPLYFT enhances urban mobility by providing real-time insights and
          tools for the general public. It improves traffic flow, reduces
          congestion, and enhances public transportation services.
        </p>
      </motion.header>

      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Understanding the UPLYFT Dashboard
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            The UPLYFT Dashboard is an advanced interface that provides
            real-time insights into urban transportation, delivery logistics,
            and traffic conditions. It is accessible to all three user
            types—Users, Delivery Partners, and Bus Operators—allowing each to
            efficiently navigate and optimize their operations. Below is a
            step-by-step breakdown of how to use the dashboard and its key
            features.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 1: Accessing the Dashboard
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                Once logged into UPLYFT, navigate to the Dashboard section. The
                interface is designed to be intuitive, providing an overview of
                live transportation data, real-time analytics, and interactive
                tools to assist users in decision-making.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Accessing Dashboard
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Log in to your UPLYFT account\n• Navigate to the Dashboard tab in the main menu\n• Access real-time transportation insights instantly`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 2: Viewing Bus Details
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The dashboard provides a detailed view of all buses currently
                operating in Bangalore. Users can track active buses, check
                schedules, and see operational statuses in real time.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Bus Details
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• View all active buses running in Bangalore\n• Check routes, schedules, and expected arrival times\n• Monitor real-time bus locations and movement`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 3: Using Filters to Select Specific Days
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The filtering feature allows users to analyze bus operations on
                specific days. This is particularly useful for tracking
                historical trends and planning future journeys.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Using Filters
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Select a specific date from the filter menu\n• View bus availability and scheduling for that day\n• Compare past and present data for planning`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 4: Exploring the Interactive Map
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                A dynamic, interactive map displays all bus routes with clearly
                marked stops. Users can zoom in and out to view route details,
                making it easier to plan their journey or delivery.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Interactive Map
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• View all bus routes with stops marked on the map\n• Click on a route to see detailed travel information\n• Use zoom and pan features for enhanced navigation`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 5: Understanding the Traffic Heat Map
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The traffic heat map visually represents congestion levels
                across the city in real time. This is crucial for delivery
                partners and bus operators looking to avoid high-traffic areas.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Traffic Heat Map
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Identify high-traffic areas using color-coded heat maps\n• Plan routes that avoid congested roads\n• Use live traffic data for smarter navigation`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 6: Checking Real-Time Weather Updates
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                Weather conditions can impact travel times and road safety. The
                dashboard integrates real-time weather data to help users adjust
                their plans accordingly.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Weather Updates
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Get current weather conditions affecting transport\n• Receive alerts on extreme weather that may impact routes\n• Adjust travel plans based on real-time weather updates`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 7: Receiving Live Traffic Incident Alerts
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The dashboard provides live updates on accidents, roadblocks,
                and other disruptions, allowing users to reroute and avoid
                delays.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Traffic Incident Alerts
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Stay informed on accidents, road closures, and diversions\n• Receive instant alerts for high-impact incidents\n• Get alternative route suggestions to save time`}
                  </code>
                </pre>
              </motion.div>
            </div>
          </div>

          <p className="text-gray-300 mt-6 leading-7">
            The UPLYFT Dashboard serves as a central hub for users to make
            informed decisions regarding urban mobility. Whether tracking a bus,
            optimizing a delivery route, or avoiding congestion, the dashboard
            provides all the tools necessary for efficient urban transportation.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function DeliveryPartnerContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Delivery Partner
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          How UPLYFT optimizes delivery operations for logistics companies and
          delivery services.
        </p>
      </motion.header>

      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Delivery Optimization
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT provides delivery partners with powerful tools to optimize
            routes, reduce delivery times, and improve overall efficiency.
          </p>
        </motion.div>

        <div>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Features for Delivery Partners
          </h3>
          <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
            {[
              "Dynamic Route Planning",
              "Real-time Traffic Integration",
              "Loading Sequence Optimization",
              "Delivery Time Predictions",
              "Fleet Management Tools",
            ].map((feature, index) => (
              <motion.li
                key={index}
                className="text-gray-300 pl-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Delivery Route Optimization
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            The Delivery page is an essential tool designed exclusively for
            Delivery Partners. It provides an efficient way to plan, optimize,
            and track deliveries, ensuring cost-effective and eco-friendly
            logistics. By leveraging real-time data and AI-driven route
            optimization, delivery partners can reduce fuel costs, save time,
            and improve overall efficiency.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 1: Input Warehouse Address
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                To begin the delivery planning process, the first step is to
                input the warehouse address. The system allows inputs in two
                formats: coordinates or a standard physical address. As soon as
                you enter the address, a marker will be displayed on the
                interactive map, allowing you to visually confirm the location.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Warehouse Input
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Enter the warehouse location using either:\n• Latitude/Longitude coordinates (e.g., 12.9716° N, 77.5946° E)\n• Standard address format (e.g., 123 Main Street, Bangalore)\n• A marker will appear on the interactive map to confirm the location`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 2: Add Delivery Stops
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                Once the warehouse is set, the next step is to input all
                delivery stops. Along with the address or coordinates of each
                stop, you must specify the weight of goods to be delivered at
                that location. This ensures the system can balance the vehicle
                load efficiently.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Delivery Stops
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Input multiple stops with:\n• Address or GPS coordinates for each delivery location\n• Weight of cargo at each stop (in kg)\n• Each stop will be marked on the interactive map with a unique identifier\n• System updates the total inventory weight automatically as you add stops`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 3: Input Vehicle Details
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                To optimize delivery routes effectively, the system requires
                details about the delivery vehicles. This includes the sample
                weight capacity of a vehicle and the total number of vehicles
                available for delivery. These inputs allow the system to
                calculate the best possible weight distribution across all
                vehicles.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Vehicle Details
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Enter:\n• Sample vehicle weight capacity (maximum load in kg)\n• Total number of vehicles available for this delivery batch\n• System calculates the optimal distribution of weight across vehicles to minimize trips`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 4: Route Optimization
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                Once all required data is entered, clicking on the "Optimize"
                button will trigger the backend process. The AI-powered
                algorithm will analyze traffic conditions, road closures, and
                delivery constraints to generate the most efficient delivery
                routes. The optimized routes will be displayed dynamically on
                the interactive map, showing the weight distribution across each
                truck and the stop sequence.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Route Optimization
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Clicking 'Optimize' will:\n• Process route calculations using AI algorithms\n• Distribute cargo weight optimally across vehicles\n• Display results dynamically on the interactive map with color-coded routes\n• Show each truck's weight, stop sequence, and expected delivery times\n• Provide estimated fuel consumption and total delivery time`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 5: ECO Mode for Climate Conservation
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The Delivery page includes an optional ECO Mode, which
                prioritizes environmentally friendly and fuel-efficient routes.
                This feature is designed to reduce carbon emissions, optimize
                fuel usage, and contribute to sustainable logistics practices.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    ECO Mode
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• ECO Mode Benefits:\n• Minimizes fuel consumption by up to 15%\n• Reduces overall carbon footprint of delivery operations\n• Optimizes delivery routes with environmental impact in mind\n• May slightly increase delivery time but significantly reduces emissions`}
                  </code>
                </pre>
              </motion.div>
            </div>
          </div>

          <p className="text-gray-300 mt-6 leading-7">
            The Delivery page simplifies logistics planning through real-time
            mapping, automatic inventory updates, and AI-driven route
            optimization. It ensures delivery partners can operate efficiently
            while contributing to a greener future.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function BusOperatorContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Bus Operator
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          {" "}
          Tools and features for bus operators to optimize routes, schedules,
          and passenger experience.{" "}
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Public Transport Optimization
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT helps bus operators improve service reliability, reduce wait
            times, and optimize fleet utilization through data-driven insights.
          </p>
        </motion.div>

        <div>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Bus Operator Tools
          </h3>
          <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
            {[
              "Schedule Optimization",
              "Passenger Load Prediction",
              "Real-time Fleet Tracking",
              "Driver Performance Analytics",
              "Maintenance Scheduling",
            ].map((feature, index) => (
              <motion.li
                key={index}
                className="text-gray-300 pl-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Public Transport Route Management
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            The Bus Routes section is exclusively designed for Bus Operators to
            manage and optimize public transport routes. This powerful tool
            enables operators to create new routes, modify existing ones, and
            analyze passenger data to improve overall service efficiency. By
            leveraging AI-powered analytics, bus operators can make data-driven
            decisions that enhance the public transport experience.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 1: Viewing Existing Routes
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                Upon accessing the Bus Routes section, operators can view a
                comprehensive list of all existing bus routes. Each route
                displays key information such as origin, destination, number of
                stops, and current operational status.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Existing Routes
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• View all active bus routes in a sortable table format\n• See route numbers, start/end points, and total distance\n• Check passenger volume and peak hours for each route\n• Monitor on-time performance metrics for each route`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 2: Creating New Routes
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The system provides an intuitive interface for creating new bus
                routes. Operators can select start and end points on the map and
                add intermediate stops to define the complete route path.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Creating Routes
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Click "Create New Route" to begin the process\n• Select origin and destination points on the interactive map\n• Add intermediate stops by clicking on the map or entering addresses\n• Set schedule times, frequency, and service days\n• The system automatically calculates route distance and estimated travel time`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 3: Route Optimization
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The AI-powered optimization tool analyzes traffic patterns,
                passenger demand, and historical data to suggest improvements to
                existing routes. This helps operators maximize efficiency and
                passenger satisfaction.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Route Optimization
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Select a route to optimize from the list\n• View AI-generated suggestions for route improvements\n• See potential time savings and efficiency gains\n• Adjust stop sequences to reduce overall travel time\n• Optimize bus schedules based on passenger demand patterns`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 4: Analyzing Passenger Data
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The system provides detailed analytics on passenger volumes,
                peak hours, and travel patterns. This data is crucial for making
                informed decisions about route modifications and service
                frequency.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Passenger Analytics
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• View heat maps showing passenger density along routes\n• Analyze hourly, daily, and seasonal passenger trends\n• Identify underserved areas and overcrowded routes\n• Use predictive analytics to forecast future demand`}
                  </code>
                </pre>
              </motion.div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Step 5: Managing Service Disruptions
              </h3>
              <p className="text-gray-300 mt-2 leading-7">
                The Bus Routes section includes tools for managing planned and
                unplanned service disruptions. Operators can create detours,
                adjust schedules, and communicate changes to passengers in
                real-time.
              </p>
              <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-400">
                    Service Disruptions
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    <span className="sr-only">Copy code</span>
                  </motion.button>
                </div>
                <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                  <code className="language-bash text-gray-100">
                    {`• Create temporary route detours due to road closures\n• Adjust service frequency during special events\n• Send real-time notifications to passengers about changes\n• View impact analysis of service modifications`}
                  </code>
                </pre>
              </motion.div>
            </div>
          </div>

          <p className="text-gray-300 mt-6 leading-7">
            The Bus Routes section empowers operators to create a more
            efficient, responsive, and passenger-focused public transport
            system. By leveraging data analytics and AI-driven insights,
            operators can continuously improve service quality while optimizing
            operational costs.
          </p>
        </motion.div>
      </section>
    </>
  );
}

function LoadingSequenceContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Loading Sequence
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          Optimizing the order in which goods are loaded for efficient delivery
          operations.
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Bin Packing Algorithm
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            Our loading sequence planner uses the bin packing algorithm to
            optimize how packages are loaded into delivery vehicles, ensuring
            efficient unloading and space utilization.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              What is Bin Packing?
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              The bin packing algorithm is a smart way to load items into a
              truck, ensuring everything fits without overloading. It loads
              items in reverse delivery order for efficient unloading and packs
              them tightly to minimize wasted space, saving fuel and trips. This
              makes deliveries faster, safer, and more cost effective.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Algorithm Example
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`Dry Run Example:\n\n-  Sort Items: Reverse delivery order → C3 (last), B2, A1 (first).\n-  Load Truck:\n  - Add A1 (200kg): Remaining capacity = 300kg.\n  - Add B2 (300kg): Remaining capacity = 0kg.\n\nConstraint:\nThe total number of demands of the served destinations cannot exceed the capacity of the vehicle for each route.`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Implementation Process
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Our implementation of the bin packing algorithm follows a
              systematic process to ensure optimal loading sequence.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Process Steps
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`1. Analyze Delivery Route: Determine the sequence of deliveries\n2. Reverse Order: Arrange items in reverse delivery order\n3. Weight Calculation: Calculate total weight and compare to vehicle capacity\n4. Space Optimization: Arrange items to maximize space utilization\n5. Loading Instructions: Generate step-by-step loading instructions for warehouse staff`}
                </code>
              </pre>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function DeliveryRoutingContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Delivery Routing
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          Advanced algorithms for optimizing delivery routes and schedules.
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Genetic Algorithm for Delivery Routing
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT implements a Genetic Algorithm (GA) for delivery routing - an
            optimization technique inspired by natural selection that helps find
            the most efficient delivery routes. It is especially useful for
            solving complex Traveling Salesman Problems (TSP) or Vehicle Routing
            Problems (VRP) in logistics.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">How It Works</h3>
            <p className="text-gray-300 mt-2 leading-7">
              A GA iteratively improves a population of possible delivery routes
              using evolutionary principles such as selection, crossover, and
              mutation.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Algorithm Steps
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`1. Initialization\n   - Generate an initial population of random delivery routes\n   - Each route is a sequence of delivery points (customers, warehouses, etc.)\n\n2. Fitness Function\n   - Evaluate each route based on factors like distance, time, fuel consumption\n   - A lower total cost (distance/time) means a better fitness score`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Evolution Process
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              The algorithm uses evolutionary principles to iteratively improve
              route solutions.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Evolution Steps
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`3. Selection\n   - Choose the best-performing routes (parents) for reproduction\n   - Common selection methods: Roulette Wheel, Tournament Selection, Rank Selection\n\n4. Crossover (Recombination)\n   - Combine two parent routes to create new offspring routes\n   - Methods: Partially Mapped Crossover (PMX), Order Crossover (OX), Cycle Crossover (CX)\n\n5. Mutation\n   - Randomly alter routes to maintain diversity and avoid local optima\n   - Common mutations: Swap, Inversion, Scramble, and Insert mutations\n\n6. Termination\n   - Repeat the process for a fixed number of generations or until an optimal route is found\n   - The best route is selected based on the lowest cost and highest efficiency`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Benefits of Genetic Algorithms
            </h3>
            <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
              {[
                "Can handle complex routing problems with many constraints",
                "Finds near-optimal solutions for problems that would be impossible to solve exactly",
                "Adaptable to changing conditions and requirements",
                "Capable of balancing multiple objectives (time, distance, fuel, etc.)",
                "Continuously improves solutions over time",
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function BusTransportOptimizationContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Bus Transport Optimization
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          Improving public transportation efficiency and passenger experience.
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-200">
            Optimization Techniques
          </h3>
          <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
            {[
              "Demand Prediction",
              "Schedule Optimization",
              "Route Planning",
              "Fleet Allocation",
              "Passenger Flow Analysis",
            ].map((technique, index) => (
              <motion.li
                key={index}
                className="text-gray-300 pl-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {technique}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Transshipment Point Optimization
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT analyzes urban mobility using historical geospatial data to
            optimize public transport by reducing overlapping routes and
            creating strategic transshipment nodes.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Purpose and Implementation
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Transshipment points are created by identifying strategic
              intersections where multiple routes naturally converge, making
              them ideal hubs for passenger transfers.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Transshipment Point Creation
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`-  The transshipment point is created by identifying the Shopping Center as a strategic intersection where Route A and Route B naturally converge, making it an ideal hub for passenger transfers\n\n-  The Shopping Center is then enhanced with essential infrastructure including waiting areas, digital display systems, and coordinated scheduling mechanisms to facilitate smooth transfers between routes`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Algorithm Steps
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Our optimization algorithm follows a systematic approach to
              identify and implement transshipment nodes.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Optimization Algorithm
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`1. Cluster Stops by Proximity\n   - DBSCAN clustering with eps 300 m and min_samples 3\n   - Merge isolated stops into the nearest cluster if within 500 m\n\n2. Identifying Central Node\n   - For each cluster, calculate the geographic centroid\n   - Selecting the stop closest to the centroid that lies on at least one route\n\n3. Route Optimization\n   - Redirecting overlapping routes through the central node\n   - Removing redundant segments to reduce overlap`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Benefits of Transshipment Nodes
            </h3>
            <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
              {[
                "Reduced route overlap and more efficient network coverage",
                "Decreased operational costs through optimized fleet utilization",
                "Improved passenger experience with coordinated transfers",
                "Enhanced waiting facilities at strategic transfer points",
                "Real-time information systems for smoother connections",
                "Reduced congestion in urban areas through better route planning",
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function SafetyAnalysisContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Safety Analysis
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          Enhancing road safety through data-driven insights and predictive
          analytics.
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Safety Analytics
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT's safety analysis tools help identify potential hazards,
            predict accident-prone areas, and suggest safer routes and driving
            behaviors.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Safety Analysis Service
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            The Safety Analysis Service is an intelligent road safety system
            that utilizes clustering algorithms in Python to analyze historical
            accident data and identify high-risk areas. By recognizing accident
            hotspots and determining common causes—such as speeding, red-light
            violations, and hazardous weather conditions—the service helps city
            planners and traffic authorities implement targeted safety measures.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">Key Features</h3>
            <p className="text-gray-300 mt-2 leading-7">
              Our comprehensive safety analysis system includes several advanced
              features:
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Accident Hotspot Identification
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`-  Uses clustering algorithms to detect areas with a high concentration of accidents\n-  Helps authorities focus safety interventions where they are most needed\n\nAccident Cause Analysis:\n-  Identifies common causes of accidents, including:\n   -  Speeding violations\n   -  Red-light running\n   -  Poor road conditions\n   -  Adverse weather effects\n-  Enables data-driven decisions for preventive measures like traffic enforcement and infrastructure improvements`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Real-Time Monitoring
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              The system provides continuous monitoring of critical safety
              factors.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Monitoring Systems
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`Real-Time Weather Monitoring:\n-  Integrates with live weather data sources to analyze the impact of weather conditions on road safety\n-  Alerts authorities and drivers about hazardous conditions such as heavy rainfall, fog, or icy roads\n\nReal-Time Traffic Analysis:\n-  Continuously monitors traffic flow, congestion, and accident reports\n-  Assists in dynamic route planning and safety advisories to reduce accident risks\n\nPredictive Analysis & Reporting:\n-  Uses historical data trends to predict future accident-prone areas\n-  Generates detailed safety reports and heatmaps for better urban planning`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Impact & Benefits
            </h3>
            <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
              {[
                "Reduces Traffic Accidents – Enables early intervention through data-driven safety planning",
                "Saves Lives – Helps cities take proactive measures to enhance road safety",
                "Improves Urban Infrastructure – Supports decision-making for road improvements and traffic control measures",
                "Enhances Emergency Response – Provides insights to optimize emergency vehicle dispatch routes",
              ].map((benefit, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {benefit}
                </motion.li>
              ))}
            </ul>
            <p className="text-gray-300 mt-2 leading-7">
              The Safety Analysis Service empowers city officials, traffic
              management teams, and policymakers with actionable insights to
              create safer and more efficient roadways for everyone.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function AuthenticationContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Authentication
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7">
          Secure user authentication and authorization systems for UPLYFT.
        </p>
      </motion.header>

      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="authentication-system"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Authentication System
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT uses a robust authentication system to ensure secure access
            to the platform and protect user data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="role-based-access-control"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Role-Based Access Control
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT implements a role-based authentication system to ensure
            secure and restricted access to different sections of the platform.
            Users must log in or sign up to access any content. Based on their
            assigned roles, they have specific access permissions, and
            unauthorized access results in an error page.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="user-roles-access-permissions"
          >
            <h3 className="text-xl font-semibold text-white">
              User Roles & Access Permissions
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Different user roles have specific access permissions within the
              UPLYFT platform.
            </p>

            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-gray-300 border-collapse border border-gray-800">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border border-gray-700 px-4 py-2">
                        User Role
                      </th>
                      <th className="border border-gray-700 px-4 py-2">
                        Accessible Pages
                      </th>
                      <th className="border border-gray-700 px-4 py-2">
                        Restricted Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-700 px-4 py-2">
                        Public User
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Dashboard
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Delivery Page, Bus Operator Page
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-700 px-4 py-2">
                        Delivery Partner
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Dashboard, Delivery Page
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Bus Operator Page
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-700 px-4 py-2">
                        Bus Operator
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Dashboard, Bus Operator Page
                      </td>
                      <td className="border border-gray-700 px-4 py-2">
                        Delivery Page
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="unauthorized-access-handling"
          >
            <h3 className="text-xl font-semibold text-white">
              Unauthorized Access Handling
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              UPLYFT has robust mechanisms to handle unauthorized access
              attempts.
            </p>

            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  Users attempting to access restricted pages will be redirected
                  to an error page with a message:{" "}
                  <span className="font-semibold">
                    "You do not have access to this page."
                  </span>
                </li>
                <li>
                  Authentication is required to access any section of the
                  platform.
                </li>
                <li>
                  Role-based access control ensures a secure and user-specific
                  experience.
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            id="authentication-flow"
          >
            <h3 className="text-xl font-semibold text-white">
              Authentication Flow
            </h3>
            <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
              {[
                "User submits login credentials (username/email and password).",
                "System validates credentials against stored data.",
                "Upon successful authentication, user role is determined.",
                "Access token is generated with embedded role information.",
                "User is granted access to authorized sections based on their role.",
                "Session monitoring ensures continued authorized access.",
              ].map((step, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {step}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

function DatabaseContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-400 to-gray-100 bg-clip-text text-transparent">
          Database
        </h1>
        <p className="text-lg text-gray-300 mt-4 md:mt-6 leading-7 md:leading-8">
          Database architecture and data management in UPLYFT.
        </p>
      </motion.header>
      <section className="space-y-8 md:space-y-12 mt-8 md:mt-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            Database Architecture
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            UPLYFT uses a combination of relational and NoSQL databases to
            handle different types of data and workloads efficiently.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight border-b border-gray-800 pb-2">
            PostgreSQL & Prisma Integration
          </h2>
          <p className="text-gray-300 mt-4 leading-7">
            Uplyft utilizes PostgreSQL as the primary database and Prisma as the
            ORM (Object-Relational Mapping) tool to manage and interact with the
            database efficiently. The system securely stores user data,
            retrieves bus details, and manages route creation, ensuring smooth
            and reliable data handling.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Key Database Features
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Our database implementation provides several critical features for
              the Uplyft platform:
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Data Storage & Management
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`User Data Storage:\n-  Stores user information, authentication credentials, and role-based access control details\n-  Ensures data integrity and security through robust database management practices\n\nBus Details Management:\n-  Fetches bus-related data from the database, including schedules, capacities, and operator details\n-  Enables quick and efficient retrieval for seamless functionality within the application\n\nRoute Creation & Storage:\n-  New bus routes are dynamically created and saved in the database\n-  Supports efficient route planning and management for bus operators`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Prisma ORM Implementation
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Prisma ORM provides a type-safe and intuitive way to interact with
              our PostgreSQL database.
            </p>
            <motion.div className="mt-3 rounded-xl border border-gray-800 bg-gray-900/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-medium text-gray-400">
                  Prisma Benefits
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                  <span className="sr-only">Copy code</span>
                </motion.button>
              </div>
              <pre className="overflow-x-auto p-6 text-sm font-mono bg-gray-950/50 rounded-b-xl">
                <code className="language-bash text-gray-100">
                  {`-  Type-safe database queries with auto-generated TypeScript types\n-  Intuitive API for complex database operations\n-  Simplified database migrations and schema updates\n-  Efficient query building with relation handling\n-  Prepared statement caching for optimized performance\n-  Support for complex filtering and pagination`}
                </code>
              </pre>
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-white">
              Database Schema Design
            </h3>
            <p className="text-gray-300 mt-2 leading-7">
              Our database schema is carefully designed to support all Uplyft
              operations with optimal performance.
            </p>
            <ul className="my-6 ml-6 list-disc space-y-3 marker:text-gray-400">
              {[
                "User model with role-based access control fields",
                "Bus model with detailed specifications and operational data",
                "Route model with geospatial data and scheduling information",
                "Delivery model with package details and tracking information",
                "One-to-many relationships between operators and buses/routes",
                "Advanced indexing for high-performance queries",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="text-gray-300 pl-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>
    </>
  );
}
