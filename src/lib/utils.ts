import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatContractAddress = (address: string, isMobile: boolean) => {
  if (isMobile) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
};

export const getTokenExplorerUrl = (tokenId: bigint, chainId: number, contractAddress: string) => {
  const baseUrl = chainId === 56 ? 'https://bscscan.com' : 'https://testnet.bscscan.com';
  return `${baseUrl}/token/${contractAddress}?a=${tokenId.toString()}`;
};
