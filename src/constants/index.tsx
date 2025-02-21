import { StaticImageData } from 'next/image';
import { facebook, instagram, shieldTick, support, truckFast, twitter } from "../../public/assets/icons";
import { 
  bigShoe1, bigShoe2, bigShoe3, customer1, customer2, 
  shoe4, shoe5, shoe6, shoe7, thumbnailShoe1, thumbnailShoe2, thumbnailShoe3,
  gloves1, gloves2, gloves3, gloves4, w_gloves, 
  everlast_1, everlast_2, everlast_3, 
  e1, e2, e3, item1, item2, box_shoes 
} from "../../public/assets/images";

// Interface definitions
interface NavLink {
  href: string;
  label: string;
}

interface ShoeImage {
  thumbnail: StaticImageData;
  bigShoe: StaticImageData;
}

interface Statistic {
  value: string;
  label: string;
}

interface Product {
  imgURL: StaticImageData;
  name: string;
  price: string;
  rating: number;
}

interface Service {
  imgURL: StaticImageData;
  label: string;
  subtext: string;
}

interface Review {
  imgURL: StaticImageData;
  customerName: string;
  rating: number;
  feedback: string;
}

interface FooterLink {
  name: string;
  link: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialMedia {
  src: StaticImageData;
  alt: string;
}

// Exported constants with type annotations
export const navLinks: NavLink[] = [
  { href: "#home", label: "Home" },
  { href: "#about-us", label: "About Us" },
  { href: "#products", label: "Products" },
  { href: "#contact-us", label: "Contact Us" },
];

export const shoes: ShoeImage[] = [
  {
    thumbnail: e1,
    bigShoe: e1,
  },
  {
    thumbnail: e2,
    bigShoe: e2,
  },
  {
    thumbnail: e3,
    bigShoe: e3,
  },
];

export const statistics: Statistic[] = [
  { value: '1k+', label: 'Brands' },
  { value: '500+', label: 'Shops' },
  { value: '250k+', label: 'Customers' },
];

export const products: Product[] = [
  {
    imgURL: everlast_1,
    name: "EverGloves Red",
    price: "$200.20",
    rating: 4.7
  },
  {
    imgURL: item1,
    name: "EverStrike Gloves",
    price: "₱1,979.00",
    rating: 4.4
  },
  {
    imgURL: item2,
    name: "Core Headgear",
    price: "₱2,055.00",
    rating: 5.0
  },
  {
    imgURL: box_shoes,
    name: "Boxing Shoes",
    price: "₱2,930.00",
    rating: 4.8
  },
];

export const services: Service[] = [
  {
    imgURL: truckFast,
    label: "Free shipping",
    subtext: "Enjoy seamless shopping with our complimentary shipping service."
  },
  {
    imgURL: shieldTick,
    label: "Secure Payment",
    subtext: "Experience worry-free transactions with our secure payment options."
  },
  {
    imgURL: support,
    label: "Love to help you",
    subtext: "Our dedicated team is here to assist you every step of the way."
  },
];

export const reviews: Review[] = [
  {
    imgURL: customer1,
    customerName: 'Morich Brown',
    rating: 4.5,
    feedback: "The attention to detail and the quality of the product exceeded my expectations. Highly recommended!"
  },
  {
    imgURL: customer2,
    customerName: 'Lota Mongeskar',
    rating: 4.5,
    feedback: "The product not only met but exceeded my expectations. I'll definitely be a returning customer!"
  }
];

export const footerLinks: FooterSection[] = [
  {
    title: "Products",
    links: [
      { name: "Boxing Shoes", link: "/" },
      { name: "Boxing Gloves", link: "/" },
      { name: "Sports Shoes", link: "/" },
      { name: "Headgear", link: "/" },
      { name: "Sports Attire", link: "/" },
      { name: "Sports Equipment", link: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "About us", link: "/" },
      { name: "FAQs", link: "/" },
      { name: "How it works", link: "/" },
      { name: "Privacy policy", link: "/" },
      { name: "Payment policy", link: "/" },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { name: "customer@clydesports.com", link: "mailto:customer@clydesports.com" },
      { name: "09185031231", link: "tel:+92554862354" },
    ],
  },
];

export const socialMedia: SocialMedia[] = [
  { src: facebook, alt: "facebook logo" },
  { src: twitter, alt: "twitter logo" },
  { src: instagram, alt: "instagram logo" },
];