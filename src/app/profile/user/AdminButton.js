// src/components/AdminButton.js

import React from 'react';

const AdminButton = () => {
  return (
    <div className="mt-4">
      <a
        href="/profile/admin/dashboard"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Panel de Administrador
      </a>
    </div>
  );
};

export default AdminButton;
