import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { adminAPI } from "@/services/apiManager";
import type { Product, ProductCategory } from "@/types/product";
import { showToast } from "@/lib/toast-utils";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Image as ImageIcon, ImagePlus, AlertCircle, DollarSign } from "lucide-react";
import { Dropzone } from "@/components/ui/dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  countInStock: z.number().min(0, "Stock cannot be negative").default(0),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).optional(),
  images: z.array(z.instanceof(File)).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
  'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'
];

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [imageError, setImageError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{
    mainImage?: string;
    additionalImages: string[];
  }>({
    mainImage: undefined,
    additionalImages: []
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      countInStock: 0,
      category: "",
      status: 'active',
    },
  });

  // Fetch product data for edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode || !id) return;
      
      try {
        setLoading(true);
        const { products } = await adminAPI.products.getAll({ 
          search: id 
        });
        const product = products.find(p => p._id === id);
        
        if (!product) throw new Error('Product not found');

        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          countInStock: product.countInStock,
          category: product.category,
          status: product.status || 'active'
        });
        
        // Set image previews if they exist
        if (product.image) {
          setPreviewUrls(prev => ({ ...prev, mainImage: product.image }));
        }
        if (product.images?.length) {
          setPreviewUrls(prev => ({ ...prev, additionalImages: product.images }));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load product';
        showToast(toast, "Error", errorMessage, "error");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, form, navigate, toast]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrls.mainImage && !previewUrls.mainImage.startsWith('http')) {
        URL.revokeObjectURL(previewUrls.mainImage);
      }
      previewUrls.additionalImages.forEach(url => {
        if (!url.startsWith('http')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const onSubmit = async (data: ProductFormData) => {
    if (!data.image && !isEditMode) {
      showToast(toast, "Error", "Please add a main product image", "error");
      setActiveTab("images");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('countInStock', data.countInStock.toString());
      formData.append('category', data.category);
      formData.append('status', data.status);

      // Append main image if exists
      if (data.image) {
        formData.append('image', data.image);
      }

      // Append additional images if they exist
      if (data.images?.length) {
        data.images.forEach((file) => {
          formData.append('images', file);
        });
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent: any) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      if (isEditMode && id) {
        // Update existing product
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showToast(toast, "Success", "Product updated successfully", "success");
      } else {
        // Create new product
        await fetch('/api/products', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showToast(toast, "Success", "Product created successfully", "success");
      }
      
      // Clean up preview URLs
      Object.values(previewUrls).flat().forEach(url => {
        if (url && !url.startsWith('http')) {
          URL.revokeObjectURL(url);
        }
      });

      navigate("/admin/products");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      showToast(toast, "Error", errorMessage, "error");
      
      if (error instanceof Error && error.message.includes('image')) {
        setActiveTab("images");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Add all product details and at least one image. Additional images can be added later.
          </AlertDescription>
        </Alert>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="p-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive name for your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-6" />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed product description including features and specifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                className="pl-8"
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Set a competitive price</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Choose the best fitting category</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Main Product Image</h3>
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Dropzone
                                maxFiles={1}
                                onDrop={([file]) => {
                                  if (file) {
                                    onChange(file);
                                    const url = URL.createObjectURL(file);
                                    setPreviewUrls(prev => ({ ...prev, mainImage: url }));
                                  }
                                }}
                                value={value ? [value] : []}
                                onRemove={() => {
                                  onChange(undefined);
                                  if (previewUrls.mainImage) {
                                    URL.revokeObjectURL(previewUrls.mainImage);
                                    setPreviewUrls(prev => ({ ...prev, mainImage: undefined }));
                                  }
                                }}
                                progress={uploadProgress}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">Additional Images</h3>
                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Dropzone
                                maxFiles={5}
                                onDrop={(files) => {
                                  onChange(files);
                                  const urls = files.map(URL.createObjectURL);
                                  setPreviewUrls(prev => ({
                                    ...prev,
                                    additionalImages: urls
                                  }));
                                }}
                                value={value || []}
                                onRemove={(index) => {
                                  const newFiles = (value || []).filter((_, i) => i !== index);
                                  onChange(newFiles);
                                  if (previewUrls.additionalImages[index]) {
                                    URL.revokeObjectURL(previewUrls.additionalImages[index]);
                                    setPreviewUrls(prev => ({
                                      ...prev,
                                      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
                                    }));
                                  }
                                }}
                                progress={uploadProgress}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="countInStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Current available quantity. Set to 0 if out of stock.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Set whether this product is available for purchase
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  isEditMode ? "Update Product" : "Add Product"
                )}
              </Button>
            </div>   
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProductForm;
