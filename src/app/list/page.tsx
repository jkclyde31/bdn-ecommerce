import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import { wixClientServer } from "../../../lib/wixClientServer";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";

const ListPage = async ({ searchParams }: { searchParams: any }) => {
  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );

  const cats = await wixClient.collections.queryCollections().find();
  const categories = cats.items;
  const fallbackImage = "/cat.png";

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-green-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-primary text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/banner/inner-banner.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Browse Other Categories Heading */}
      <h2 className="mt-8 text-lg font-semibold text-gray-700 text-center sm:text-left">
        Browse Other Categories
      </h2>

      {/* Category FILTER - Horizontal Layout */}
      <div className="flex overflow-x-auto gap-4 mt-4 pb-4 no-scrollbar items-center ">
        {categories.slice(1).map((item, index) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="flex-shrink-0 bg-primary/80 rounded-2xl overflow-hidden"
            style={{ width: "120px" }}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={item.media?.mainMedia?.image?.url || fallbackImage}
                alt="Category Image"
                fill
                sizes="120px"
                className="object-cover"
                unoptimized={!item.media?.mainMedia?.image?.url}
              />
            </div>
            <div className="p-2 text-white text-center text-sm truncate">
              {item.name}
            </div>
          </Link>
        ))}
      </div>

      {/* PRODUCTS */}
      <h1 className="mt-12 text-xl font-semibold"><span className="text-primary font-bold text-xxl">{cat?.collection?.name}</span> For You!</h1>
      <Suspense fallback={<Skeleton />}>
        <ProductList
          categoryId={
            cat.collection?._id || "00000000-000000-000000-000000000001"
          }
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default ListPage;