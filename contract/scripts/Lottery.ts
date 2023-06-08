import * as readline from 'readline';
import { ethers } from "hardhat";
import { Lottery, LotteryToken, LotteryToken__factory, Lottery__factory } from "../typechain-types";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
let LotteryContract: Lottery;
let token: LotteryToken;
let accounts: SignerWithAddress[];

const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1;

async function main() {
  await initAccounts();
  await initContract();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function initAccounts() {
  accounts = await ethers.getSigners();
}

async function initContract() {

  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_SANGOKU ?? "");

  // const chainId = 80001; // This is the chainId for Mumbai Testnet

  // const provider = new ethers.providers.AlchemyProvider(chainId, process.env.ALCHEMY_API_KEY);

  // const signer = wallet.connect(provider)

  const LotteryContractFactory = new Lottery__factory(accounts[0]);
  LotteryContract = await LotteryContractFactory.deploy("LotteryToken", "LTO", TOKEN_RATIO, ethers.utils.parseEther(BET_PRICE.toFixed(10)), ethers.utils.parseEther(BET_FEE.toFixed(10)));
  await LotteryContract.deployed();
  const tokenAddress = await LotteryContract.paymentToken();
  const tokenFactory = new LotteryToken__factory();

  //token only linked to account0
  token = tokenFactory.attach(tokenAddress).connect(accounts[0]);
  console.log("Deployed lottery Contract to address " + LotteryContract.address);
  console.log("Deployed Token Contract to address " + token.address);
}
async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Check state \n [2]: Open bets \n [3]: Top up account tokens \n [4]: Bet with account \n [5]: Close bets \n [6]: Check player prize \n [7]: Withdraw \n [8]: Burn tokens \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          await checkState();
          mainMenu(rl);
          break;
        case 2:
          rl.question("Input duration (in seconds)\n", async (duration) => {
            try {
              await openBets(duration);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 3:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayBalance(index);
            rl.question("Buy how many tokens?\n", async (amount) => {
              try {
                await buyTokens(index, amount);
                await displayBalance(index);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 4:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Bet how many times?\n", async (amount) => {
              try {
                await bet(index, amount);
                await displayTokenBalance(index);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        case 5:
          try {
            await closeLottery();
          } catch (error) {
            console.log("error\n");
            console.log({ error });
          }
          mainMenu(rl);
          break;
        case 6:
          rl.question("What account (index) to use?\n", async (index) => {
            const prize = await displayPrize(index);
            if (Number(prize) > 0) {
              rl.question(
                "Do you want to claim your prize? [Y/N]\n",
                async (answer) => {
                  if (answer.toLowerCase() === "y") {
                    try {
                      await claimPrize(index, prize);
                    } catch (error) {
                      console.log("error\n");
                      console.log({ error });
                    }
                  }
                  mainMenu(rl);
                }
              );
            } else {
              mainMenu(rl);
            }
          });
          break;
        case 7:
          await displayTokenBalance("0");
          await displayOwnerPool();
          rl.question("Withdraw how many tokens?\n", async (amount) => {
            try {
              await withdrawTokens(amount);
            } catch (error) {
              console.log("error\n");
              console.log({ error });
            }
            mainMenu(rl);
          });
          break;
        case 8:
          rl.question("What account (index) to use?\n", async (index) => {
            await displayTokenBalance(index);
            rl.question("Burn how many tokens?\n", async (amount) => {
              try {
                await burnTokens(index, amount);
              } catch (error) {
                console.log("error\n");
                console.log({ error });
              }
              mainMenu(rl);
            });
          });
          break;
        default:
          throw new Error("Invalid option");
      }
    }
  );
}

async function checkState() {

  const state = await LotteryContract.betsOpen();
  console.log(`The lottery is ${state ? "open" : "closed"}\n`);
  const currentBlock = await ethers.provider.getBlock("latest");
  const currentBlockDate = new Date(currentBlock.timestamp * 1000);
  console.log(`The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()} \n`);
  const closingTime = await LotteryContract.betsClosingTime();
  const closingTimeDate = new Date(closingTime.toNumber() * 1000);
  console.log(`Lottey should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()} \n`);

}

async function openBets(duration: string) {

  const currentBlock = await ethers.provider.getBlock("latest");
  const tx = await LotteryContract.openBets(currentBlock.timestamp + Number(duration));
  const receipt = await tx.wait();
  console.log(`Bets opened (${receipt.transactionHash}) `);
}

async function displayBalance(index: string) {
  //const balanceBN = await ethers.provider.getBalance(accounts[Number(index)].address);
  const balanceBN = await accounts[Number(index)].getBalance();
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(
    `The account address ${accounts[Number(index)].address} has ${balance} ETH\n`
  );
}

async function buyTokens(index: string, amount: string) {
  const tx = await LotteryContract.connect(accounts[Number(index)]).purchaseTokens({ value: ethers.utils.parseUnits(amount) })
  console.log(
    `The account address ${accounts[Number(index)].address} has ${amount} Token\n`
  );

}

async function displayTokenBalance(index: string) {
  const balanceBN = await token.balanceOf(accounts[Number(index)].address);
  const balance = ethers.utils.formatEther(balanceBN);
  console.log(
    `The account address ${accounts[Number(index)].address} has ${balance} ETH\n`
  );
}

async function bet(index: string, amount: string) {
  const bet = await LotteryContract.betMany(amount)

  const allowTx = await token
    .connect(accounts[Number(index)])
    .approve(LotteryContract.address, ethers.constants.MaxUint256);

  await allowTx.wait();
  const tx = await LotteryContract.connect(accounts[Number(index)]).betMany(amount);
  const receipt = await tx.wait();
  console.log(`Bets placed (${receipt.transactionHash})\n`);
}

async function closeLottery() {
  const tx = await LotteryContract.closeLottery();
  const receipt = await tx.wait();
  console.log(`Bets closed (${receipt.transactionHash})\n`);
}
async function displayPrize(index: string) {
  const prizeBN = await LotteryContract.prize(accounts[Number(index)].address);
  const prize = ethers.utils.formatEther(prizeBN);
  console.log(
    `The account of address ${accounts[Number(index)].address
    } has earned a prize of ${prize} Tokens\n`
  );
  return prize;
}

async function claimPrize(index: string, amount: string) {

  const claimPrize = await LotteryContract
    .connect(accounts[Number(index)].address)
    .prizeWithdraw(amount)

  const claimPrizeTx = claimPrize.wait()

  console.log(
    `The account address ${accounts[Number(index)].address} claimed ${claimPrize}`
  );
}

async function displayOwnerPool() {
  const prizePool = await LotteryContract.ownerPool()
  const prizePoolTx = ethers.utils.formatEther(prizePool)
  console.log(
    `The account address has in the pool ${prizePool} eth`
  );
}

async function withdrawTokens(amount: string) {

  const withdraw = await LotteryContract.ownerWithdraw(amount)
  const withdrawTx = withdraw.wait()
  console.log(
    `The account address ${withdrawTx} has in the pool ${amount} eth`
  );
}

async function burnTokens(index: string, amount: string) {
  const allowTx = await token
    .connect(accounts[Number(index)])
    .approve(LotteryContract.address, ethers.constants.MaxUint256); // CHECK
  const receiptAllow = await allowTx.wait();
  console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
  const tx = await LotteryContract
    .connect(accounts[Number(index)])
    .returnTokens(ethers.utils.parseEther(amount)); // CHECK
  const receipt = await tx.wait();
  console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});