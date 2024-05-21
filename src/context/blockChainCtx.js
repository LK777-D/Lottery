"use client";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/Lottery.sol/Lottery.json";
import { useContext, createContext, useState, useEffect } from "react";
const toWei = (num) => ethers.parseEther(num.toString());
const blockChainContext = createContext(null);
const BlockChainCtxProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(null);
  const [enterPrice, setEnterPrice] = useState(null);
  const [playersNum, setPlayersNum] = useState(null);
  const [hasTicket, setHasTicket] = useState({});
  const [lotteries, setLotteries] = useState([]);
  const [winners, setWinners] = useState([]);
  const test = 5;
  const connnectToMetamask = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccounts(accounts[0]);
  };
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== accounts) {
      setAccounts(accounts[0]);
    }
  };
  const getEthereumContract = async () => {
    if (window.ethereum != "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const LotteryContract = new ethers.Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi.abi,
        signer
      );
      return LotteryContract;
    } else {
      alert("Please install metamask or any other wallet");
    }
  };
  const addLottery = async () => {
    const LotteryContract = await getEthereumContract();
    if (LotteryContract) {
      try {
        const tx = await LotteryContract.createLottery(playersNum, enterPrice);
        await tx.wait();
        console.log("Transaction successful");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getLotteries = async () => {
    const LotteryContract = await getEthereumContract();

    if (LotteryContract) {
      try {
        const lotteries = await LotteryContract.getLotteries();
        console.log(lotteries);
        setLotteries(lotteries);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getAllWinners = async () => {
    const LotteryContract = await getEthereumContract();
    if (LotteryContract) {
      try {
        const winners = await LotteryContract.getAllWinnersInfo();

        setWinners(winners);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const refundTicket = async (id) => {
    const LotteryContract = await getEthereumContract();
    if (LotteryContract) {
      try {
        const tx = await LotteryContract.refundTicket(id);
        await tx.wait();
        console.log("refund succefull");
        getLotteries();
        setHasTicket((prev) => ({ ...prev, [id]: false }));
      } catch (error) {
        console.error(error);
      }
    }
  };
  const buyTicket = async (id, price) => {
    const LotteryContract = await getEthereumContract();
    const ticketPurchasedAmount = await LotteryContract.amountTicketsBought(
      id,
      accounts
    );
    if (LotteryContract) {
      try {
        const tx = await LotteryContract.buyTicket(id, {
          value: ethers.parseUnits(price.toString(), "wei"),
        });
        await tx.wait();
        console.log("ticket bought succesfully");
        if (ticketPurchasedAmount > 0)
          setHasTicket((prev) => ({ ...prev, [id]: true }));
        getLotteries();
        getAllWinners();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const checkRefund = async (id) => {
    const LotteryContract = await getEthereumContract();
    const ticketPurchasedAmount = await LotteryContract.amountTicketsBought(
      id,
      accounts
    );
    if (ticketPurchasedAmount > 0) {
      setHasTicket((prev) => ({ ...prev, [id]: true }));
    }
  };
  useEffect(() => {
    connnectToMetamask();
    getLotteries();
    getAllWinners();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);
  const ctxValue = {
    accounts,
    connnectToMetamask,
    test,
    lotteries,
    getLotteries,
    buyTicket,
    enterPrice,
    setEnterPrice,
    playersNum,
    setPlayersNum,
    addLottery,
    getAllWinners,
    winners,
    refundTicket,
    hasTicket,
    checkRefund,
  };

  return (
    <blockChainContext.Provider value={ctxValue}>
      {children}
    </blockChainContext.Provider>
  );
};

export default BlockChainCtxProvider;

export const useBlockChainCtx = () => {
  const ctx = useContext(blockChainContext);
  if (!ctx) {
    throw new Error("ctx provider error");
  }
  return ctx;
};
