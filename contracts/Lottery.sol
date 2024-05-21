// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Lottery is ReentrancyGuard {
    address public owner;
    uint256 public lotteriesCount;
    mapping(uint256 => LotteryStruct) public lotteries;
    mapping(uint256 => WinnerStruct) public winnerInfos;
    mapping(uint256 => mapping(address => uint256)) public amountTicketsBought;
    address[] public winners;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    struct LotteryStruct {
        uint256 id;
        uint256 playersNumber;
        uint256 enterPrice;
        uint256 currentBalance;
        uint256 currentPlayersNum;
        uint256 round;
        address[] players;
    }

    struct WinnerStruct {
        uint256 winnerId;
        uint256 lotteryWonId;
        uint256 lotteryWonRound;
        uint256 amountWon;
        address winnerAddress;
    }

    // Create lottery
    function createLottery(
        uint256 _playersNumber,
        uint256 _enterPrice
    ) public onlyOwner {
        require(
            _playersNumber > 1,
            "Cant add lottery with less than 2 players"
        );
        require(_enterPrice != 0, "Lottery must have enter price");

        LotteryStruct memory lottery;

        lotteriesCount++;
        lottery.id = lotteriesCount;
        lottery.playersNumber = _playersNumber;
        lottery.enterPrice = _enterPrice;
        lottery.round = 1;
        lotteries[lottery.id] = lottery;
    }

    // Buying tickets for lottery
    function buyTicket(uint256 _id) public payable nonReentrant {
        require(
            msg.value == lotteries[_id].enterPrice,
            "Not enough funds to buy ticket"
        );
        require(
            lotteries[_id].currentPlayersNum < lotteries[_id].playersNumber,
            "All tickets sold out"
        );

        lotteries[_id].currentBalance += msg.value;
        lotteries[_id].currentPlayersNum++;
        lotteries[_id].players.push(msg.sender);
        amountTicketsBought[_id][msg.sender] += msg.value;

        if (lotteries[_id].currentPlayersNum == lotteries[_id].playersNumber) {
            pickWinner(_id);
        }
    }

    // Refund ticket
    function refundTicket(uint256 _id) public nonReentrant {
        require(amountTicketsBought[_id][msg.sender] > 0, "Nothing to refund");
        uint256 amountToRefund = amountTicketsBought[_id][msg.sender];

        lotteries[_id].currentBalance -= amountToRefund;
        lotteries[_id].currentPlayersNum--;

        (bool success, ) = payable(msg.sender).call{value: amountToRefund}("");
        require(success, "Refund failed");

        amountTicketsBought[_id][msg.sender] = 0;

        // Remove player from players array
        for (uint256 i = 0; i < lotteries[_id].players.length; i++) {
            if (lotteries[_id].players[i] == msg.sender) {
                lotteries[_id].players[i] = lotteries[_id].players[
                    lotteries[_id].players.length - 1
                ];
                lotteries[_id].players.pop();
                break;
            }
        }
    }

    // Generating random number to pick winner
    function random(uint256 numOfPlayers) internal view returns (uint256) {
        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), block.timestamp)
            )
        );
        return (rand % numOfPlayers);
    }

    // Picks winner address
    function pickWinner(uint256 _id) public {
        require(
            lotteries[_id].currentPlayersNum == lotteries[_id].playersNumber,
            "Need more players to pick winner"
        );
        uint256 randomNum = random(lotteries[_id].playersNumber);
        uint256 winAmount = lotteries[_id].playersNumber *
            lotteries[_id].enterPrice;
        uint256 fee = (winAmount * 10) / 100;
        uint256 winAmountToTransfer = (winAmount - fee) * 1 wei;
        address winner = lotteries[_id].players[randomNum];
        (bool success, ) = winner.call{value: winAmountToTransfer}("");
        require(success, "transfer failed");

        winners.push(winner);
        lotteries[_id].round++;
        lotteries[_id].currentBalance = 0;
        lotteries[_id].currentPlayersNum = 0;
        delete lotteries[_id].players;

        WinnerStruct memory winnerInfo;
        winnerInfo.winnerId = winners.length;
        winnerInfo.lotteryWonId = _id;
        winnerInfo.lotteryWonRound = lotteries[_id].round;
        winnerInfo.amountWon = winAmountToTransfer;
        winnerInfo.winnerAddress = winner;
        winnerInfos[winnerInfo.winnerId] = winnerInfo;
    }

    function getPlayers(uint256 _id) public view returns (address[] memory) {
        return lotteries[_id].players;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    function getLotteries() public view returns (LotteryStruct[] memory) {
        LotteryStruct[] memory allLotteries = new LotteryStruct[](
            lotteriesCount
        );
        for (uint256 i = 0; i < lotteriesCount; i++) {
            allLotteries[i] = lotteries[i + 1];
        }
        return allLotteries;
    }

    function getAllWinnersInfo() public view returns (WinnerStruct[] memory) {
        WinnerStruct[] memory allWinnersInfo = new WinnerStruct[](
            winners.length
        );
        for (uint256 i = 0; i < winners.length; i++) {
            allWinnersInfo[i] = winnerInfos[i + 1];
        }
        return allWinnersInfo;
    }
}
