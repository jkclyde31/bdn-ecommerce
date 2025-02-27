"use client";

import { useRouter } from "next/navigation";

const ViewProducts = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/list");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-primary lg:bg-white hover:bg-green-600 lg:hover:bg-slate-300 text-white lg:text-primary border border-primary px-6 py-2  transition-colors duration-200 font-medium"
    >
      View Products
    </button>
  );
};

export default ViewProducts;





// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const SearchBar = () => {

//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name") as string;

//     if(name){
//       router.push(`/list?name=${name}`)
//     }
//   };

//   return (
//     <form
//       className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
//       onSubmit={handleSearch}
//     >
//       <input
//         type="text"
//         name="name"
//         placeholder="Search"
//         className="flex-1 bg-transparent outline-none"
//       />
//       <button className="cursor-pointer">
//         <Image src="/search.png" alt="" width={16} height={16} />
//       </button>
//     </form>
//   );
// };

// export default SearchBar;