"use client";
import { useBlockChainCtx } from "@/context/blockChainCtx";
import { ethers } from "ethers";
const AddLottery = () => {
  const toWei = (num) => ethers.parseEther(num.toString());
  console.log(toWei(0.015));
  const { addLottery, setEnterPrice, setPlayersNum } = useBlockChainCtx();
  return (
    <main className="flex flex-col items-start gap-1  text-black">
      <input
        type="number"
        placeholder="enterprice"
        onChange={(e) => setEnterPrice(toWei(e.target.value))}
      />
      <input
        type="number"
        placeholder="playersnumber"
        onChange={(e) => setPlayersNum(e.target.value)}
      />
      <button onClick={addLottery}>ADD</button>
    </main>
  );
};

export default AddLottery;
