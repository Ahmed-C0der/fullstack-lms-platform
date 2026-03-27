import Link from "next/link"
import Image from "next/image"
import { Eye, Heart, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  rating: number
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 border-border/60 bg-card">
      {/* Floating Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {product.isNew && (
          <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            New
          </Badge>
        )}
        {product.isOnSale && (
          <Badge variant="destructive" className="shadow-sm">
            Sale
          </Badge>
        )}
      </div>

      {/* Floating Wishlist Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-3 right-3 z-20 h-8 w-8 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hover:text-red-500 shadow-sm"
      >
        <Heart className="h-4 w-4" />
        <span className="sr-only">Add to wishlist</span>
      </Button>

      {/* Image Container with Overlay */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Quick View / Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full flex-col gap-2 p-4 transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-background/90 to-transparent pt-12">
            <Button size="sm" className="w-full gap-2 shadow-lg hover:scale-105 transition-transform">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-medium text-foreground">{product.rating}</span>
            </div>
        </div>

        <Link href={`#product-${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="line-clamp-1 font-semibold text-lg">{product.name}</h3>
        </Link>
        
        <p className="line-clamp-2 text-sm text-muted-foreground min-h-[2.5em]">
          {product.description}
        </p>
        
        <div className="flex items-baseline gap-2 pt-2">
            {product.isOnSale && product.salePrice ? (
                <>
                    <span className="text-xl font-bold text-primary">
                    ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                    ${product.price.toFixed(2)}
                    </span>
                </>
            ) : (
                <span className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
                </span>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
