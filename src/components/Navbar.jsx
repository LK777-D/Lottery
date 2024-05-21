"use client";
import { useBlockChainCtx } from "@/context/blockChainCtx";
import btc from "@/assets/bitcoin.svg";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  const { connnectToMetamask, accounts } = useBlockChainCtx();
  const abbreviatedAccounts =
    accounts && `${accounts.slice(0, 5)}...${accounts.slice(-5)}`;
  return (
    <nav className="h-[4rem] bg-violet-950/80 flex items-center justify-between px-20">
      <Link
        href={""}
        className=" tracking-widest font-extrabold flex gap-[1px] bg-violet-800 p-2  border-white border-[2px] rounded-sm"
      >
        <Image src={btc} alt="btc" width={25} />
        BChain Lottery
      </Link>
      {!accounts ? (
        <button
          className="font-extrabold bg-violet-900 p-2 rounded-md border transition duration-200 hover:bg-violet-800 "
          onClick={connnectToMetamask}
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
