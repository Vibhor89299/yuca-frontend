import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { ProductList } from "@/pages/admin/ProductList";
import ProductForm from "@/pages/admin/ProductForm";
import InventoryManagement from "@/pages/admin/InventoryManagement";
import { OrdersPage } from "@/pages/admin/OrdersPage";
import useAuth from "@/hooks/useAuth";

const AdminRoutes = () => {
  const { user } = useAuth();
  
  // Redirect to login if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="reports" element={<div>Reports - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
