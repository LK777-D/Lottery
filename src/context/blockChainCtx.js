"use client";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/Lottery.sol/Lottery.json";
import { createContext, useState, useEffect, useContext } from "react";

const toWei = (num) => ethers.parseEther(num.toString());
const blockChainContext = createContext(null);

const BlockChainCtxProvider = ({ children }) => {
  const [accounts, setAccounts] = useState(null);
  const [enterPrice, setEnterPrice] = useState(null);
  const [playersNum, setPlayersNum] = useState(null);
  const [hasTicket, setHasTicket] = useState({});
  const [lotteries, setLotteries] = useState([]);
  const [winners, setWinners] = useState([]);

  const connectToMetamask = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts[0]);
      } else if (window.ethereum && window.ethereum.isMobile) {
        // Use deep link for MetaMask mobile app
        window.location.href = "https://metamask.app.link/dapp/YOUR_DAPP_URL";
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("User rejected the request", error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else {
      setAccounts(accounts[0]);
    }
  };

  const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (accounts) {
      const signer = await provider.getSigner();
      return new ethers.Contract(
        "0xc04f53104c317CDF463c1780207037AD3C6007d7",
        abi.abi,
        signer
      );
    } else {
      return new ethers.Contract(
        "0xc04f53104c317CDF463c1780207037AD3C6007d7",
        abi.abi,
        provider
      );
    }
  };

  const addLottery = async () => {
    const LotteryContract = await getEthereumContract(true);
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
    const LotteryContract = await getEthereumContract(true);
    if (LotteryContract) {
      try {
        const tx = await LotteryContract.refundTicket(id);
        await tx.wait();
        console.log("Refund successful");
        getLotteries();
        setHasTicket((prev) => ({ ...prev, [id]: false }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const buyTicket = async (id, price) => {
    const LotteryContract = await getEthereumContract(true);
    if (LotteryContract) {
      try {
        const tx = await LotteryContract.buyTicket(id, {
          value: ethers.parseUnits(price.toString(), "wei"),
        });
        await tx.wait();
        console.log("Ticket bought successfully");
        setHasTicket((prev) => ({ ...prev, [id]: true }));
        getLotteries();
        getAllWinners();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const checkRefund = async (id) => {
    const LotteryContract = await getEthereumContract(true);
    if (LotteryContract) {
      try {
        const ticketPurchasedAmount = await LotteryContract.amountTicketsBought(
          id,
          accounts
        );
        if (ticketPurchasedAmount > 0) {
          setHasTicket((prev) => ({ ...prev, [id]: true }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getLotteries();
    getAllWinners();
    connectToMetamask();
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
    connectToMetamask,
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
