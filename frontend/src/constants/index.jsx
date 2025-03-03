import { Bus, LayoutDashboard, Route, TrafficCone, TriangleAlert, Weight } from "lucide-react";


import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";


export const founders = [
  {
    name: "Pratham Sharma",
    image: user1,
    bio: "Tech visionary with 10+ years in logistics optimization. Passionate about building sustainable transportation solutions."
  },
  {
    name: "Aman Raj",
    image: user2,
    bio: "Full-stack architect specializing in AI-driven route optimization. Loves turning complex problems into elegant code."
  },
  {
    name: "Abhinav Singh",
    image: user3,
    bio: "Operations expert focused on scalable infrastructure. Believes in technology that serves real-world needs."
  },
  {
    name: "Kabeer Arora",
    image: user4,
    bio: "User experience strategist driven by human-centered design. Advocates for accessible mobility solutions."
  }
];

export const navItems = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#" },
  { label: "About Us", href: "#" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "Working with the team at XYZ Company was a game-changer for our project. Their attention to detail and innovative solutions helped us achieve our goals faster than we thought possible. We are grateful for their expertise and professionalism!",
  },
  {
    user: "Akshat Saini",
    company: "Visionary Creations",
    image: user5,
    text: "I am amazed by the level of professionalism and dedication shown by the team. They were able to exceed our expectations and deliver outstanding results.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "The team went above and beyond to ensure our project was a success. Their expertise and dedication are unmatched. I look forward to working with them again in the future.",
  },
];

export const features = [
  {
    icon: <Route />,
    text: "Dynamic Route Optimization",
    description:
      "Leverages AI algorithms (Genetic Algorithm + TSP) to generate fuel-efficient routes in real-time, adjusting for traffic, weather, and road closures. Reduces delivery time by 30% and fuel costs by 20%.",
  },
  {
    icon: <TrafficCone />,
    text: "AI-Powered Traffic Heatmaps",
    description:
      "Identifies traffic hotspots using DBSCAN clustering and time-series analysis. Helps city planners reroute traffic during peak hours, reducing congestion by 25%.",
  },
  {
    icon: <TriangleAlert />,
    text: "Accident Hotspot Detection",
    description:
      "Maps accident-prone zones using spatial clustering and historical data. Recommends infrastructure upgrades (e.g., speed bumps, traffic lights) to reduce accidents by 40% in high-risk areas.",
  },
  {
    icon: <Weight />,
    text: "Loading Sequence Planner",
    description:
      " Uses bin-packing algorithms to organize goods by delivery priority and fragility, minimizing unloading steps and product damage. Ensures 95% truck space utilization.",
  },
  {
    icon: <Bus />,
    text:  "Public Transport Load Balancing",
    description:
      "Creates transshipment nodes using PageRank and spatial clustering to redistribute passengers across buses/metros. Reduces overcrowding by 35% during peak hours.",
  },
  {
    icon: <LayoutDashboard />,
    text: "Interactive Dashboard",
    description:
      "A user-friendly interface that visualizes key metrics, traffic patterns, and optimization insights with interactive charts and heatmaps. Provides real-time monitoring and weather updates.",
  },
];

export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];

export const pricingOptions = [
  {
    title: "User",
    // price: "$0",
    features: [
      "Dashboard Access",
      "Interactive Heatmap",
      "Weather Updates",
      "Live Traffic Incidents",
    ],
  },
  {
    title: "Delivery Partner",
    // price: "$10",
    features: [
      "Dashboard Access",
      "Shipment Tracking",
      "Route Optimization",
      "Fleet Management",
    ],
  },
  {
    title: "Bus Operator",
    // price: "$200",
    features: [
      "Dashboard Access",
      "Bus timetables",
      "Route Optimization",
      "Transhipment Nodes",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },

];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  

];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
 
];
