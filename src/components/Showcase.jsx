import img from "@/assets/multi.webp";
import Image from "next/image";
const Showcase = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="py-20 flex md:text-[2rem] flex-col items-center font-extrabold tracking-widest">
        <p> SECURE, TRANSPARENT LOTTERY</p>
        <p>FOR BIG WINS!</p>
      </div>
      <Image src={img} alt="multichain" className="md:max-w-[50rem]" />
    </section>
  );
};

export default Showcase;
