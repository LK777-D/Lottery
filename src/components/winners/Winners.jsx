"use client";
import { ethers } from "ethers";
import trophy from "@/assets/trophy.svg";
import user from "@/assets/userr.svg";
import { useBlockChainCtx } from "@/context/blockChainCtx";
import Image from "next/image";

const Winners = () => {
  const fromWei = (num) => ethers.formatEther(num);
  const { winners, getAllWinners } = useBlockChainCtx();

  const formatAddress = (address, slice) => {
    return `${address?.slice(0, slice)}...${address?.slice(-slice)}`;
  };
  return (
    <div className=" my-10 mt-20">
      <div className="border-[2px]  p-5 md:flex md:flex-col items-start  border-purple-900 md:max-w-[55rem] rounded-lg mx-auto">
        <div className="  flex flex-col  gap-1    mx-auto">
          <span className="bg-violet-800 mb-3 tracking-widest max-w-[11rem] font-extrabold text-center rounded-md p-2">
            Winners History
          </span>
          <h3 className="flex tracking-widest">
            Total Winners{""}
            {""}
            <Image src={trophy} alt="trophy" className="mx-1" width={15} /> :
            {winners.length}
          </h3>
          {winners.length > 0 ? (
            winners.map((winner) => (
              <div
                key={winner.id}
                className="flex md:px-4 md:max-w-[50rem] md:min-w-[50rem] md:mx-auto transition duration-300 py-2 hover:bg-purple-600 rounded-lg bg-purple-800 items-center text-md p-1 font-extrabold   justify-between px-1"
              >
                <div className="flex gap-3 ">
                  <span className="min-w-[55px] text-sm">
                    R-#{winner.lotteryWonRound.toString() - 1}
                  </span>
                  <div className="flex justify-center text-sm    bg-purple-950 items-center gap-2 min-w-[50px] rounded-md ">
                    <span className="">
                      <Image
                        src={user}
                        alt="user"
                        width={15}
                        className="mb-[2px]"
                      />
                    </span>
                    <span className="">{winner.lotteryWonId.toString()}</span>
                  </div>
                  <div className="flex justify-start pl-2 text-sm    bg-purple-950 items-center gap-2 min-w-[77px] rounded-md ">
                    <span>
                      <Image src={trophy} alt="trophy" width={15} />
                    </span>
                    <span>{fromWei(winner.amountWon)}</span>
                  </div>
                </div>
                <span className="bg-purple-950 md:hidden text-[0.85rem] min-w-[125px] text-center py-[0.05rem]  rounded-md">
                  {`${winner?.winnerAddress.slice(
                    0,
                    4
                  )}...${winner?.winnerAddress.slice(-4)}`}
                </span>
                <span className="bg-purple-950 hidden md:inline text-[0.85rem] min-w-[150px] text-center py-[0.05rem]  rounded-md">
                  {`${winner?.winnerAddress.slice(
                    0,
                    5
                  )}...${winner?.winnerAddress.slice(-5)}`}
                </span>
              </div>
            ))
          ) : (
            <h1>Winners Not Found</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Winners;
