import {notFound} from "next/navigation"
import ProductDetails from "./ProductDetails"
import {prodDetails} from "@/app/testData/productDetails"

type Props = {
  params: {
    id: string
  }
}

export default async function UserPage({params}: Props){
  const {id} = await params
  const items = prodDetails.find((prod) => prod.id === Number(id))

  if(!items) notFound()
  
  return (
    <ProductDetails id={id} />
  )
}