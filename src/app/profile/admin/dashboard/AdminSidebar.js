// src/app/profile/admin/dashboard/AdminSidebar.js
"use client";
import React from "react";
import { FiGrid, FiTag, FiLayers, FiSettings, FiUsers, FiBox } from "react-icons/fi";

const sections = [
  {
    key: "categories",
    title: "Categorías",
    icon: <FiGrid color="white" size={20} />,
    color: "bg-blue-500",
  },
  {
    key: "brands",
    title: "Marcas",
    icon: <FiTag color="white" size={20} />,
    color: "bg-red-500",
  },
  {
    key: "subcategories",
    title: "Subcategorías",
    icon: <FiLayers color="white" size={20} />,
    color: "bg-purple-500",
  },
  {
    key: "types",
    title: "Tipos",
    icon: <FiSettings color="white" size={20} />,
    color: "bg-yellow-500",
  },
  {
    key: "roles",
    title: "Roles",
    icon: <FiUsers color="white" size={20} />,
    color: "bg-teal-500",
  },
  {
    key: "products",
    title: "Productos",
    icon: <FiBox color="white" size={20} />,
    color: "bg-green-500",
  },
];

const AdminSidebar = ({ activeSection, onSectionChange }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <ul>
        {sections.map((section) => (
          <li key={section.key}>
            <button
              onClick={() => onSectionChange(section.key)}
              className={`w-full flex items-center px-4 py-3 border-b hover:bg-gray-100 transition-colors duration-200 ${
                activeSection === section.key ? "bg-gray-200" : ""
              }`}
            >
              <span className={`${section.color} p-2 rounded-full`}>{section.icon}</span>
              <span className="ml-3 font-medium">{section.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
