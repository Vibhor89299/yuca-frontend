"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
// Utility to convert a string to start case
function toStartCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/types"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart, addGuestCartItem } from "@/store/slices/cartSlice"
import { cartToasts } from "@/lib/toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  // const { addToCart: addToCartLegacy } = useStore();
  // const { category, subcategory } = useParams();

  // Handle backwards compatibility between old and new schema
  const productId = product._id || product.id
  const inStock = product.inStock ?? (product.countInStock !== undefined ? product.countInStock > 0 : true)
  const [isInCart, setIsInCart] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)

  // Build the product URL
  const getProductUrl = () => {
    if (!productId) return "#"
    return `/product/${productId}`
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding || isInCart) return
    setIsAdding(true)
    const productId = product._id || product.id
    if (!productId) {
      cartToasts.error("Product ID is missing")
      setIsAdding(false)
      return
    }
    try {
      if (isAuthenticated) {
        // Authenticated: call backend API via Redux thunk
        await dispatch(addToCart({ productId, quantity: 1 }))
        setIsInCart(true)
        cartToasts.added(product.name)
      } else {
        // Guest: update Redux/localStorage
        dispatch(addGuestCartItem({ product, quantity: 1 }))
        setIsInCart(true)
        cartToasts.added(product.name)
      }
    } catch {
      cartToasts.error("Failed to add item to cart")
    } finally {
      setIsAdding(false)
    }
  }

  // Use product.image as primary display image
  const displayImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg")

  return (
    <Card 
      className={`group overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-500 ${
        inStock 
          ? 'hover:-translate-y-2 hover:shadow-md' 
          : 'opacity-75 cursor-not-allowed'
      }`} 
      aria-disabled={!inStock}
    >
      <Link
        to={getProductUrl()}
        className={`block ${!inStock ? "pointer-events-none" : ""}`}
        onClick={(e) => {
          if (!inStock) {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        aria-disabled={!inStock}
      >
        <div className="relative overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            className={`h-64 w-full object-cover bg-white transition-all duration-700 ${
              inStock 
                ? 'group-hover:scale-110' 
                : 'grayscale opacity-60'
            }`}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (!target.src.endsWith("/fallback.jpg")) {
                target.src = "/fallback.jpg"
              }
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent transition-opacity duration-300 ${
            inStock ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
          }`} />
          
          {product.featured && inStock && (
            <Badge className="absolute left-3 top-3 shadow-lg bg-input text-foreground">Featured</Badge>
          )}
          
          {!inStock && (
            <>
              {/* Out of Stock Badge */}
              <Badge className="absolute left-3 top-3 shadow-lg bg-red-600 text-white border-0 z-10">
                Out of Stock
              </Badge>
              
              {/* Overlay with Out of Stock Message */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[5]">
                <div className="text-center space-y-2">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-lg shadow-xl border-2 border-red-500">
                    <p className="text-lg font-bold text-red-600 uppercase tracking-wider">
                      Out of Stock
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Currently Unavailable
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 top-3 translate-y-2 border border-border bg-white/90 shadow-lg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white"
          >
            <Heart className="h-4 w-4 text-foreground" />
          </Button> */}
          {/* <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="w-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
              disabled={!inStock}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {inStock ? "Quick Add" : "Out of Stock"}
            </Button>
          </div> */}
        </div>

        <CardContent className={`p-6 ${!inStock ? 'opacity-60' : ''}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="default" className={`text-xs ${
                inStock 
                  ? 'bg-input text-muted-foreground' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {product.category}
              </Badge>
              <div className="flex items-center">
                {/* {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'text-autumnFern fill-current'
                        : 'text-khakiMoss'
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({reviewCount})
                </span> */}
              </div>
            </div>

            <h3 className={`font-serif text-lg font-semibold leading-tight transition-colors ${
              inStock 
                ? 'text-foreground group-hover:text-primary' 
                : 'text-gray-500'
            }`}>
              {toStartCase(product.name)}
            </h3>

            <p className={`line-clamp-2 text-sm leading-relaxed ${
              inStock ? 'text-muted-foreground' : 'text-gray-400'
            }`}>
              {product.description}
            </p>

            <div className="flex items-end justify-between pt-3">
              <div className="space-y-1">
                {(() => {
                  const current = product.retailPrice
                  const mrp = product.mrp
                  return (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className={`font-bold text-xl ${
                          inStock ? 'text-foreground' : 'text-gray-400'
                        }`}>
                          ₹{current.toFixed(2)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${
                        inStock ? 'text-muted-foreground' : 'text-gray-400'
                      }`}>
                        <span className="text-xs line-through">₹{mrp.toFixed(2)}</span>
                        <span className={`text-[11px] rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${
                          inStock
                            ? 'bg-autumnFern/15 text-autumnFern'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          MRP
                        </span>
                      </div>
                    </>
                  )
                })()}
                {/* <p className="text-xs text-muted-foreground">
                  by {productBrand}
                </p> */}
              </div>

              <Button
                onClick={handleAddToCart}
                className={`shadow-md ${
                  inStock 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                }`}
                size="sm"
                type="button"
                disabled={!inStock || isAdding || isInCart}
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                {!inStock ? "Sold Out" : isInCart ? "Added" : isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
