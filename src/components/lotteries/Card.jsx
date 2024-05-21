import cup from "@/assets/cup.svg";
import eth from "@/assets/ethereum.svg";
import Image from "next/image";
import user from "@/assets/userr.svg";
import "./card.css";
import { ethers, formatEther } from "ethers";
import { useEffect } from "react";
const Card = ({
  enterPrice,
  currentPlayersNum,
  playersNumber,
  id,
  buyTicket,
  round,
  refundTicket,
  hasTicket,
  checkRefund,
}) => {
  const winAmount = Number(playersNumber) * Number(enterPrice);
  const fee = (winAmount * 10) / 100;
  const prizePool = winAmount - fee;
  const fromWei = (num) => ethers.formatEther(num);

  return (
    <div className="mt-5 mx-auto min-w-[90%] md:min-w-[18rem]     rounded-xl md:max-w-[18.1rem]">
      <div className="bg-purple-800 text-center  p-2 py-3 font-extrabold rounded-t-xl">
        <span className="flex items-center justify-center ">
          PRIZE POOL :{" "}
          <span className="ml-1  glow-text">
            {fromWei(prizePool.toString())}
          </span>{" "}
          <Image src={eth} alt="eth" />
        </span>
      </div>
      <div className="flex flex-col items-center p-6  font-extrabold">
        <Image src={cup} alt="cup" />
        <span className="flex flex-col items-center">
          <span className="flex  ">
            1 Winner : {fromWei(prizePool.toString())}{" "}
            <Image src={eth} alt="eth" />
          </span>
          <span>Round#{round.toString()}</span>
        </span>
      </div>
      <div className="bg-violet-800 text-center p-3">
        <span className="font-extrabold text-lg flex items-center justify-center ">
          <Image src={user} alt="user" width={20} className="mb-1 mr-1" />
          PLAYERS : {currentPlayersNum.toString()} / {playersNumber.toString()}
        </span>
      </div>
      <div className="bg-amber-500 transition duration-200 hover:bg-amber-600 rounded-b-xl p-3">
        {!hasTicket[id] && (
          <button
            onClick={() => buyTicket(id, enterPrice)}
            className=" transition duration-200 hover: text-purple-950 font-extrabold flex text-lg flex-col items-center mx-auto "
          >
            <span className="tracking-widest">BUY TICKET</span>
            <span className="tracking-widest flex">
              {fromWei(enterPrice.toString())} <Image src={eth} alt="eth" />
            </span>
          </button>
        )}
        {hasTicket[id] && (
          <button
            className=" tracking-wider transition p-3 text-center duration-200 hover: text-purple-950 font-extrabold flex text-lg"
            onClick={() => refundTicket(id)}
          >
            REFUND TICKET{" "}
            <span className="tracking-widest flex ml-3">
              {fromWei(enterPrice.toString())} <Image src={eth} alt="eth" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
