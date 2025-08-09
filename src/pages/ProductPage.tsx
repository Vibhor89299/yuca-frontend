import  { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products } from '@/data/mockData';
import { useStore } from '@/store/useStore';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg luxury-shadow">
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-sage-600' : 'border-sage-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-sage-100 text-sage-800">{product.category}</Badge>
              {product.featured && (
                <Badge className="bg-luxury-600 text-white">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-serif font-bold luxury-text mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-luxury-600 fill-current'
                        : 'text-sage-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <p className="text-lg text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold luxury-text">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                by {product.brand}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-sage-200 rounded-md px-3 py-1 text-sm"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 luxury-button"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button variant="outline" size="lg" className="border-sage-200">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-sage-600" />
              <span>Quality Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-sage-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <RotateCcw className="h-4 w-4 text-sage-600" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-sage-50">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description} This carefully crafted piece represents our commitment to 
                  sustainable luxury, combining premium materials with environmentally conscious 
                  manufacturing processes. Each item is designed to bring natural beauty and 
                  sophisticated elegance to your space while supporting eco-friendly practices.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {product.tags.map((tag, index) => (
                      <li key={index}>• {tag.charAt(0).toUpperCase() + tag.slice(1)}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-sage-100">
                    <span className="font-medium">SKU</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-sage-100">
                    <span className="font-medium">Brand</span>
                    <span className="text-muted-foreground">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-sage-100">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-sage-100">
                    <span className="font-medium">In Stock</span>
                    <span className="text-muted-foreground">
                      {product.inStock ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Customer Reviews</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Reviews feature coming soon. This product has {product.reviewCount} reviews 
                    with an average rating of {product.rating} stars.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}