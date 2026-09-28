
export default function Form() {
  return (
    <form className="py-20 px-20 flex flex-col items-start gap-5">
        <label htmlFor="prodName">Product Name: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="text" name="prodName" id="prodName" placeholder="Product Name" />
        <label htmlFor="prodDes">Product Description: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="text" name="prodDes" id="prodDes" placeholder="Product Description" />
        <label htmlFor="prodPrice">Product Price: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="number" name="prodPrice" id="prodPrice" placeholder="Product Price" />
        <label htmlFor="prodStocl">No of Items in Stock: </label>
        <input className="border py-2 px-2 text-base rounded-md" type="number" name="prodStock" id="prodStock" placeholder="10" />
    </form>
  )
}
