// src/app/profile/admin/dashboard/page.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useGetData from "@/hooks/useGetData";

// Formularios de Categorías
import CreateCategoryForm from "@/app/profile/admin/categories/create/CreateCategoryForm";
import UpdateCategoryForm from "@/app/profile/admin/categories/update/UpdateCategoryForm";

// Formularios de Marcas
import CreateBrandForm from "@/app/profile/admin/brands/create/CreateBrandForm";
import UpdateBrandForm from "@/app/profile/admin/brands/update/UpdateBrandForm";

// Formularios de Subcategorías
import CreateSubCategoryForm from "@/app/profile/admin/subCategories/create/CreateSubCategoryForm";
import UpdateSubCategoryForm from "@/app/profile/admin/subCategories/update/UpdateSubCategoryForm";

// Formularios de Tipos
import CreateTypeForm from "@/app/profile/admin/types/create/CreateTypeForm";
import UpdateTypeForm from "@/app/profile/admin/types/update/UpdateTypeForm";

// Formulario de Roles (solo crear)
import CreateRoleForm from "@/app/profile/admin/roles/create/CreateRoleForm";

// Formularios de Productos
import CreateProductForm from "@/app/profile/admin/products/create/CreateProductForm";
import UpdateProductForm from "@/app/profile/admin/products/update/UpdateProductForm";

// Componente de menú lateral
import AdminSidebar from "./AdminSidebar";

// Importamos react icons para el botón de actualizar
import { FiEdit } from "react-icons/fi";

const AdminDashboard = () => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Estados para la sección activa y la pestaña (list, create, update)
  const [activeSection, setActiveSection] = useState(null); // "categories", "brands", etc.
  const [activeTab, setActiveTab] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  // Verificar permisos de acceso
  useEffect(() => {
    if (
      !authLoading &&
      (!currentUser ||
        !currentUser.permissions?.includes("create") ||
        !currentUser.permissions?.includes("update") ||
        !currentUser.permissions?.includes("admin"))
    ) {
      router.push("/login");
    }
  }, [authLoading, currentUser, router]);

  const shouldFetch =
    currentUser?.permissions?.includes("create") &&
    currentUser?.permissions?.includes("update") &&
    currentUser?.permissions?.includes("admin");

  // Fetch de datos para cada sección
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/get/list" : null,
    "categories",
    shouldFetch
  );

  const {
    data: brandsData,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useGetData(shouldFetch ? "/api/brands/private/get/list" : null, "brands", shouldFetch);

  const {
    data: subcategoriesData,
    loading: subcategoriesLoading,
    error: subcategoriesError,
    refetch: refetchSubCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/subCategories/get/list" : null,
    "subcategories",
    shouldFetch
  );

  const {
    data: typesData,
    loading: typesLoading,
    error: typesError,
    refetch: refetchTypes,
  } = useGetData(shouldFetch ? "/api/types/private/get/list" : null, "types", shouldFetch);

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetData(shouldFetch ? "/api/roles/get/list" : null, "roles", shouldFetch);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetData(
    shouldFetch ? "/api/products/private/product/get/list" : null,
    "products",
    shouldFetch
  );

  const loading =
    authLoading ||
    categoriesLoading ||
    brandsLoading ||
    subcategoriesLoading ||
    typesLoading ||
    rolesLoading ||
    productsLoading;

  const error =
    categoriesError ||
    brandsError ||
    subcategoriesError ||
    typesError ||
    rolesError ||
    productsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="ml-2">{error}</span>
        </div>
      </div>
    );
  }

  // Función para resetear la pestaña y el elemento seleccionado
  const resetTab = () => {
    setActiveTab("list");
    setSelectedItem(null);
  };

  // Cuando se cambia de sección desde el menú lateral
  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
    resetTab();
  };

  // Renderiza el contenido del panel derecho según la sección activa y la pestaña seleccionada
  const renderContent = () => {
    if (!activeSection) {
      return (
        <div className="text-center text-gray-500">
          Selecciona una sección del menú lateral para comenzar.
        </div>
      );
    }

    switch (activeSection) {
      case "categories":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Categorías</h2>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`mr-2 px-4 py-2 rounded ${
                    activeTab === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Listado
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "list" && (
              <div>
                {categoriesData.categories.length === 0 ? (
                  <p className="text-gray-500">No hay categorías disponibles.</p>
                ) : (
                  <ul className="space-y-3">
                    {categoriesData.categories.map((cat, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                      >
                        <span className="text-gray-700">{cat.name}</span>
                        <button
                          onClick={() => {
                            setActiveTab("update");
                            setSelectedItem(cat);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center"
                        >
                          <FiEdit color="white" size={16} className="mr-1" />
                          Actualizar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "create" && (
              <CreateCategoryForm
                onSuccess={() => {
                  resetTab();
                  refetchCategories();
                }}
              />
            )}
            {activeTab === "update" && selectedItem && (
              <UpdateCategoryForm
                url={selectedItem.url}
                onSuccess={() => {
                  resetTab();
                  refetchCategories();
                }}
              />
            )}
          </div>
        );
      case "brands":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Marcas</h2>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`mr-2 px-4 py-2 rounded ${
                    activeTab === "list"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Listado
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "list" && (
              <div>
                {brandsData.brands.length === 0 ? (
                  <p className="text-gray-500">No hay marcas disponibles.</p>
                ) : (
                  <ul className="space-y-3">
                    {brandsData.brands.map((brand, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                      >
                        <span className="text-gray-700">{brand.name}</span>
                        <button
                          onClick={() => {
                            setActiveTab("update");
                            setSelectedItem(brand);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200 flex items-center"
                        >
                          <FiEdit color="white" size={16} className="mr-1" />
                          Actualizar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "create" && (
              <CreateBrandForm
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchBrands();
                }}
              />
            )}
            {activeTab === "update" && selectedItem && (
              <UpdateBrandForm
                url={selectedItem.url}
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchBrands();
                }}
              />
            )}
          </div>
        );
      case "subcategories":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Subcategorías</h2>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`mr-2 px-4 py-2 rounded ${
                    activeTab === "list"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Listado
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "list" && (
              <div>
                {subcategoriesData.subcategories.length === 0 ? (
                  <p className="text-gray-500">No hay subcategorías disponibles.</p>
                ) : (
                  <ul className="space-y-3">
                    {subcategoriesData.subcategories.map((subcat, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                      >
                        <span className="text-gray-700">{subcat.name}</span>
                        <button
                          onClick={() => {
                            setActiveTab("update");
                            setSelectedItem(subcat);
                          }}
                          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors duration-200 flex items-center"
                        >
                          <FiEdit color="white" size={16} className="mr-1" />
                          Actualizar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "create" && (
              <CreateSubCategoryForm
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchSubCategories();
                }}
              />
            )}
            {activeTab === "update" && selectedItem && (
              <UpdateSubCategoryForm
                categoryUrl={selectedItem.categoryUrl}
                subCategoryUrl={selectedItem.url}
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchSubCategories();
                }}
              />
            )}
          </div>
        );
      case "types":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tipos</h2>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`mr-2 px-4 py-2 rounded ${
                    activeTab === "list"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Listado
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "list" && (
              <div>
                {typesData.types.length === 0 ? (
                  <p className="text-gray-500">No hay tipos disponibles.</p>
                ) : (
                  <ul className="space-y-3">
                    {typesData.types.map((type, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                      >
                        <span className="text-gray-700">{type.name}</span>
                        <button
                          onClick={() => {
                            setActiveTab("update");
                            setSelectedItem(type);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-200 flex items-center"
                        >
                          <FiEdit color="white" size={16} className="mr-1" />
                          Actualizar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "create" && (
              <CreateTypeForm
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchTypes();
                }}
              />
            )}
            {activeTab === "update" && selectedItem && (
              <UpdateTypeForm
                url={selectedItem.url}
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchTypes();
                }}
              />
            )}
          </div>
        );
      case "roles":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Roles</h2>
              <div className="mt-2 sm:mt-0">
                {/* Solo se permite crear roles */}
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "create" && (
              <CreateRoleForm
                onSuccess={() => {
                  resetTab();
                  refetchRoles();
                }}
              />
            )}
          </div>
        );
      case "products":
        return (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Productos</h2>
              <div className="mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`mr-2 px-4 py-2 rounded ${
                    activeTab === "list"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Listado
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "create"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Crear
                </button>
              </div>
            </div>
            {activeTab === "list" && (
              <div>
                {productsData.products.length === 0 ? (
                  <p className="text-gray-500">No hay productos disponibles.</p>
                ) : (
                  <ul className="space-y-3">
                    {productsData.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded shadow"
                      >
                        <span className="text-gray-700">{product.name}</span>
                        <button
                          onClick={() => {
                            setActiveTab("update");
                            setSelectedItem(product);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors duration-200 flex items-center"
                        >
                          <FiEdit color="white" size={16} className="mr-1" />
                          Actualizar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "create" && (
              <CreateProductForm
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchProducts();
                }}
              />
            )}
            {activeTab === "update" && selectedItem && (
              <UpdateProductForm
                url={selectedItem.url}
                categories={categoriesData.categories}
                onSuccess={() => {
                  resetTab();
                  refetchProducts();
                }}
              />
            )}
          </div>
        );
      default:
        return <div>Sección no válida.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Panel de Administración
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Menú lateral */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
          </div>
          {/* Panel de contenido */}
          <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
