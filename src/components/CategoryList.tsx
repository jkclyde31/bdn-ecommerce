import { wixClientServer } from "../../lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();
  
  return (
    <div className="px-4 mx-auto max-w-[1420px]">
      <h2 className="text-gray-500 font-medium mb-4">CATEGORIES</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="block text-center"
            key={item._id}
          >
            <div className="relative bg-gray-50 w-full aspect-square sm:aspect-[3/4]">
              <Image
                src={item.media?.mainMedia?.image?.url || "/cat.png"}
                alt="text"
                fill
                sizes="(min-width: 1536px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h3 className="mt-2 sm:mt-8 text-sm sm:text-xl sm:font-light sm:tracking-wide text-center sm:text-left">
              {item.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;