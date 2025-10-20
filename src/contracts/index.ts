export const GENESIS_CONTRACT_ADDRESS = "0xA9C9b3BfdDbb761ea82272787abD61beddC15382";
export const GENESIS_CHAIN_ID = 56; // BSC Mainnet
export { default as GENESIS_ABI } from "./SmartSentinelsGenesis.json";

export const AI_AUDIT_CONTRACT_ADDRESS = "0x9C4d0aa26f3697C30e8D69A0d8d29baAE7027c1c";
export const AI_AUDIT_CHAIN_ID = 97; // BSC Testnet
export { default as AI_AUDIT_ABI } from "./SmartSentinelsAIAuditNFT.json";

// PoUW System Contracts - ALL DEPLOYED ✅
// SSTL Token: 100M max supply (60M initial mint to Treasury, 40M for PoUW over 4 years)
export const SSTL_TOKEN_ADDRESS = "0xf5450ff4de640b951a95D3aC4f9d6D7AAcACA948"; // SmartSentinelsToken - DEPLOYED ✅
export const POUW_POOL_ADDRESS = "0x0B5D591a0c929ca7e3BEe23352F9D4825db8EAaE"; // SmartSentinelsPoUW - DEPLOYED ✅
export const AUDIT_GATEWAY_ADDRESS = "0x50cFfCaa77A4C873b8fE2e6a407e334e599EEF40"; // AIAuditAgentGateway - DEPLOYED ✅
export { default as SSTL_TOKEN_ABI } from "./SmartSentinelsToken.json";
export { default as POUW_POOL_ABI } from "./SmartSentinelsPoUW.json";
export { default as AUDIT_GATEWAY_ABI } from "./AIAuditAgentGateway.json";