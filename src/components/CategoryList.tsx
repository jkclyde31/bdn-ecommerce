import { wixClientServer } from "../../lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();

  return (
    <div className="px-4 mx-auto max-w-[1420px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 md:gap-8">
        {cats.items.map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="block group"
            key={item._id}
          >
            <div className="relative bg-slate-100 w-full aspect-[3/4]">
              <Image
                src={item.media?.mainMedia?.image?.url || "/cat.png"}
                alt=""
                fill
                sizes="(min-width: 1536px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;