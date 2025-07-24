import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";

interface ProductInventory {
  _id: string;
  name: string;
  countInStock: number;
  price: number;
  category: string;
}

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/low-stock', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch inventory');
      
      const data = await response.json();
      setInventory(data.products || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load inventory';
      toast('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId: string, value: string) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: parseInt(value) || 0
    }));
  };

  const updateStock = async (productId: string) => {
    if (stockUpdates[productId] === undefined) return;
    
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));
      
      const response = await fetch(`/api/admin/products/${productId}/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          countInStock: stockUpdates[productId]
        })
      });
      
      if (!response.ok) throw new Error('Failed to update stock');
      
    //   toast({
    //     title: "Success",
    //     description: "Stock updated successfully"
    //   });
      
      // Refresh inventory
      fetchInventory();
      
      // Clear the update
      setStockUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[productId];
        return newUpdates;
      });
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: error.message || "Failed to update stock",
    //     variant: "destructive"
    //   });
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getStockStatus = (count: number) => {
    if (count === 0) return "Out of Stock";
    if (count <= 5) return "Low Stock";
    return "In Stock";
  };

  const getStatusVariant = (count: number) => {
    if (count === 0) return "destructive" as const;
    if (count <= 5) return "default" as const;
    return "default" as const;
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading inventory...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={fetchInventory} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.length > 0 ? (
              inventory.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(product.countInStock)}>
                      {getStockStatus(product.countInStock)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        className="w-24"
                        value={stockUpdates[product._id] ?? ''}
                        onChange={(e) => handleStockChange(product._id, e.target.value)}
                        placeholder={product.countInStock.toString()}
                      />
                      <Button
                        size="sm"
                        onClick={() => updateStock(product._id)}
                        disabled={stockUpdates[product._id] === undefined || updating[product._id]}
                      >
                        {updating[product._id] ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" asChild>
                      <a href={`/admin/products/${product._id}/edit`}>
                        Edit
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {inventory.length === 0 ? 'No low stock items' : 'No products found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Inventory Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-500">
              {inventory.filter(p => p.countInStock === 0).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Low Stock</h3>
            <p className="text-2xl font-bold text-amber-500">
              {inventory.filter(p => p.countInStock > 0 && p.countInStock <= 5).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
