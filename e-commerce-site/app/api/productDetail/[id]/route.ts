import {prodDetails} from "../../../testData/productDetails"

type Props = {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: Request, {params}: Props) {
    const {id} = await params
    const product = prodDetails.find((product) => product.id === Number(id))
    if(!product) {
       return Response.json(
            {
                error: "Product Not Found"
            },
            {
                status: 404
            }
        )
    }
    return Response.json(product)
}