import ProductDetails from "./ProductDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  return <ProductDetails id={id} />;
}