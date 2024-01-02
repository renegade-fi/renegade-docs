import {
  UseContractEventConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
    name: "Approval",
  },
  {
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
    name: "Transfer",
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// weth
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wethABI = [
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "guy", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "src", type: "address" },
      { name: "dst", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "wad", type: "uint256" }],
    name: "withdraw",
    outputs: [],
  },
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "dst", type: "address" },
      { name: "wad", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
  },
  {
    constant: false,
    payable: true,
    stateMutability: "payable",
    type: "function",
    inputs: [],
    name: "deposit",
    outputs: [],
  },
  {
    constant: true,
    payable: false,
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "src", type: "address", indexed: true },
      { name: "guy", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "src", type: "address", indexed: true },
      { name: "dst", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
    name: "Transfer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "dst", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
    name: "Deposit",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "src", type: "address", indexed: true },
      { name: "wad", type: "uint256", indexed: false },
    ],
    name: "Withdrawal",
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends "decimals",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "decimals",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({
    abi: erc20ABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof erc20ABI, "approve", TMode> & {
        abi?: never
        functionName?: "approve"
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, "approve", TMode>({
    abi: erc20ABI,
    functionName: "approve",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<typeof erc20ABI, "transfer", TMode> & {
        abi?: never
        functionName?: "transfer"
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, "transfer", TMode>({
    abi: erc20ABI,
    functionName: "transfer",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof erc20ABI, "transferFrom", TMode> & {
        abi?: never
        functionName?: "transferFrom"
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, "transferFrom", TMode>({
    abi: erc20ABI,
    functionName: "transferFrom",
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, "approve">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, "transfer">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, "transferFrom">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, "Approval">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof erc20ABI, "Transfer">)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__.
 */
export function useWethRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({ abi: wethABI, ...config } as UseContractReadConfig<
    typeof wethABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"name"`.
 */
export function useWethName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useWethTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"decimals"`.
 */
export function useWethDecimals<
  TFunctionName extends "decimals",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "decimals",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useWethBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"symbol"`.
 */
export function useWethSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"allowance"`.
 */
export function useWethAllowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: wethABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__.
 */
export function useWethWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof wethABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof wethABI, TFunctionName, TMode>({
    abi: wethABI,
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"approve"`.
 */
export function useWethApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, "approve">["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof wethABI, "approve", TMode> & {
        abi?: never
        functionName?: "approve"
      } = {} as any
) {
  return useContractWrite<typeof wethABI, "approve", TMode>({
    abi: wethABI,
    functionName: "approve",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useWethTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wethABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof wethABI, "transferFrom", TMode> & {
        abi?: never
        functionName?: "transferFrom"
      } = {} as any
) {
  return useContractWrite<typeof wethABI, "transferFrom", TMode>({
    abi: wethABI,
    functionName: "transferFrom",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"withdraw"`.
 */
export function useWethWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wethABI,
          "withdraw"
        >["request"]["abi"],
        "withdraw",
        TMode
      > & { functionName?: "withdraw" }
    : UseContractWriteConfig<typeof wethABI, "withdraw", TMode> & {
        abi?: never
        functionName?: "withdraw"
      } = {} as any
) {
  return useContractWrite<typeof wethABI, "withdraw", TMode>({
    abi: wethABI,
    functionName: "withdraw",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transfer"`.
 */
export function useWethTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof wethABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<typeof wethABI, "transfer", TMode> & {
        abi?: never
        functionName?: "transfer"
      } = {} as any
) {
  return useContractWrite<typeof wethABI, "transfer", TMode>({
    abi: wethABI,
    functionName: "transfer",
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"deposit"`.
 */
export function useWethDeposit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, "deposit">["request"]["abi"],
        "deposit",
        TMode
      > & { functionName?: "deposit" }
    : UseContractWriteConfig<typeof wethABI, "deposit", TMode> & {
        abi?: never
        functionName?: "deposit"
      } = {} as any
) {
  return useContractWrite<typeof wethABI, "deposit", TMode>({
    abi: wethABI,
    functionName: "deposit",
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__.
 */
export function usePrepareWethWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareWethApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, "approve">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareWethTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, "transferFrom">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareWethWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, "withdraw">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    functionName: "withdraw",
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, "withdraw">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareWethTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, "transfer">)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"deposit"`.
 */
export function usePrepareWethDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, "deposit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: wethABI,
    functionName: "deposit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, "deposit">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__.
 */
export function useWethEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof wethABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({ abi: wethABI, ...config } as UseContractEventConfig<
    typeof wethABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Approval"`.
 */
export function useWethApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: wethABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof wethABI, "Approval">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Transfer"`.
 */
export function useWethTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: wethABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof wethABI, "Transfer">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Deposit"`.
 */
export function useWethDepositEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, "Deposit">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: wethABI,
    eventName: "Deposit",
    ...config,
  } as UseContractEventConfig<typeof wethABI, "Deposit">)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Withdrawal"`.
 */
export function useWethWithdrawalEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, "Withdrawal">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: wethABI,
    eventName: "Withdrawal",
    ...config,
  } as UseContractEventConfig<typeof wethABI, "Withdrawal">)
}
