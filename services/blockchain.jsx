"use client";
import { useGlobalCtx } from "@/context/blockChainCtx";
const connnectToMetamask = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
};
