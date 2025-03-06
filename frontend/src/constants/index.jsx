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
    bio: "Lead Full-Stack Developer - Architecting AI-integrated enterprise solutions with modern tech stacks"
  },
  {
    name: "Aman Raj",
    image: user2,
    bio: "Front-End Engineer - Crafting responsive interfaces using ReactJs with focus on user experience"
  },
  {
    name: "Abhinav Singh",
    image: user3,
    bio: "Back-End Specialist - Designing scalable REST APIs and database architectures with cloud integration"
  },
  {
    name: "Kabeer Arora",
    image: user4,
    bio: "Frontend Developer - Building cross-platform apps focused on clean code practices and intuitive UX"
  }
];

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "Documentation" },
  { label: "About Us", href: "#about" },
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
      "AI-Optimized Routing: Reduces delivery time by 30% and fuel costs by 20% using Genetic Algorithm + TSP.",
  },
  {
    icon: <TrafficCone />,
    text: "AI-Powered Traffic Heatmaps",
    description:
      "Smart Traffic Management: DBSCAN clustering and time-series analysis cut congestion by 25%.",
  },
  {
    icon: <TriangleAlert />,
    text: "Accident Hotspot Detection",
    description:
      "Accident Risk Mapping: Spatial analysis lowers high-risk accidents by 40%.",
  },
  {
    icon: <Weight />,
    text: "Loading Sequence Planner",
    description:
      "Optimized Load Distribution: Bin-packing ensures 95% truck space utilization and minimal product damage",
  },
  {
    icon: <Bus />,
    text:  "Public Transport Load Balancing",
    description:
      "Efficient Passenger Flow: PageRank-based transshipment reduces peak-hour overcrowding by 35%.",
  },
  {
    icon: <LayoutDashboard />,
    text: "Interactive Dashboard",
    description:
      "Real-Time Insights: Interactive dashboard with live traffic, weather, and optimization analytics.",
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
    title: "Personal User",
    features: [
     "🌐 Real-time Traffic Heatmap",      
  "🌦️ Live Weather Integration",       
  "🚨 Incident Alert System",         
  "🔄 Multi-device Dashboard Sync" 
    ],
  },
  {
    title: "Delivery Partner",
    features: [
      "📦 Smart Package Tracking",
      "🛣️ AI Route Optimization", 
      "📊 Fleet Analytics Suite",
      "🔒 Secure Delivery Auth"
    ],
  },
  {
    title: "Bus Operator",
    features: [
      "📊 Dashboard Access",
      "🕒 Bus Timetables",
      "🔄 Route Optimization",
      "🚏 Transhipment Nodes"
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
