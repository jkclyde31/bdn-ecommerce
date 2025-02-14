import { wixClientServer } from "../../../lib/wixClientServer"

const page = async () => {
    const wixClient = await wixClientServer();
     const productQuery = wixClient.products.queryProducts()

     console.log(productQuery)
      
  return (
    <div>page</div>
  )
}

export default page