// src/app/profile/admin/dashboard/page.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Header from "@/app/components/Header";
import useGetData from "@/hooks/useGetData";
import CollapsibleSection from "./components/CollapsibleSection";

// ========== Formularios Categoría ==========
import CreateCategoryForm from "@/app/profile/admin/categories/create/CreateCategoryForm";
import UpdateCategoryForm from "@/app/profile/admin/categories/update/UpdateCategoryForm";

// ========== Formularios Marca ==========
import CreateBrandForm from "@/app/profile/admin/brands/create/CreateBrandForm";
import UpdateBrandForm from "@/app/profile/admin/brands/update/UpdateBrandForm";

// ========== Formularios SubCategoría ==========
import CreateSubCategoryForm from "@/app/profile/admin/subCategories/create/CreateSubCategoryForm";
import UpdateSubCategoryForm from "@/app/profile/admin/subCategories/update/UpdateSubCategoryForm";

// ========== Formularios Tipo ==========
import CreateTypeForm from "@/app/profile/admin/types/create/CreateTypeForm";
import UpdateTypeForm from "@/app/profile/admin/types/update/UpdateTypeForm";

// ========== Formularios Rol (solo crear) ==========
import CreateRoleForm from "@/app/profile/admin/roles/create/CreateRoleForm";

// ========== Formularios Producto ==========
import CreateProductForm from "@/app/profile/admin/products/create/CreateProductForm";
import UpdateProductForm from "@/app/profile/admin/products/update/UpdateProductForm";

const AdminDashboard = () => {
  // ---- CONTEXT Y ROUTER ----
  const { currentUser, authLoading } = useContext(AuthContext);
  const router = useRouter();

  // ---- ESTADOS PARA EL PANEL DERECHO ----
  // action: "create" o "update"
  const [action, setAction] = useState(null);
  // activeSection: "category", "brand", "subCategory", "type", "role", "product", etc.
  const [activeSection, setActiveSection] = useState(null);

  // Para actualizar (categorías, marcas, tipos, productos), necesitamos un "url"
  const [selectedUrl, setSelectedUrl] = useState("");

  // Para subcategorías, necesitamos saber `categoryUrl` y `subCategoryUrl`
  const [selectedCategoryUrl, setSelectedCategoryUrl] = useState("");
  const [selectedSubCategoryUrl, setSelectedSubCategoryUrl] = useState("");

  // Para actualizar productos, necesitamos pasar el `url`
  const [selectedProductUrl, setSelectedProductUrl] = useState("");

  // ---- VERIFICA PERMISOS ----
  useEffect(() => {
    if (
      !authLoading &&
      (!currentUser ||
        !currentUser.permissions?.includes("create") ||
        !currentUser.permissions?.includes("update"))
    ) {
      router.push("/login");
    }
  }, [authLoading, currentUser, router]);

  // Solo hacemos fetch si el usuario tiene permisos
  const shouldFetch =
    currentUser?.permissions?.includes("create") &&
    currentUser?.permissions?.includes("update");

  // ---- FETCH DE CATEGORÍAS ----
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/get/list" : null,
    "categories",
    shouldFetch
  );

  // ---- FETCH DE MARCAS ----
  const {
    data: brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useGetData(
    shouldFetch ? "/api/brands/private/get/list" : null,
    "brands",
    shouldFetch
  );

  // ---- FETCH DE SUBCATEGORÍAS ----
  const {
    data: subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError,
    refetch: refetchSubCategories,
  } = useGetData(
    shouldFetch ? "/api/categories/private/subCategories/get/list" : null,
    "subcategories",
    shouldFetch
  );

  // ---- FETCH DE TIPOS ----
  const {
    data: types,
    loading: typesLoading,
    error: typesError,
    refetch: refetchTypes,
  } = useGetData(
    shouldFetch ? "/api/types/private/get/list" : null,
    "types",
    shouldFetch
  );

  // ---- FETCH DE ROLES (solo crear, pero quizás queramos listar) ----
  const {
    data: roles,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetData(
    shouldFetch ? "/api/roles/get/list" : null, // Ajusta la ruta si difiere
    "roles",
    shouldFetch
  );

  // ---- FETCH DE PRODUCTOS ----
  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetData(
    shouldFetch ? "/api/products/private/product/get/list" : null,
    "products",
    shouldFetch
  );

  // ---- ESTADOS DE CARGA Y ERROR ----
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
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // ---- HANDLERS PARA CATEGORÍAS ----
  const handleCreateCategory = () => {
    setActiveSection("category");
    setAction("create");
    setSelectedUrl("");
  };
  const handleUpdateCategory = (url) => {
    setActiveSection("category");
    setAction("update");
    setSelectedUrl(url);
  };

  // ---- HANDLERS PARA MARCAS ----
  const handleCreateBrand = () => {
    setActiveSection("brand");
    setAction("create");
    setSelectedUrl("");
  };
  const handleUpdateBrand = (url) => {
    setActiveSection("brand");
    setAction("update");
    setSelectedUrl(url);
  };

  // ---- HANDLERS PARA SUBCATEGORÍAS ----
  const handleCreateSubCategory = () => {
    setActiveSection("subCategory");
    setAction("create");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
  };
  const handleUpdateSubCategory = (catUrl, subCatUrl) => {
    setActiveSection("subCategory");
    setAction("update");
    setSelectedCategoryUrl(catUrl);
    setSelectedSubCategoryUrl(subCatUrl);
  };

  // ---- HANDLERS PARA TIPOS ----
  const handleCreateType = () => {
    setActiveSection("type");
    setAction("create");
    setSelectedUrl("");
  };
  const handleUpdateType = (url) => {
    setActiveSection("type");
    setAction("update");
    setSelectedUrl(url);
  };

  // ---- HANDLERS PARA ROLES (solo create, sin update) ----
  const handleCreateRole = () => {
    setActiveSection("role");
    setAction("create");
  };

  // ---- HANDLERS PARA PRODUCTOS ----
  const handleCreateProduct = () => {
    setActiveSection("product");
    setAction("create");
  };
  const handleUpdateProduct = (url) => {
    setActiveSection("product");
    setAction("update");
    setSelectedProductUrl(url);
  };

  // ---- RESETEAR EL PANEL DERECHO ----
  const resetPanel = () => {
    setAction(null);
    setActiveSection(null);
    setSelectedUrl("");
    setSelectedCategoryUrl("");
    setSelectedSubCategoryUrl("");
    setSelectedProductUrl("");
  };

  return (
    <>
      <Header textColor="black" position="relative" />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Panel de Administración
        </h1>

        <div className="flex">
          {/* ===================== PANEL IZQUIERDO (40%) ===================== */}
          <div className="w-2/5 pr-4 space-y-6">
            {/* --- SECCIÓN CATEGORÍAS --- */}
            <CollapsibleSection
              title="Categorías"
              color="bg-blue-500 hover:bg-blue-600"
              items={categories.categories} // Asumiendo tu API retorna { categories: [ ... ] }
              onCreate={handleCreateCategory}
              onUpdate={(url) => handleUpdateCategory(url)}
            />

            {/* --- SECCIÓN MARCAS --- */}
            <CollapsibleSection
              title="Marcas"
              color="bg-red-500 hover:bg-red-600"
              items={brands.brands} // Asumiendo tu API retorna { brands: [ ... ] }
              onCreate={handleCreateBrand}
              onUpdate={(url) => handleUpdateBrand(url)}
            />

            {/* --- SECCIÓN SUBCATEGORÍAS --- */}
            <CollapsibleSection
              title="Subcategorías"
              color="bg-purple-500 hover:bg-purple-600"
              items={subcategories.subcategories} // Asumiendo tu API retorna { subcategories: [ ... ] }
              onCreate={handleCreateSubCategory}
              onUpdate={(subCatUrl) => {
                // Buscamos la subcategoría
                const sc = subcategories.subcategories.find(
                  (s) => s.url === subCatUrl
                );
                if (sc) {
                  handleUpdateSubCategory(sc.categoryUrl, sc.url);
                }
              }}
            />

            {/* --- SECCIÓN TIPOS --- */}
            <CollapsibleSection
              title="Tipos"
              color="bg-yellow-500 hover:bg-yellow-600"
              items={types.types} // Asumiendo tu API retorna { types: [ ... ] }
              onCreate={handleCreateType}
              onUpdate={(url) => handleUpdateType(url)}
            />

            {/* --- SECCIÓN ROLES (SOLO CREATE) --- */}
            <CollapsibleSection
              title="Roles"
              color="bg-teal-500 hover:bg-teal-600"
              items={roles.roles} // Asumiendo tu API retorna { roles: [ ... ] }
              onCreate={handleCreateRole}
              // No pasamos onUpdate, porque no tendremos actualización de roles
            />

            {/* --- SECCIÓN PRODUCTOS --- */}
            <CollapsibleSection
              title="Productos"
              color="bg-green-500 hover:bg-green-600"
              items={products.products} // Asumiendo tu API retorna { products: [ ... ] }
              onCreate={handleCreateProduct}
              onUpdate={(url) => handleUpdateProduct(url)}
            />
          </div>

          {/* ===================== PANEL DERECHO (60%) ===================== */}
          <div className="w-3/5 bg-gray-50 p-4 rounded">
            {/* ===================== CATEGORÍAS ===================== */}
            {action === "create" && activeSection === "category" && (
              <CreateCategoryForm
                onSuccess={() => {
                  resetPanel();
                  refetchCategories();
                }}
              />
            )}
            {action === "update" && activeSection === "category" && selectedUrl && (
              <UpdateCategoryForm
                url={selectedUrl}
                onSuccess={() => {
                  resetPanel();
                  refetchCategories();
                }}
              />
            )}

            {/* ===================== MARCAS ===================== */}
            {action === "create" && activeSection === "brand" && (
              <CreateBrandForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands();
                }}
              />
            )}
            {action === "update" && activeSection === "brand" && selectedUrl && (
              <UpdateBrandForm
                url={selectedUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchBrands();
                }}
              />
            )}

            {/* ===================== SUBCATEGORÍAS ===================== */}
            {action === "create" && activeSection === "subCategory" && (
              <CreateSubCategoryForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchSubCategories();
                }}
              />
            )}
            {action === "update" &&
              activeSection === "subCategory" &&
              selectedCategoryUrl &&
              selectedSubCategoryUrl && (
                <UpdateSubCategoryForm
                  categoryUrl={selectedCategoryUrl}
                  subCategoryUrl={selectedSubCategoryUrl}
                  categories={categories.categories}
                  onSuccess={() => {
                    resetPanel();
                    refetchSubCategories();
                  }}
                />
              )}

            {/* ===================== TIPOS ===================== */}
            {action === "create" && activeSection === "type" && (
              <CreateTypeForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchTypes();
                }}
              />
            )}
            {action === "update" && activeSection === "type" && selectedUrl && (
              <UpdateTypeForm
                url={selectedUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchTypes();
                }}
              />
            )}

            {/* ===================== ROLES (SOLO CREATE) ===================== */}
            {action === "create" && activeSection === "role" && (
              <CreateRoleForm
                onSuccess={() => {
                  resetPanel();
                  refetchRoles();
                }}
              />
            )}

            {/* ===================== PRODUCTOS ===================== */}
            {action === "create" && activeSection === "product" && (
              <CreateProductForm
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchProducts();
                }}
              />
            )}
            {action === "update" && activeSection === "product" && selectedProductUrl && (
              <UpdateProductForm
                url={selectedProductUrl}
                categories={categories.categories}
                onSuccess={() => {
                  resetPanel();
                  refetchProducts();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
