import { supabase } from '@/lib/supabase'
import ProductCatalog from '@/app/components/ProductCatalog'

export default async function CatalogPage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price')
    .order('name')

  if (error) return <p className="text-red-500">Error al cargar productos.</p>

  return <ProductCatalog products={products ?? []} />
}
