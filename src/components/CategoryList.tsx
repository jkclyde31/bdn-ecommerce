import Image from "next/image";
import Link from "next/link";
// import { wixClientServer } from "@/lib/wixClientServer";

// Sample categories data matching Wix structure
const sampleCategories = {
  items: [
    {
      _id: '1',
      slug: 'mens-clothing',
      name: "Men's Clothing",
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        }
      }
    },
    {
      _id: '2',
      slug: 'womens-clothing',
      name: "Women's Clothing",
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        }
      }
    },
    {
      _id: '3',
      slug: 'accessories',
      name: 'Accessories',
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        }
      }
    },
    {
      _id: '4',
      slug: 'footwear',
      name: 'Footwear',
      media: {
        mainMedia: {
          image: {
            url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
          }
        }
      }
    },
    {
        _id: '4',
        slug: 'footwear',
        name: 'Footwear',
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        }
      },
      {
        _id: '4',
        slug: 'footwear',
        name: 'Footwear',
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        }
      },
      {
        _id: '4',
        slug: 'footwear',
        name: 'Footwear',
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        }
      },{
        _id: '4',
        slug: 'footwear',
        name: 'Footwear',
        media: {
          mainMedia: {
            image: {
              url: 'https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrgb&w=80%Clazy=load%22'
            }
          }
        }
      }
  ]
};

const CategoryList =  () => {
    const cats = sampleCategories;
  
    return (
      <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 md:gap-8" style={{ minWidth: `${cats.items.length * 250}px` }}>
          {cats.items.map((item) => (
            <Link
              href={`/list?cat=${item.slug}`}
              className="flex-shrink-0 w-64" // Fixed width for each item
              key={item._id}
            >
              <div className="relative bg-slate-100 w-full h-96">
                <Image
                  src={item.media?.mainMedia?.image?.url || "cat.png"}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
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