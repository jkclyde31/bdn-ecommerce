import { wixClientServer } from "../../lib/wixClientServer";
import Image from "next/image";
import Link from "next/link";

const CategoryList = async () => {
  const wixClient = await wixClientServer();
  const cats = await wixClient.collections.queryCollections().find();
  
  // Skip the first category
  const categories = cats.items.slice(1);
  
  // Define a fallback image that's guaranteed to work
  const fallbackImage = "/cat.png";
  
  return (
    <div className="px-4 mx-auto max-w-[1420px]">
      <h2 className="text-gray-500 font-medium mb-[15px] md:mb-[20px] text-[20px] md:text-[25px]">CATEGORIES</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
        {/* Featured category (larger) */}
        <div className="col-span-2 md:row-span-2 bg-gray-900 rounded-2xl overflow-hidden">
          <Link href={`/list?cat=${categories[0].slug}`} className="block h-full">
            <div className="relative w-full h-full aspect-square md:aspect-auto md:h-full">
              <Image
                src={categories[0].media?.mainMedia?.image?.url || fallbackImage}
                alt="Category Image"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                unoptimized={!categories[0].media?.mainMedia?.image?.url}
              />
              <div className="absolute bottom-0 left-0 p-4 md:p-6 z-10">
                <h3 className="text-xl md:text-3xl font-medium text-white">
                  {categories[0].name}
                </h3>
                <div className="mt-1 md:mt-2 inline-block bg-primary/70 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                  <span className="text-white/90 text-xs md:text-sm">Explore collection</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Remaining categories in a 2x2 grid */}
        {categories.slice(1).map((item, index) => (
          <Link
            href={`/list?cat=${item.slug}`}
            key={item._id}
            className="block bg-gray-900 rounded-2xl overflow-hidden"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={item.media?.mainMedia?.image?.url || fallbackImage}
                alt="Category Image"
                fill
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                unoptimized={!item.media?.mainMedia?.image?.url}
              />
              <div className="absolute bottom-0 left-0 p-3 md:p-4 z-10">
                <h3 className="text-base md:text-xl font-medium text-white">
                  {item.name}
                </h3>
                <div className="mt-1 inline-block bg-primary/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-white/90 text-xs">Explore</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;


// import { wixClientServer } from "../../lib/wixClientServer";
// import Image from "next/image";
// import Link from "next/link";

// const CategoryList = async () => {
//   const wixClient = await wixClientServer();
//   const cats = await wixClient.collections.queryCollections().find();
  
//   return (
//     <div className="px-4 mx-auto max-w-[1420px]">
//       <h2 className="text-gray-500 font-medium mb-4 text-[25px]">CATEGORIES</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
//         {cats.items.map((item) => (
//           <Link
//             href={`/list?cat=${item.slug}`}
//             className="block text-center"
//             key={item._id}
//           >
//             <div className="relative bg-gray-50 w-full aspect-square sm:aspect-[3/4]">
//               <Image
//                 src={item.media?.mainMedia?.image?.url || "/cat.png"}
//                 alt="text"
//                 fill
//                 sizes="(min-width: 1536px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
//                 className="object-cover transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//             <h3 className="mt-2 sm:mt-8 text-sm sm:text-xl sm:font-light sm:tracking-wide text-center sm:text-left">
//               {item.name}
//             </h3>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryList;