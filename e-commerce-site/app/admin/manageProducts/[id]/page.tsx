import Form from "../../(component)/Form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/app/lib/db";
import { products } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const prodId = Number(id);

  if (Number.isNaN(prodId)) {
    notFound();
  }

  let product = null;

  try {
    const result = await db.select().from(products).where(eq(products.id, prodId));
    if (result.length > 0) {
      const item = result[0];
      product = {
        ...item,
        price: Number(item.price),
        stock: Number(item.stock),
      };
    }
  } catch (err) {
    console.error("Database query error:", err);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link 
          href="/admin/manageProducts" 
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Edit Product: {product.name}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update scent notes, category classification, pricing, and live inventory.
        </p>
      </div>

      {/* Form Card */}
      <Form product={product} />
    </div>
  );
}
