import { wixClientServer } from "../../lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const ProductList = async ({
  categoryId,
  limit = 8,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer();

  const productQuery = wixClient.products
    .queryProducts()
    .startsWith("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * limit
        : 0
    );
  // .find();

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const res = await productQuery.find();

  return (
    <div className="mt-[15px] md:mt-[15px] md:flex md:gap-x-8 md:gap-y-16 md:justify-between md:flex-wrap">
      {/* Mobile view (grid) that switches to original desktop layout */}
      <div className="grid grid-cols-2 gap-2 md:hidden w-full">
        {res.items.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="flex flex-col border rounded-md overflow-hidden h-full"
            key={`mobile-${product._id}`}
          >
            <div className="relative w-full aspect-square">
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt={product.name || "Product"}
                fill
                sizes="50vw"
                className="absolute object-cover z-10 hover:opacity-0 transition-opacity duration-500"
              />
              {product.media?.items && product.media?.items.length > 1 && (
                <Image
                  src={product.media?.items[1]?.image?.url || "/product.png"}
                  alt={`${product.name} alternate view` || "Product alternate view"}
                  fill
                  sizes="50vw"
                  className="absolute object-cover"
                />
              )}
            </div>
            <div className="p-1 flex flex-col h-full">
              {/* Product name */}
              <div className="mb-0.5">
                <span className="font-medium text-xs leading-tight block">{product.name}</span>
              </div>
              
              {/* Price */}
              <span className="font-semibold text-xs block mb-1">₱{product.price?.price}</span>
              
              {/* Spacer to push button to bottom */}
              <div className="flex-grow"></div>
              
              {/* Button */}
              <button className="rounded-md bg-green-700 text-white w-full py-1 text-xs font-medium mt-1">
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop view (original design) */}
      {res.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="hidden md:flex w-full flex-col gap-[5px] md:gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between mt-[10px] md:mt-0 px-[10px] md:px-0">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">₱{product.price?.price}</span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500 flex-grow"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <div className="px-[5px] md:px-0 mt-auto">
            <button className="rounded-2xl ring-1 ring-green-700 text-green-700 w-max py-2 px-4 text-xs hover:bg-green-700 hover:text-white">
              Add to Cart
            </button>
          </div>
        </Link>
      ))}
      
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null}
    </div>
  );
};

export default ProductList;