import Form from "../../(component)/Form";


type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function page({params}: Props) {
    const {id} = await params
    const response = await fetch (`http://localhost:3000/api/productDetail/${id}`)
    if(!response.ok) throw new Error("Product not found")
    const data = await response.json()
console.log(data)
  return (
    <div>
      <Form product={data[0]} />
    </div>
  )
}
