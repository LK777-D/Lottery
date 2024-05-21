"use client";
import { useEffect } from "react";
import Card from "./Card";
import { useBlockChainCtx } from "@/context/blockChainCtx";
const Lotteries = () => {
  const {
    getLotteries,
    lotteries,
    buyTicket,
    refundTicket,
    hasTicket,
    checkRefund,
  } = useBlockChainCtx();
  useEffect(() => {
    lotteries.forEach((lottery) => {
      checkRefund(lottery.id);
    });
  }, [lotteries]);

  const duelRaffle = lotteries.filter((lottery) => lottery.playersNumber == 2);
  const multiRaffle = lotteries.filter((lottery) => lottery.playersNumber > 2);

  return (
    <>
      <div className="w-full h-[2px] bg-purple-700"></div>
      <h1 className="tracking-widest font-extrabold text-center text-[2.5rem] md:text-[3.5rem] mt-20">
        Raffles
      </h1>
      <section className="mt-14">
        <h1 className="text-center text-[2rem] font-extrabold tracking-widest">
          Duels
        </h1>
        <section className="px-20 p-5  flex flex-col items-center justify-center gap-10 md:gap-0 lottgrid max-w-[75rem] mx-auto   ">
          {duelRaffle?.map((lottery, index) => (
            <Card
              key={index}
              enterPrice={lottery.enterPrice}
              currentPlayersNum={lottery.currentPlayersNum}
              playersNumber={lottery.playersNumber}
              buyTicket={buyTicket}
              id={lottery.id}
              round={lottery.round}
              refundTicket={refundTicket}
              hasTicket={hasTicket}
              checkRefund={checkRefund}
            />
          ))}
        </section>
      </section>
      <section className="mt-14">
        <h1 className="text-center text-[2rem] font-extrabold tracking-widest">
          Multiplayer
        </h1>
        <section className="px-20 p-5  flex flex-col items-center justify-center gap-10 md:gap-0 lottgrid max-w-[75rem] mx-auto   ">
          {multiRaffle?.map((lottery, index) => (
            <Card
              key={index}
              enterPrice={lottery.enterPrice}
              currentPlayersNum={lottery.currentPlayersNum}
              playersNumber={lottery.playersNumber}
              buyTicket={buyTicket}
              id={lottery.id}
              round={lottery.round}
              refundTicket={refundTicket}
              hasTicket={hasTicket}
              checkRefund={checkRefund}
            />
          ))}
        </section>
      </section>
    </>
  );
};

export default Lotteries;
