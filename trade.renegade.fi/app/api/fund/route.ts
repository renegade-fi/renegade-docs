import { Token } from "@renegade-fi/renegade-js"
import {
  PrivateKeyAccount,
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseAbi,
  parseEther,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"

import { formatAmount, parseAmount } from "@/lib/utils"
import { stylusDevnetEc2 } from "@/lib/viem"

export const maxDuration = 300

const TOKENS_TO_FUND: { ticker: string; amount: string }[] = [
  {
    ticker: "WETH",
    amount: "10",
  },
  {
    ticker: "WBTC",
    amount: "5",
  },
  {
    ticker: "BNB",
    amount: "100",
  },
  {
    ticker: "MATIC",
    amount: "100",
  },
  {
    ticker: "LDO",
    amount: "100",
  },
  {
    ticker: "USDC",
    amount: "100000",
  },
  {
    ticker: "LINK",
    amount: "100",
  },
  {
    ticker: "UNI",
    amount: "100",
  },
  {
    ticker: "SUSHI",
    amount: "100",
  },
  {
    ticker: "1INCH",
    amount: "100",
  },
  {
    ticker: "AAVE",
    amount: "100",
  },
  {
    ticker: "COMP",
    amount: "100",
  },
  {
    ticker: "MKR",
    amount: "100",
  },
  {
    ticker: "REN",
    amount: "100",
  },
  {
    ticker: "MANA",
    amount: "100",
  },
  {
    ticker: "ENS",
    amount: "100",
  },
  {
    ticker: "DYDX",
    amount: "100",
  },
  {
    ticker: "CRV",
    amount: "100",
  },
]

// TODO: Make sure mint works
const abi = parseAbi([
  "function mint(address _address, uint256 value) external",
])

const publicClient = createPublicClient({
  chain: stylusDevnetEc2,
  transport: http(),
})

export async function GET(request: Request) {
  if (!process.env.DEV_PRIVATE_KEY) {
    return new Response("DEV_PRIVATE_KEY is required", {
      status: 500,
    })
  }

  const { searchParams } = new URL(request.url)
  const recipient = searchParams.get("address") as `0x${string}`
  if (!recipient) {
    return new Response("Address is required", {
      status: 500,
    })
  }

  try {
    // Account to fund ETH from
    const account = privateKeyToAccount(
      process.env.DEV_PRIVATE_KEY as `0x${string}`
    )

    const ethAmount = parseEther("0.1")
    await fundEth(account, recipient, ethAmount);

    // Loop through each token in TOKENS_TO_FUND and mint them
    for (const { ticker, amount } of TOKENS_TO_FUND) {
      await mintTokens(account, ticker, amount, recipient);
    }

    return new Response("Success!", {
      status: 200,
    })
  } catch (error) {
    return new Response(`Error funding ${recipient}: ${error}`, {
      status: 500,
    })
  }
}

async function fundEth(
  account: PrivateKeyAccount,
  recipient: `0x${string}`,
  ethAmount: bigint
): Promise<void> {
  const walletClient = createWalletClient({
    account,
    chain: stylusDevnetEc2,
    transport: http(),
  });

  let attempts = 0;
  while (attempts < 5) {
    try {
      const hash = await walletClient.sendTransaction({
        account,
        to: recipient,
        value: ethAmount,
      });

      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      console.log(
        `Funded ${recipient} with ${formatEther(ethAmount)} ETH. Transaction hash: ${transaction.transactionHash}`
      );
      break; // Exit loop on success
    } catch (error: any) {
      if (error?.message?.includes("nonce")) {
        attempts++;
        console.log(`Nonce error, retrying... Attempt ${attempts}`);
        continue; // Retry on nonce error
      } else {
        throw error; // Rethrow if error is not nonce related
      }
    }
  }
}

async function mintTokens(
  account: PrivateKeyAccount,
  ticker: string,
  amount: string,
  recipient: `0x${string}`
): Promise<void> {
  const walletClient = createWalletClient({
    account,
    chain: stylusDevnetEc2,
    transport: http(),
  });

  const token = new Token({ ticker });
  const tokenAmount = parseAmount(amount, token);

  let attempts = 0;
  while (attempts < 5) {
    try {
      const { request: tokenRequest } = await publicClient.simulateContract({
        account,
        address: Token.findAddressByTicker(ticker) as `0x${string}`,
        abi,
        functionName: "mint",
        args: [recipient, tokenAmount],
      });

      const hash = await walletClient.writeContract(tokenRequest);
      const tx = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1
      });

      console.log(
        `Minted ${formatAmount(tokenAmount, token)} ${ticker} to ${recipient}. Transaction hash: ${tx.transactionHash}`
      );
      break; // Exit loop on success
    } catch (error: any) {
      if (error?.message?.includes("nonce")) {
        attempts++;
        console.log(`Nonce error, retrying... Attempt ${attempts}`);
        continue; // Retry on nonce error
      } else {
        throw error; // Rethrow if error is not nonce related
      }
    }
  }
}