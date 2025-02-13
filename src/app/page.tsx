
import ProductList from "@/components/ProductList"
import Slider from "@/components/Slider"
import CategoryList from "@/components/CategoryList"
import { Suspense } from "react"
import { WixClientContext } from "@/context/wixContext"
import { wixClientServer } from "../../lib/wixClientServer"

const HomePage =  () => {

  // const wixClient = useContext(WixClientContext)

  // useEffect(()=>{
  //   const getProducts = async () =>{
  //     const res = await wixClient.products.queryProducts().find();
  //     console.log("RESULTS: ", res)
  //   }
  //   getProducts();
  
  // }, [wixClient])

  // const wixClient = await wixClientServer();
  // const res =  await wixClient.products.queryProducts().find();
  // console.log("Result", res)


  return (
    <div className=''>
      <Slider/>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-xl">Featured Products</h1>
        <Suspense fallback={"Loading..."}>
           <ProductList categoryId="4cf9beca-f03b-09fa-d929-c10465cfee57" limit={4}/>
        </Suspense>
      </div>

      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">
          Categories
        </h1>
          <CategoryList />
      </div>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-xl">New Products</h1>
        {/* <ProductList /> */}
      </div>

     
    </div>
  )
}

export default HomePage