import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

// Sample product data using the same structure as Wix products
const sampleProducts = {
  items: [
    {
      _id: '1',
      slug: 'product-1',
      name: 'Classic T-Shirt',
      price: { price: 29.99 },
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        },
        items: [
          {
            image: {
              url: ''
            }
          }
        ]
      },
      additionalInfoSections: [
        {
          title: 'shortDesc',
          description: 'Premium cotton t-shirt with classic fit'
        }
      ]
    },
    {
      _id: '2',
      slug: 'product-2',
      name: 'Digital Art Print',
      price: { price: 19.99 },
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        }
      },
      additionalInfoSections: [
        {
          title: 'shortDesc',
          description: 'High-resolution digital art print, instant download'
        }
      ]
    },
    {
        _id: '3',
        slug: 'product-3',
        name: 'Digital Art Print',
        price: { price: 19.99 },
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        },
        additionalInfoSections: [
          {
            title: 'shortDesc',
            description: 'High-resolution digital art print, instant download'
          }
        ]
      },
      {
        _id: '4',
        slug: 'product-4',
        name: 'Digital Art Print',
        price: { price: 19.99 },
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        },
        additionalInfoSections: [
          {
            title: 'shortDesc',
            description: 'High-resolution digital art print, instant download'
          }
        ]
      }
  ],
  currentPage: 0,
  hasNext: () => false,
  hasPrev: () => false
};

const PRODUCT_PER_PAGE = 8;

const ProductList = ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId?: string;
  limit?: number;
  searchParams?: any;
}) => {
  // Using sample data instead of Wix client
  const res = sampleProducts;

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {res.items.map((product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
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
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price?.price}</span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
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