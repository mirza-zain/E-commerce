'use client'

import React, { useState } from "react";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import {CldUploadWidget} from "next-cloudinary"
import Image from "next/image";

type Products = {
  id: number,
  name: string,
  description: string,
  category: string,
  price: number,
  stock: number,
  image: string | null
  variants?: ProductVariant[]
}

type ProductVariant = {
  label: string
  price: number
  stock: number
}

type FormProps = {
  product?: Products,
  onProductSaved?: (product: Products) => void
}

export default function Form({ product, onProductSaved }: FormProps) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    image: product?.image ?? "",
    variants: product?.variants ?? []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleData(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setServerError("");
    setSuccessMessage("");
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    });
  }

  function updateVariant(index: number, field: keyof ProductVariant, value: string) {
    setServerError("");
    setSuccessMessage("");
    setFormData((currentData) => ({
      ...currentData,
      variants: currentData.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, [field]: field === "label" ? value : Number(value) }
          : variant
      )
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!formData.name.trim()) return setServerError("Product name is required.");
    if (!formData.description.trim()) return setServerError("Product description is required.");
    if (!formData.category) return setServerError("Please select a category.");
    if (formData.variants.length === 0 && formData.price <= 0) return setServerError("Price must be greater than 0.");
    if (formData.variants.length === 0 && formData.stock < 0) return setServerError("Stock cannot be negative.");
    if (formData.variants.some((variant) => !variant.label.trim() || variant.price <= 0 || variant.stock < 0)) {
      return setServerError("Each variation needs a label, a price greater than 0, and non-negative stock.");
    }
    if (new Set(formData.variants.map((variant) => variant.label.trim().toLowerCase())).size !== formData.variants.length) {
      return setServerError("Variation labels must be unique.");
    }

    try {
      setIsSubmitting(true);
      const url = isEditing
        ? `/api/productDetail/${product.id}`
        : "/api/product";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update product." : "Failed to create product.");
      }

      const data = await response.json();
      const saved = Array.isArray(data) ? data[0] : data;

      setSuccessMessage(isEditing ? "Product updated successfully!" : "Product created successfully!");

      if (!isEditing) {
        // Reset form for next entry
        setFormData({
          name: "",
          description: "",
          category: "",
          price: 0,
          stock: 0,
          image: "",
          variants: []
        });
      }

      if (onProductSaved && saved) {
        onProductSaved(saved);
      }
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8">
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
          <WarningCircleIcon className="size-5 shrink-0 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-3">
          <CheckCircleIcon className="size-5 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label htmlFor="prodName" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
              Product Name
            </label>
            <input
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
              type="text"
              name="name"
              id="prodName"
              placeholder="e.g. La Rose Divine"
              value={formData.name}
              onChange={handleData}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="prodCategory" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              id="prodCategory"
              name="category"
              value={formData.category}
              onChange={handleData}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
            >
              <option value="">Select Category</option>
              <option value="mens">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${formData.variants.length === 0 ? "sm:grid-cols-2" : ""} gap-6`}>
          {/* Price is only used for products without size variations. */}
          {formData.variants.length === 0 && (
            <div>
              <label htmlFor="prodPrice" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                Price (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-medium">
                  Rs.
                </span>
                <input
                  className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
                  type="number"
                  name="price"
                  id="prodPrice"
                  placeholder="2500"
                  value={formData.price === 0 ? "" : formData.price}
                  onChange={handleData}
                />
              </div>
            </div>
          )}

          {/* Legacy stock is only used for products without size variations. */}
          {formData.variants.length === 0 && <div>
            <label htmlFor="prodStock" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
              Stock Quantity
            </label>
            <input
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
              type="number"
              name="stock"
              id="prodStock"
              placeholder="10"
              value={formData.stock === 0 ? "" : formData.stock}
              onChange={handleData}
            />
          </div>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="prodDes" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition resize-none"
            name="description"
            id="prodDes"
            rows={3}
            placeholder="Describe scent notes, projection, and occasion..."
            value={formData.description}
            onChange={handleData}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Size Variations
              </label>
              <p className="mt-1 text-xs text-neutral-500">Optional. Add sizes such as 20 ml and 50 ml with their own price and stock.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((currentData) => ({
                ...currentData,
                variants: [...currentData.variants, { label: "", price: 0, stock: 0 }]
              }))}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:border-black"
            >
              Add Size
            </button>
          </div>
          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">Label</label>
                  <input
                    type="text"
                    placeholder="20 ml"
                    value={variant.label}
                    onChange={(event) => updateVariant(index, "label", event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.price || ""}
                    onChange={(event) => updateVariant(index, "price", event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock || ""}
                    onChange={(event) => updateVariant(index, "stock", event.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((currentData) => ({
                    ...currentData,
                    variants: currentData.variants.filter((_, variantIndex) => variantIndex !== index)
                  }))}
                  className="mb-1 px-2 py-2 text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {formData.variants.length > 0 && (
            <p className="mt-3 text-xs text-neutral-500">
              Price and stock are managed per size above.
            </p>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label htmlFor="image" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
            Product Image
          </label>

          <CldUploadWidget
            uploadPreset="zarb_official"
            onSuccess={(result) => {
              if(typeof result.info !== "string" && result.info) {
                const imageUrl = result.info.secure_url

                setFormData((currentData) => ({
                  ...currentData,
                  image: imageUrl
                }))
              }
            }}
          >
            {({ open }) => {
              return (
                <>
                  <button
                    type="button"
                    onClick={() => open()}
                    className="px-4 py-3 border border-neutral-200 rounded-xl"
                  >
                    Upload Image
                  </button>
                  {
                    formData.image && (
                      <div className="mt-4">
                        <Image
                          src={formData.image}
                          alt={formData.name}
                          width={300}
                          height={300}
                          className="rounded-xl object-cover"
                        />
                      </div>
                    )
                  }
                </>
              )
            }}
          </CldUploadWidget>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold uppercase tracking-wider rounded-xl transition active:scale-[0.99] flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <span>{isEditing ? "Update Product" : "Create Product"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
