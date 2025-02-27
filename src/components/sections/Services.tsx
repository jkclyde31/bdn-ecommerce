import { StaticImageData } from 'next/image';
import { services } from "@/constants";
import ServiceCard from "../ServiceCard";

type Service = {
  imgURL: StaticImageData;
  label: string;
  subtext: string;
}

const Services: React.FC = () => {
  return (
    <section className='max-container flex justify-center flex-wrap gap-9 px-[15px]'>
      {services.map((service: Service) => (
        <ServiceCard key={service.label} {...service} />
      ))}
    </section>
  );
};

export default Services;