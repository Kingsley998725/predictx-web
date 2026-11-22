/**
 * Stellar SDK helpers and client interaction layer (#20, #332)
 * Stellar SDK helpers and client interaction layer.
 *
 * Only the Horizon URL helper is used by the rest of the codebase
 * (hooks/use-wallet.tsx). The three additional members that were here
 * (getAccountBalance, getAccountSequence, signAndSubmitTransaction) had no
 * call sites and have been removed to keep this module honest.
 *
 * When proper Soroban / smart-contract integration is added, extend this
 * module at that point rather than leaving stub implementations.
 */

import * as StellarSdk from "@stellar/stellar-sdk";
import { CURRENT_NETWORK_CONFIG } from "./constants";

export const HORIZON_URLS = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

export const SOROBAN_RPC_URLS = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://soroban-rpc.mainnet.stellar.org",
} as const;

export type StellarNetwork = keyof typeof HORIZON_URLS;

export const sorobanServer = new StellarSdk.rpc.Server(
  CURRENT_NETWORK_CONFIG.rpcUrl,
);

export const horizonServer = new StellarSdk.Horizon.Server(
  CURRENT_NETWORK_CONFIG.horizonUrl,
);

export const networkPassphrase = CURRENT_NETWORK_CONFIG.networkPassphrase;

export type StellarErrorCode =
  | "WALLET_NOT_FOUND"
  | "USER_REJECTED"
  | "INSUFFICIENT_BALANCE"
  | "TX_FAILED"
  | "NETWORK_ERROR";

export class StellarError extends Error {
  constructor(
    message: string,
    public code: StellarErrorCode,
    public details?: unknown,
  ) {
    super(message);
    this.name = "StellarError";
  }
}

export interface StellarClient {
  getHorizonUrl: (network?: StellarNetwork) => string;
  getAccountBalance: (publicKey: string, network?: StellarNetwork) => Promise<number>;
  getAccountSequence: (publicKey: string, network?: StellarNetwork) => Promise<string>;
  signAndSubmitTransaction: (txXdr: string) => Promise<never>;
/**
 * Returns the Horizon REST endpoint for the requested network.
 *
 * @example
 *   const url = getHorizonUrl("testnet");
 *   // "https://horizon-testnet.stellar.org"
 */
export function getHorizonUrl(network: StellarNetwork = "testnet"): string {
  return HORIZON_URLS[network];
}
