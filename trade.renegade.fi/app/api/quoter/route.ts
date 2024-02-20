import {
  AccountId,
  Balance,
  BalanceId,
  Keychain,
  Order,
  Renegade,
  Token
} from "@renegade-fi/renegade-js";
import { NextResponse } from "next/server";
import invariant from "tiny-invariant";

// Next config
export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const runtime = 'edge'

// Script config
const DEV_ADDRESS = process.env.DEV_PUBLIC_KEY

// TODO: For testnet, deposit huge amounts so we don't have to worry about depositing
// const MAX_AMOUNT = 2 ** 27;
const RELAYER_HOSTNAME = process.env.RELAYER_HOSTNAME ?? "localhost";
const SEED = process.env.SEED;
const USE_INSECURE_TRANSPORT = RELAYER_HOSTNAME === "localhost";
const verbose = process.env.VERBOSE === "true";

// Token pairs to trade
const TOKEN_PAIRS = [["WETH", "USDC"]];
const ORDER_AMOUNT = 10
const BALANCE_AMOUNT: Record<string, bigint> = {
  WETH: BigInt(100),
  USDC: BigInt(30_000)
}

let orderCount = 0;

export async function GET() {
  try {
    // Instantiate new Renegade object
    const renegade = new Renegade({
      relayerHostname: RELAYER_HOSTNAME,
      relayerHttpPort: 3000,
      relayerWsPort: 4000,
      useInsecureTransport: USE_INSECURE_TRANSPORT,
      verbose: true,
    });
    await renegade.init()

    // Ensure the relayer is running
    await renegade.ping().catch(() => {
      throw new Error("Renegade Relayer is not running.");
    });

    if (verbose) {
      console.log("Renegade Relayer is running.");
    }

    // Register a new Account with the Renegade object
    const accountId = renegade.registerAccount(
      new Keychain({
        seed: SEED,
      }),
    );

    if (verbose) {
      console.log(`Account registered with ID: ${accountId}`);
    }

    // Sync account with the relayer
    await renegade.initializeAccount(accountId);

    if (verbose) {
      console.log(`Account synchronized with ID: ${accountId}`);
    }

    // TODO: Post task queue inregration, should do all checks and prepare actions, then execute in serial
    for (const [base, quote] of TOKEN_PAIRS) {
      if (verbose) {
        console.log(`Processing pair: ${base}/${quote}`);
      }
      const baseToken = new Token({ ticker: base });
      const quoteToken = new Token({ ticker: quote });
      await setupAndPlaceOrder(
        renegade,
        accountId,
        baseToken,
        quoteToken,
        "buy",
        verbose,
      );
      // await setupAndPlaceOrder(
      //   renegade,
      //   accountId,
      //   baseToken,
      //   quoteToken,
      //   "sell",
      //   verbose
      // )
    }

    if (verbose) {
      console.log(`Orders placed: ${orderCount}`);
    }
    return NextResponse.json({
      ok: true,
      message: `Orders placed: ${orderCount}`,
    });
  } catch (err) {
    console.log("[CRON]: ", err);
    return NextResponse.json(
      {
        ok: false,
        message: String(err),
      },
      { status: 500 },
    );
  }
}

/**
 * Deposits the necessary tokens into the account to ensure the order is valid, then sets up and places an order
 *
 * @param renegade - The Renegade instance to use.
 * @param accountId - The account ID to use.
 * @param baseToken - The base token to use.
 * @param quoteToken - The quote token to use.
 * @param side - The side of the order to place.
 * @param verbose - Flag to enable/disable verbose logging
 */
async function setupAndPlaceOrder(
  renegade: Renegade,
  accountId: AccountId,
  baseToken: Token,
  quoteToken: Token,
  side: "buy" | "sell",
  verbose = false,
) {
  if (verbose) {
    console.log("Creating an order object with specified parameters.");
  }

  const order = new Order({
    baseToken,
    quoteToken,
    side,
    type: "midpoint",
    amount: BigInt(ORDER_AMOUNT),
  });

  if (verbose) {
    console.log("Retrieving existing orders for the account.");
  }

  const orders = await renegade.getOrders(accountId);

  if (verbose) {
    console.log(
      "Current orders in wallet orderbook:"
    );
    for (const [orderId, order] of Object.entries(orders)) {
      console.log(`Order ID: ${orderId}, Order Details: ${JSON.stringify(order, null, 2)}`);
    }
  }

  if (side === "sell") {
    await maxDeposit(renegade, accountId, baseToken, verbose);
  } else {
    await maxDeposit(renegade, accountId, quoteToken, verbose);
  }

  if (verbose) {
    console.log("Placing the order: ", order);
  }
  // TODO: Post task queue integration, should simply use renegade.placeOrder
  await renegade.placeOrder(accountId, order).then(() => orderCount++);

  if (verbose) {
    console.log("End of order placement.");
  }

  return;
}

/**
 * Deposits the necessary tokens into the account
 *
 * @param renegade - The Renegade instance to use.
 * @param accountId - The account ID to use.
 * @param token - The token to deposit.
 */
async function maxDeposit(
  renegade: Renegade,
  accountId: AccountId,
  token: Token,
  verbose = false,
) {
  const balances = await renegade.getBalances(accountId);
  const ticker = Token.findTickerByAddress(token.address)
  const bal = findBalanceByToken(balances, token);
  const amountToDeposit = BALANCE_AMOUNT[ticker] - bal.amount;

  if (amountToDeposit <= BigInt(0)) {
    return;
  }

  if (verbose) {
    console.log(`Depositing ${amountToDeposit} ${ticker}.`);
  }

  invariant(DEV_ADDRESS, "DEV_PUBLIC_KEY is required")
  await renegade.deposit(accountId, token, amountToDeposit, DEV_ADDRESS);

  return;
}

/**
 * Find the balance of a given token in a list of balances.
 *
 * @param balances - The list of balances to search through.
 * @param token - The token to find the balance of.
 * @returns The balance of the token, or a new balance with amount 0 if the token is not found.
 */
function findBalanceByToken(
  balances: Record<BalanceId, Balance>,
  token: Token,
): Balance {
  const addressToFind = token.address;
  const foundBalance =
    Object.entries(balances)
      .map(([, balance]) => balance)
      .find((balance) => balance.mint.address === addressToFind) ??
    new Balance({ mint: token, amount: BigInt(0) });
  return foundBalance;
}