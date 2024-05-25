"use client";
import { useBlockChainCtx } from "@/context/blockChainCtx";
import btc from "@/assets/bitcoin.svg";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  const { connectToMetamask, accounts } = useBlockChainCtx();
  const abbreviatedAccounts =
    accounts && `${accounts.slice(0, 5)}...${accounts.slice(-5)}`;
  return (
    <nav className="flex items-center justify-between py-3 px-5 ">
      <Link
        href={""}
        className="bg-violet-900 tracking-widest font-extrabold gap-1 flex items-center p-2 rounded-md border-white border"
      >
        <Image src={btc} alt="btc" width={25} className="object-cover" />
        Lotter
      </Link>
      {!accounts ? (
        <button
          className="font-extrabold bg-violet-900 p-2 rounded-md border transition duration-200 hover:bg-violet-800 "
          onClick={connectToMetamask}
        >
          Connect Wallet
        </button>
      ) : (
        <span className="font-extrabold bg-violet-900 p-2 rounded-md border transition duration-200 hover:bg-violet-800 ">
          {abbreviatedAccounts}
        </span>
      )}
    </nav>
  );
};

export default Navbar;
