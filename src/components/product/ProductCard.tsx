"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  const inStock = product.inStock ?? (product.countInStock ? product.countInStock > 0 : true)
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
      console.error("Product ID is missing")
      setIsAdding(false)
      return
    }
    try {
      if (isAuthenticated) {
        // Authenticated: call backend API via Redux thunk
        await dispatch(addToCart({ productId, quantity: 1 }))
        setIsInCart(true)
      } else {
        // Guest: update Redux/localStorage
        dispatch(addGuestCartItem({ product, quantity: 1 }))
        setIsInCart(true)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const [imgIdx, setImgIdx] = useState(0)
  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  // Auto-rotate images every minute
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      console.log("Rotating image " + images[imgIdx])
      setImgIdx((idx) => (idx + 1) % images.length)
    }, 10000) // 10,000 ms = 10 seconds
    return () => clearInterval(interval)
  }, [images]) // Updated to use the entire images array as dependency

  return (
    <Card className={`group overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-md ${!inStock ? "opacity-90" : ""}`} aria-disabled={!inStock}>
      <Link
        to={getProductUrl()}
        className={`block ${!inStock ? "cursor-not-allowed" : ""}`}
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
            src={images[imgIdx] || "/placeholder.svg"}
            alt={product.name}
            className="h-64 w-full object-cover bg-white transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (!target.src.endsWith("/fallback.jpg")) {
                target.src = "/fallback.jpg"
              }
            }}
          />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 space-x-2 transform">
              {images.map((img, idx) => (
                <button
                  key={img}
                  className={`h-2 w-2 rounded-full border border-muted-foreground/50 ${imgIdx === idx ? "bg-primary" : "bg-muted-foreground/70"}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setImgIdx(idx)
                  }}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {product.featured && (
            <Badge className="absolute left-3 top-3 shadow-lg bg-input text-foreground">Featured</Badge>
          )}
          {!inStock && (
            <>
              <Badge className="absolute left-3 top-3 shadow-lg bg-red-600 text-white">Out of Stock</Badge>
              <div className="pointer-events-none absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-sm font-semibold text-red-700 bg-white/80 px-3 py-1 rounded">Out of Stock</span>
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

        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="text-xs bg-input text-muted-foreground">
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

            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {toStartCase(product.name)}
            </h3>

            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="flex items-end justify-between pt-3">
              <div className="space-y-1">
                {(() => {
                  const current = product.price
                  const mrp = Math.round(current / 0.9)
                  return (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl text-foreground">₹{current.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs line-through">₹{mrp.toFixed(2)}</span>
                        <span className="text-[11px] rounded-full px-2 py-0.5 bg-autumnFern/15 text-autumnFern font-medium whitespace-nowrap">
                          10% OFF
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
                className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
                type="button"
                disabled={!inStock || isAdding || isInCart}
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                {isInCart ? "Added" : isAdding ? "Adding..." : inStock ? "Add" : "Sold Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
