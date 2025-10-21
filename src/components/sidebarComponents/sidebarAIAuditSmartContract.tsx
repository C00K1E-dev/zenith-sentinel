import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Upload, Play, FileText, Wrench, Brain, DollarSign, CheckCircle, Award, Loader2, Wallet, AlertTriangle, X, Search } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

// --- IMPORTS FOR WALLET AND TOKEN TRANSFER ---
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits, keccak256, toHex, createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';
import { SSTL_TOKEN_ADDRESS, SSTL_TOKEN_ABI, AUDIT_GATEWAY_ADDRESS, AUDIT_GATEWAY_ABI, POUW_POOL_ADDRESS, POUW_POOL_ABI } from "../../contracts/index";

// --- Circular Progress Component for Security Score ---
interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  score, 
  size = 80, 
  strokeWidth = 6 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color logic based on score
  const getColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 80) return '#F59E0B'; // Yellow/Orange
    if (score >= 60) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const color = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="font-bold text-xs sm:text-sm md:text-base"
          style={{ color }}
        >
          {score}/100
        </span>
      </div>
    </div>
  );
};

// --- TYPE DEFINITIONS ---
interface VulnerabilityBreakdown {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
    Informational: number;
    Gas: number;
}

interface Vulnerability {
    swcId?: string;
    severity: "Critical" | "High" | "Medium" | "Low" | "Informational" | "Gas";
    title: string;
    description: string;
    lineNumbers?: number[];
}

interface AuditData {
    contractName: string;
    version: string;
    securityScore: number;
    overallAssessment: string;
    vulnerabilityBreakdown: VulnerabilityBreakdown;
    vulnerabilities: Vulnerability[];
    transactionHash?: string;
}

interface RemediationState {
    title: string;
    code: string;
    loading: boolean;
}

// --- CONFIGURATION CONSTANTS ---
// Using the specified API Key from environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Switching to the more robust 'flash' model to handle complex structured output requests
const API_MODEL = "gemini-2.0-flash";
const API_URL_TEMPLATE = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=`;
// Logo URL - Using SVG for perfect scaling
const LOGO_URL = "/ss-icon.svg";

// Payment Configuration - BSC TESTNET (DEPLOYED ✅)
const BSC_TESTNET_CHAIN_ID = 97;
const SSTL_CONTRACT = SSTL_TOKEN_ADDRESS as `0x${string}`;
const PAYMENT_RECIPIENT = '0x46e451d555ebCB4ccE5087555a07F6e69D017b05' as `0x${string}`; // Your Wallet (AI Agent Creator)
const AUDIT_COST = '1000'; // 1000 SSTL tokens (matches deployed contract)
const SERVICE_OWNER = '0x46e451d555ebCB4ccE5087555a07F6e69D017b05'; // AI Audit service owner address

// --- HUB-STYLE CSS (Matching SmartSentinels Hub Widgets) ---
const hubStyles = `
    .audit-dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
        margin-top: 32px;
    }

    /* Responsive breakpoints */
    @media (min-width: 320px) {
        .audit-dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 24px;
        }
        .audit-dashboard-widget {
            padding: 16px;
        }
    }

    @media (min-width: 375px) {
        .audit-dashboard-widget {
            padding: 18px;
        }
    }

    @media (min-width: 425px) {
        .audit-dashboard-widget {
            padding: 20px;
        }
    }

    @media (min-width: 768px) {
        .audit-dashboard-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        .audit-dashboard-widget {
            padding: 22px;
        }
    }

    @media (min-width: 1024px) {
        .audit-dashboard-grid {
            grid-template-columns: 1fr;
            gap: 24px;
        }
        .audit-dashboard-widget {
            padding: 24px;
        }
    }

    @media (min-width: 1440px) {
        .audit-dashboard-widget {
            padding: 28px;
        }
    }

    @media (min-width: 2160px) {
        .audit-dashboard-widget {
            padding: 32px;
        }
    }

    .audit-dashboard-widget {
        background: #191919;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.07);
        transition: all 0.2s;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
    }

    .audit-dashboard-widget:hover {
        border-color: rgba(250, 249, 86, 0.3);
        transform: translateY(-2px);
    }

    .audit-dashboard-widget h4 {
        color: hsl(var(--primary));
        margin-bottom: 16px;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .audit-action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .audit-action-btn {
        background: rgba(255,255,255,0.1);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 12px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.9rem;
        position: relative;
    }

    .audit-action-btn:hover {
        background: rgba(250, 249, 86, 0.2);
        color: hsl(var(--primary));
        border-color: rgba(250, 249, 86, 0.4);
        transform: translateY(-1px);
    }

    .audit-action-btn.active {
        background: rgba(250, 249, 86, 0.15);
        color: hsl(var(--primary));
        border-color: rgba(250, 249, 86, 0.5);
        box-shadow: 0 0 10px rgba(250, 249, 86, 0.2);
        position: relative;
    }

    .audit-action-btn.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: hsl(var(--primary));
        border-radius: 0 3px 3px 0;
    }

    .audit-action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .audit-stats-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
    }

    .audit-stat-item {
        text-align: center;
        padding: 12px 8px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.05);
        overflow: hidden;
        min-width: 0;
    }
    
    @media (max-width: 425px) {
        .audit-stat-item {
            padding: 10px 6px;
        }
    }
    
    @media (max-width: 375px) {
        .audit-stat-item {
            padding: 8px 6px;
        }
    }
    
    @media (max-width: 320px) {
        .audit-stat-item {
            padding: 8px 4px;
        }
    }

    .audit-stat-number {
        display: block;
        font-size: 1.4rem;
        font-weight: 700;
        color: hsl(var(--primary));
        margin-bottom: 4px;
        word-break: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        max-width: 100%;
    }
    
    @media (max-width: 425px) {
        .audit-stat-number {
            font-size: 1.2rem;
        }
    }
    
    @media (max-width: 375px) {
        .audit-stat-number {
            font-size: 1.1rem;
        }
    }
    
    @media (max-width: 320px) {
        .audit-stat-number {
            font-size: 1rem;
        }
    }

    .audit-stat-label {
        color: #b0b0b0;
        font-size: 0.75rem;
        font-weight: 500;
        word-break: break-word;
    }
    
    @media (max-width: 425px) {
        .audit-stat-label {
            font-size: 0.7rem;
        }
    }
    
    @media (max-width: 375px) {
        .audit-stat-label {
            font-size: 0.65rem;
        }
    }
    
    @media (max-width: 320px) {
        .audit-stat-label {
            font-size: 0.6rem;
        }
    }

    .audit-textarea {
        width: 100%;
        padding: 12px;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255,255,255,0.1);
        outline: none;
        font-size: 0.875rem;
        color: #fff;
        font-family: 'Courier New', monospace;
        resize: none;
        transition: all 0.2s;
    }

    /* Responsive background image adjustments */
    @media (min-width: 480px) {
    }

    @media (min-width: 768px) {
    }

    @media (min-width: 1024px) {
        .audit-textarea {
            background-size: 20%;
        }
    }

    .audit-textarea:focus {
        border-color: rgba(250, 249, 86, 0.5);
        box-shadow: 0 0 0 2px rgba(250, 249, 86, 0.1);
    }

    .audit-loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
    }

    .audit-dot {
        width: 10px;
        height: 10px;
        margin: 0 5px;
        background-color: hsl(var(--primary));
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
    }

    .audit-dot:nth-child(1) { animation-delay: -0.32s; }
    .audit-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    }

    .audit-status-message {
        font-size: 1rem;
        margin-bottom: 2rem;
        text-align: center;
        color: #e0e0e0;
        line-height: 1.6;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .audit-remediation-card {
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
        border: 1px solid rgba(250, 249, 86, 0.2);
    }
    .audit-remediation-pre {
        margin-top: 8px;
        padding: 12px;
        background: rgba(0,0,0,0.5);
        border-radius: 4px;
        font-size: 0.75rem;
        overflow-x: auto;
        color: #4CAF50;
    }

    /* Wallet Action Button Styles - Matching SmartSentinels Hub */
    .audit-wallet-action-btn {
        background: rgba(255,255,255,0.1);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: all 0.2s;
        font-weight: 500;
    }

    .audit-wallet-action-btn:hover:not(:disabled) {
        background: rgba(250, 249, 86, 0.2);
        color: hsl(var(--primary));
        border-color: rgba(250, 249, 86, 0.4);
        transform: translateY(-1px);
    }

    .audit-wallet-action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
    
    /* Payment Button Styles */
    .audit-action-button {
        width: 100%;
        transition: all 0.2s ease;
    }
    
    .audit-action-button:not(:disabled):hover {
        transform: translateY(-1px);
        filter: brightness(1.1);
    }
    
    @media (max-width: 768px) {
        .audit-action-button {
            font-size: 0.9rem;
            padding: 10px 14px;
        }
    }
    
    @media (max-width: 425px) {
        .audit-action-button {
            font-size: 0.85rem;
            padding: 10px 12px;
        }
    }
    
    /* Wallet Status Box Responsive */
    @media (max-width: 425px) {
        .audit-dashboard-widget > div[style*="rgba(10, 218, 185"],
        .audit-dashboard-widget > div[style*="rgba(250, 249, 86"] {
            padding: 10px !important;
            font-size: 0.8rem !important;
        }
    }
`;

// --- 1. JSON SCHEMA DEFINITION (Deterministic Output) ---
// Note: This structure is critical for PoUW consistency.

const AUDIT_REPORT_SCHEMA = {
    type: "OBJECT",
    properties: {
        contractName: { type: "STRING" },
        version: { type: "STRING", description: "The Solidity pragma version used." },
        securityScore: { type: "NUMBER", description: "Calculated score from 0 to 100." },
        overallAssessment: { type: "STRING", description: "A two-paragraph summary of the contract's security posture and key takeaways." },
        vulnerabilityBreakdown: {
            type: "OBJECT",
            properties: {
                Critical: { type: "NUMBER" },
                High: { type: "NUMBER" },
                Medium: { type: "NUMBER" },
                Low: { type: "NUMBER" },
                Informational: { type: "NUMBER" },
                Gas: { type: "NUMBER" },
            },
        },
        vulnerabilities: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    swcId: { type: "STRING", description: "The standard SWC ID (e.g., SWC-107) or 'N/A' if custom." },
                    severity: { type: "STRING", enum: ["Critical", "High", "Medium", "Low", "Informational", "Gas"] },
                    title: { type: "STRING", description: "A concise title for the finding (e.g., Reentrancy Vulnerability)." },
                    description: { type: "STRING", description: "Detailed explanation of the issue." },
                    lineNumbers: { type: "ARRAY", items: { type: "INTEGER" }, description: "Array of line numbers where the issue occurs." },
                },
                required: ["severity", "title", "description"],
            },
        },
    },
    required: ["contractName", "securityScore", "vulnerabilityBreakdown", "vulnerabilities"],
};

// --- 2. Hook to generate the specialized System Prompt ---

const useAuditPrompt = () => {
    return useMemo(() => {
        return (
            "You are a specialized Smart Contract Static Analysis Engine for the SmartSentinels PoUW network. " +
            "Your task is to analyze the provided Solidity code and generate ONLY a single, deterministic JSON object " +
            "that strictly adheres to the provided schema. You MUST use a low temperature for maximum consistency." +
            "\n\n--- AUTHORITATIVE RESEARCH SOURCES ---" +
            "\n• Primary Research Source: EEA EthTrust Security Levels Specification v-after-2" +
            "\n• Reference: https://entethalliance.github.io/eta-registry/security-levels-spec.html" +
            "\n• This specification defines comprehensive security requirements for smart contract auditing" +
            "\n• Use the following security levels and requirements as your authoritative guide:" +
            "\n\n--- EEA ETHTRUST SECURITY LEVELS OVERVIEW ---" +
            "\n• Level S: Automated static analysis requirements (most can be checked by tools)" +
            "\n• Level M: Manual review requirements (requires human judgment)" +
            "\n• Level Q: Comprehensive business logic and documentation review" +
            "\n\n--- KEY SECURITY REQUIREMENTS FROM ETA REGISTRY ---" +
            "\n\nLEVEL S REQUIREMENTS:" +
            "\n• External Calls: Check return values, use Checks-Effects-Interactions pattern" +
            "\n• No delegatecall(): Prohibit unless protected and documented" +
            "\n• No tx.origin: Use msg.sender for authorization instead" +
            "\n• No exact balance checks: Avoid == comparisons with balances" +
            "\n• No abi.encodePacked() with consecutive variable length args: Prevents hash collisions" +
            "\n• No selfdestruct(): Prohibit unless protected and documented" +
            "\n• No assembly {}: Prohibit unless protected and documented" +
            "\n• Compiler bugs: Check for known Solidity compiler vulnerabilities" +
            "\n• Floating pragma: Avoid ^ or >= in pragma statements" +
            "\n• Modern compiler: Use Solidity 0.8.0+ for built-in overflow protection" +
            "\n\nLEVEL M REQUIREMENTS:" +
            "\n• Handle external call errors: Properly manage call failures" +
            "\n• Protect external calls: Only call audited, controlled contracts" +
            "\n• Avoid read-only reentrancy: Protect against state reading during reentrancy" +
            "\n• Document special code: Explain use of assembly, external calls, etc." +
            "\n• Safe overflow/underflow: Guard arithmetic when needed" +
            "\n• Sources of randomness: Use cryptographically secure randomness" +
            "\n• Don't misuse block data: Avoid block.timestamp/block.number for critical logic" +
            "\n• Proper signature verification: Validate signatures correctly" +
            "\n• No improper signature replay: Protect against signature reuse" +
            "\n• Homoglyph attacks: Check for misleading Unicode characters" +
            "\n\nLEVEL Q REQUIREMENTS:" +
            "\n• Document contract logic: Provide detailed business logic specification" +
            "\n• Document system architecture: Explain overall system design" +
            "\n• Document threat models: Identify and analyze potential attack vectors" +
            "\n• Implement as documented: Code must match documentation" +
            "\n• Enforce least privilege: Access controls must be minimal necessary" +
            "\n• Verify external calls: Ensure called contracts are safe" +
            "\n• Process all inputs: Validate and handle all possible inputs" +
            "\n• State changes trigger events: Emit events for all state modifications" +
            "\n• Protect against MEV: Mitigate miner extractable value attacks" +
            "\n• Protect against ordering attacks: Prevent transaction reordering exploits" +
            "\n• Protect against oracle failure: Handle oracle malfunctions" +
            "\n• Code linting: Follow Solidity best practices" +
            "\n\n--- SWC VULNERABILITY CLASSIFICATION ---" +
            "\nUse the following SWC (Smart Contract Weakness Classification) registry as your primary reference:" +
            "\n• SWC-136: Unencrypted Private Data On-Chain - Check for private data stored on-chain without encryption" +
            "\n• SWC-135: Code With No Effects - Check for unreachable code or statements with no effect" +
            "\n• SWC-134: Message call with hardcoded gas amount - Check for .call{ gas: 12345 } with fixed gas values" +
            "\n• SWC-133: Hash Collisions With Multiple Variable Length Arguments - Check for abi.encodePacked in hash functions" +
            "\n• SWC-132: Unexpected Ether balance - Check for contracts that unexpectedly receive ether" +
            "\n• SWC-131: Presence of unused variables - Check for declared but unused variables" +
            "\n• SWC-130: Right-To-Left-Override control character (U+202E) - Check for U+202E character in strings" +
            "\n• SWC-129: Typographical Error - Check for common typos in function/variable names" +
            "\n• SWC-128: DoS With Block Gas Limit - Check for unbounded loops that can exceed gas limits" +
            "\n• SWC-127: Arbitrary Jump with Function Type Variable - Check for function pointers used for jumps" +
            "\n• SWC-126: Insufficient Gas Griefing - Check for operations that can be griefed with insufficient gas" +
            "\n• SWC-125: Incorrect Inheritance Order - Check for inheritance order issues" +
            "\n• SWC-124: Write to Arbitrary Storage Location - Check for assembly or direct storage manipulation" +
            "\n• SWC-123: Requirement Violation - Check for violated business logic requirements" +
            "\n• SWC-122: Lack of Proper Signature Verification - Check for improper ecrecover usage" +
            "\n• SWC-121: Missing Protection against Signature Replay Attacks - Check for missing nonce validation" +
            "\n• SWC-120: Weak Sources of Randomness from Chain Attributes - Check for block.timestamp, block.number, etc. used for randomness" +
            "\n• SWC-119: Shadowing State Variables - Check for local variables shadowing state variables" +
            "\n• SWC-118: Incorrect Constructor Name - Check for function constructor() instead of constructor()" +
            "\n• SWC-117: Signature Malleability - Check for signature malleability issues" +
            "\n• SWC-116: Block values as a proxy for time - Check for block.timestamp used for time-dependent logic" +
            "\n• SWC-115: Authorization through tx.origin - Check for authentication using tx.origin" +
            "\n• SWC-114: Transaction Order Dependence - Check for front-running vulnerabilities" +
            "\n• SWC-113: DoS with Failed Call - Check for require() on external calls that can fail" +
            "\n• SWC-112: Delegatecall to Untrusted Callee - Check for delegatecall to user-controlled addresses" +
            "\n• SWC-111: Use of Deprecated Solidity Functions - Check for suicide, sha3, callcode usage" +
            "\n• SWC-110: Assert Violation - Check for assert() usage that can consume all gas" +
            "\n• SWC-109: Uninitialized Storage Pointer - Check for uninitialized storage variables" +
            "\n• SWC-108: State Variable Default Visibility - Check for state variables without explicit visibility" +
            "\n• SWC-107: Reentrancy - Check for external calls before state updates" +
            "\n• SWC-106: Unprotected SELFDESTRUCT Instruction - Check for selfdestruct without access control" +
            "\n• SWC-105: Unprotected Ether Withdrawal - Check for send/transfer without proper checks" +
            "\n• SWC-104: Unchecked Call Return Value - Check for missing return value checks on low-level calls" +
            "\n• SWC-103: Floating Pragma - Check for pragma statements using ^ or >=" +
            "\n• SWC-102: Outdated Compiler Version - Check for compiler versions older than 0.8.0" +
            "\n• SWC-101: Integer Overflow and Underflow - Check for arithmetic operations without SafeMath (pre-0.8.0)" +
            "\n• SWC-100: Function Default Visibility - Check for functions without explicit visibility modifiers" +
            "\n\n--- ANALYSIS METHODOLOGY ---" +
            "\n1. CALCULATE SCORE: Start at 100. Subtract points: Critical=-20, High=-10, Medium=-4, Low=-2, Informational=-0.5, Gas=-0.2. The final score MUST be calculated." +
            "\n2. VULNERABILITIES: For each finding, provide the SWC ID, title, description, and the line numbers." +
            "\n3. CROSS-REFERENCE: Compare findings against ETA registry requirements and SWC classifications." +
            "\n4. COMPREHENSIVE: Check for all SWC vulnerabilities and ETA security level requirements."
        );
    }, []);
};

// --- 3. Deterministic HTML Generation from JSON Counts (Matching the Screenshot) ---

const generateAuditHTML = (auditData: AuditData): string => {
    // Helper to get color classes based on severity
    const getColorClass = (severity: string): string => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'bg-red-700 text-white';
            case 'high': return 'bg-orange-600 text-white';
            case 'medium': return 'bg-yellow-500 text-gray-900';
            case 'low': return 'bg-blue-500 text-white';
            case 'informational': return 'bg-gray-500 text-white';
            case 'gas': return 'bg-cyan-500 text-white';
            default: return 'bg-gray-700 text-white';
        }
    };

    // Pill rendering for the Threat Summary section
    const renderPill = (severity: string, count: number): string => `
        <div class="pill-container flex flex-col items-center rounded-lg ${getColorClass(severity)} shadow-lg transform transition-transform hover:scale-105">
            <span class="text-lg sm:text-xl md:text-2xl font-bold">${count}</span>
            <span class="text-xs sm:text-sm font-semibold mt-1">${severity}</span>
        </div>
    `;

    // Detailed Findings rendering
    const renderDetailedFindings = (vulnerability: Vulnerability): string => `
        <div class="bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl mb-3 sm:mb-4 border-l-4 ${vulnerability.severity === 'Critical' ? 'border-red-500' : vulnerability.severity === 'High' ? 'border-orange-500' : vulnerability.severity === 'Medium' ? 'border-yellow-500' : 'border-gray-500'}">
            <span class="text-xs font-bold ${getColorClass(vulnerability.severity)} px-2 py-1 rounded-full uppercase">${vulnerability.severity}</span>
            <h3 class="text-base sm:text-lg md:text-xl font-bold mt-2 text-gray-100 break-words">${vulnerability.title || 'N/A'}
                ${vulnerability.swcId ? `<span class="text-xs sm:text-sm font-normal text-gray-400">(${vulnerability.swcId})</span>` : ''}
            </h3>
            <p class="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                ${vulnerability.description || 'No detailed description provided.'}
            </p>
            ${vulnerability.lineNumbers && vulnerability.lineNumbers.length > 0 ? `
                <p class="mt-2 text-xs text-[#F8F442] break-words">Lines: ${vulnerability.lineNumbers.join(', ')}</p>
            ` : ''}
        </div>
    `;

    // Generate SVG circular progress for the full report
    const generateCircularProgressSVG = (score: number): string => {
        const size = 120;
        const strokeWidth = 8;
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (score / 100) * circumference;

        // Color logic based on score
        const getColor = (score: number) => {
            if (score >= 90) return '#10B981'; // Green
            if (score >= 80) return '#F59E0B'; // Yellow/Orange
            if (score >= 60) return '#F97316'; // Orange
            return '#EF4444'; // Red
        };

        const color = getColor(score);

        return `
            <svg width="${size}" height="${size}" style="filter: drop-shadow(0 0 6px ${color}40);">
                <!-- Background circle -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    stroke="#374151"
                    stroke-width="${strokeWidth}"
                    fill="transparent"
                />
                <!-- Progress circle -->
                <circle
                    cx="${size / 2}"
                    cy="${size / 2}"
                    r="${radius}"
                    stroke="${color}"
                    stroke-width="${strokeWidth}"
                    fill="transparent"
                    stroke-dasharray="${strokeDasharray}"
                    stroke-dashoffset="${strokeDashoffset}"
                    stroke-linecap="round"
                    style="transition: all 0.5s ease-out; transform: rotate(-90deg); transform-origin: center;"
                />
                <!-- Score text in center -->
                <text
                    x="${size / 2}"
                    y="${size / 2}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    fill="${color}"
                    font-size="18"
                    font-weight="bold"
                    font-family="Inter, sans-serif"
                >
                    ${score}/100
                </text>
            </svg>
        `;
    };

    const scoreColor = auditData.securityScore >= 90 ? '#4CAF50' : auditData.securityScore >= 80 ? '#FFC107' : '#F44336';
    const totalVulnerabilities = Object.values(auditData.vulnerabilityBreakdown).reduce((acc: number, count: number) => acc + count, 0);
    const scoreClass = auditData.securityScore >= 90 ? 'score-high' : auditData.securityScore >= 80 ? 'score-medium' : 'score-low';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartSentinels AI Audit Report - ${auditData.contractName || 'Contract'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { box-sizing: border-box; }
        body { 
            background-color: #1F1F1F; 
            color: #E0E0E0; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        .text-neon { color: #F8F442; }
        
        /* Responsive Logo */
        .logo-img {
            height: 50px;
            width: auto;
            max-width: 200px;
            object-fit: contain;
        }
        
        @media (min-width: 640px) {
            .logo-img { height: 60px; max-width: 220px; }
        }
        
        @media (min-width: 768px) {
            .logo-img { height: 70px; max-width: 250px; }
        }
        
        @media (min-width: 1024px) {
            .logo-img { height: 80px; max-width: 280px; }
        }
        
        .header-bg { 
            background-color: #0d0d0d;
            padding: 1rem;
        }
        
        @media (min-width: 640px) {
            .header-bg { padding: 1.5rem; }
        }
        
        /* Print-specific optimizations for page 1 */
        @media print {
            .header-bg {
                padding: 0.5rem !important;
                margin-bottom: 1rem !important;
            }
            
            .logo-img {
                height: 90px !important;
                max-height: 90px !important;
                margin-bottom: 0.25rem !important;
            }
            
            .report-title {
                font-size: 1.5rem !important;
                margin: 0.5rem 0 !important;
                line-height: 1.2 !important;
            }
            
            .container-responsive {
                padding-left: 0.75rem !important;
                padding-right: 0.75rem !important;
            }
            
            /* Tighter spacing for Project Details and Security Score */
            .grid.grid-cols-1.lg\\:grid-cols-3 {
                gap: 1rem !important;
                margin-bottom: 1.5rem !important;
            }
            
            .bg-gray-800,
            .score-box {
                padding: 1rem !important;
            }
            
            .section-header {
                margin-bottom: 0.75rem !important;
                font-size: 1rem !important;
            }
            
            .text-xs.sm\\:text-sm.space-y-1\\.5.sm\\:space-y-2 {
                line-height: 1.4 !important;
            }
            
            .text-xs.sm\\:text-sm.space-y-1\\.5.sm\\:space-y-2 p {
                margin-bottom: 0.25rem !important;
            }
            
            .score-circle {
                width: 130px !important;
                height: 130px !important;
                font-size: 2rem !important;
                border-width: 6px !important;
            }
            
            .text-gray-300.text-xs.sm\\:text-sm {
                font-size: 0.8rem !important;
                line-height: 1.4 !important;
            }
        }
        
        /* SmartSentinels Seal/Holo - Footer */
        .ss-seal {
            width: 80px;
            height: 80px;
            object-fit: contain;
            opacity: 0.85;
            filter: drop-shadow(0 0 8px rgba(248, 244, 66, 0.3));
            transition: all 0.3s ease;
            display: inline-block;
        }
        
        .ss-seal:hover {
            opacity: 1;
            transform: scale(1.05);
            filter: drop-shadow(0 0 12px rgba(248, 244, 66, 0.5));
        }
        
        @media (min-width: 640px) {
            .ss-seal { width: 100px; height: 100px; }
        }
        
        @media (min-width: 768px) {
            .ss-seal { width: 120px; height: 120px; }
        }
        
        @media (min-width: 1024px) {
            .ss-seal { width: 140px; height: 140px; }
        }
        
        /* Neon text shadow for headers */
        .neon-header { text-shadow: 0 0 10px #F8F442; }
        .score-box { background-color: #0d0d0d; border-radius: 1rem; }
        
        /* Responsive Typography */
        .report-title {
            font-size: 1.25rem;
            line-height: 1.3;
        }
        
        @media (min-width: 640px) {
            .report-title { font-size: 1.5rem; }
        }
        
        @media (min-width: 768px) {
            .report-title { font-size: 2rem; }
        }
        
        @media (min-width: 1024px) {
            .report-title { font-size: 2.5rem; }
        }
        
        /* Inline Logo */
        .inline-logo {
            height: 1.25rem;
            width: auto;
            object-fit: contain;
        }
        
        @media (min-width: 640px) {
            .inline-logo { height: 1.5rem; }
        }
        
        @media (min-width: 768px) {
            .inline-logo { height: 2rem; }
        }
        
        @media (min-width: 1024px) {
            .inline-logo { height: 2.5rem; }
        }
        
        /* Responsive Section Headers */
        .section-header {
            font-size: 1.125rem;
        }
        
        @media (min-width: 640px) {
            .section-header { font-size: 1.25rem; }
        }
        
        @media (min-width: 768px) {
            .section-header { font-size: 1.5rem; }
        }
        
        /* Ensure containers don't overflow */
        .container-responsive {
            max-width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
        }
        
        @media (min-width: 640px) {
            .container-responsive { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        
        @media (min-width: 1024px) {
            .container-responsive { max-width: 1280px; margin: 0 auto; }
        }
        
        /* Responsive Pill Sizing */
        .pill-container {
            padding: 0.5rem;
        }
        
        @media (min-width: 640px) {
            .pill-container { padding: 0.75rem; }
        }
        
        @media (min-width: 768px) {
            .pill-container { padding: 1rem; }
        }
        
        /* Score status badge responsive */
        .score-status {
            font-size: 0.625rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.5rem;
            background: rgba(255,255,255,0.1);
            display: inline-block;
            margin-top: 0.5rem;
        }
        
        @media (min-width: 640px) {
            .score-status { font-size: 0.75rem; }
        }
        
        /* Ensure images and content don't overflow */
        img { max-width: 100%; height: auto; }
        
        /* Download PDF Button - Static in footer, not fixed */
        .download-pdf-container {
            text-align: center;
            margin-top: 2rem;
            padding-bottom: 1rem;
        }
        
        .download-pdf-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #F8F442 0%, #D4C93D 100%);
            color: #000;
            border: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(248, 244, 66, 0.4);
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        
        .download-pdf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(248, 244, 66, 0.6);
            background: linear-gradient(135deg, #FFE84D 0%, #E0D442 100%);
        }
        
        .download-pdf-btn:active {
            transform: translateY(0px);
        }
        
        @media (max-width: 768px) {
            .download-pdf-btn {
                padding: 12px 20px;
                font-size: 0.9rem;
            }
        }
        
        /* ===== PRINT STYLES - Perfect Document Printing ===== */
        @media print {
            /* Hide the download button when printing */
            .download-pdf-container,
            .download-pdf-btn {
                display: none !important;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            body {
                background-color: #1F1F1F !important;
                color: #E0E0E0 !important;
                margin: 0;
                padding: 0;
            }
            
            /* Ensure full page background */
            html {
                background-color: #1F1F1F !important;
            }
            
            /* Remove white margins */
            @page {
                size: auto;
                margin: 0.75in 0.5in;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #1F1F1F;
                z-index: -1;
            }
            
            /* Custom page headers and footers */
            @page {
                margin: 0.75in 0.5in;
                background-color: #1F1F1F;
                @top-left {
                    content: "";
                }
                @top-center {
                    content: "";
                }
                @top-right {
                    content: "";
                }
                @bottom-left {
                    content: "smartsentinels.net/hub/audit-result";
                    font-size: 9pt;
                    color: #E6E6E6;
                    font-family: 'Inter', sans-serif;
                }
                @bottom-center {
                    content: "";
                }
                @bottom-right {
                    content: counter(page) " / " counter(pages);
                    font-size: 9pt;
                    color: #E6E6E6;
                    font-family: 'Inter', sans-serif;
                }
            }
            
            /* Prevent page breaks inside critical elements */
            .audit-dashboard-widget,
            .pill-container,
            .score-box,
            header {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            
            /* Ensure Threat Summary starts on new page */
            section[style*="page-break-before"] {
                page-break-before: always !important;
                break-before: page !important;
            }
            
            /* Control page breaks before/after sections */
            section {
                page-break-inside: auto !important;
                break-inside: auto !important;
            }
            
            /* Individual findings can break if necessary */
            .bg-gray-800.p-3 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 0.75rem !important;
            }
            
            /* Section headers should stay with at least one finding */
            section h2 {
                page-break-after: avoid !important;
                break-after: avoid !important;
                page-break-inside: avoid !important;
            }
            
            /* Keep header with first content */
            header {
                page-break-after: avoid !important;
                break-after: avoid !important;
            }
            
            /* Footer should break naturally if needed */
            footer {
                page-break-before: auto !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-top: 2rem !important;
                padding-bottom: 1rem !important;
            }
            
            /* Handle long content gracefully */
            .container-responsive {
                max-width: 100% !important;
                padding: 1rem !important;
            }
            
            /* Maintain grid layout for pills in print */
            .grid {
                display: grid !important;
            }
            
            .grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
            
            @media print and (min-width: 640px) {
                .sm\\:grid-cols-3 {
                    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                }
            }
            
            @media print and (min-width: 1024px) {
                .lg\\:grid-cols-6 {
                    grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
                }
            }
            
            .pill-container {
                margin-bottom: 0 !important;
                padding: 0.5rem !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 60px !important;
            }
            
            /* Adjust logo for print */
            .logo-img {
                max-height: 45px !important;
                margin-bottom: 1rem !important;
            }
            
            /* Ensure score circle prints properly */
            .score-circle {
                border: 4px solid #000 !important;
                page-break-inside: avoid !important;
            }
            
            /* Make text readable in print */
            h1, h2, h3, h4, h5, h6 {
                color: #E0E0E0 !important;
            }
            
            .text-neon {
                color: #F8F442 !important;
                text-shadow: 0 0 10px rgba(248, 244, 66, 0.3) !important;
            }
            
            .neon-header {
                text-shadow: 0 0 10px rgba(248, 244, 66, 0.3) !important;
            }
            
            /* Adjust backgrounds for print - Keep dark theme */
            .bg-gray-800,
            .score-box,
            .header-bg {
                background-color: #0d0d0d !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
            }
            
            .text-gray-300,
            .text-gray-400 {
                color: #b0b0b0 !important;
            }
            
            /* Severity badges - ensure colors print */
            .bg-red-700 { background-color: #b91c1c !important; }
            .bg-orange-600 { background-color: #ea580c !important; }
            .bg-yellow-500 { background-color: #eab308 !important; }
            .bg-blue-500 { background-color: #3b82f6 !important; }
            .bg-gray-500 { background-color: #6b7280 !important; }
            .bg-cyan-500 { background-color: #06b6d4 !important; }
            
            /* Ensure text remains readable on colored backgrounds */
            .pill-container,
            .bg-red-700,
            .bg-orange-600,
            .bg-yellow-500,
            .bg-blue-500,
            .bg-gray-500,
            .bg-cyan-500 {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Print disclaimer clearly */
            footer p {
                color: #b0b0b0 !important;
                font-size: 10pt !important;
            }
            
            /* SmartSentinels seal positioning for print */
            .ss-seal {
                position: static !important;
                display: block !important;
                margin: 0 !important;
                opacity: 0.7 !important;
                width: 80px !important;
                height: 80px !important;
            }
            
            /* Footer should contain seal properly */
            footer {
                position: relative !important;
            }
            
            footer .flex {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 1rem !important;
            }
            
            footer .flex-1 {
                flex: 1 !important;
            }
            
            footer .flex-shrink-0 {
                flex-shrink: 0 !important;
            }
            
            /* Hide download button container in print */
            .download-pdf-container {
                display: none !important;
            }
            
            /* Border colors for print */
            .border-gray-700,
            .border-l-4 {
                border-color: rgba(255,255,255,0.1) !important;
            }
            
            .border-red-500 { border-color: #ef4444 !important; }
            .border-orange-500 { border-color: #f97316 !important; }
            .border-yellow-500 { border-color: #eab308 !important; }
            
            /* Handle very long reports - allow natural breaks in findings list */
            section:last-of-type {
                page-break-inside: auto !important;
                break-inside: auto !important;
            }
            
            section:last-of-type .bg-gray-800 {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
            
            /* If there are many findings, allow section to span multiple pages */
            section:last-of-type > div {
                page-break-inside: auto !important;
            }
            
            /* Orphan/widow control */
            p, h1, h2, h3, h4, h5, h6 {
                orphans: 3;
                widows: 3;
            }
            
            /* Shadow removal for print clarity */
            .score-box,
            .pill-container {
                box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
            }
        }
        
        /* ===== END PRINT STYLES ===== */
    </style>
</head>
<body class="bg-[#1F1F1F]">

    <header class="text-center header-bg rounded-none sm:rounded-t-xl mb-4 sm:mb-6 md:mb-8">
        <div class="flex items-center justify-center gap-3 px-2">
            <img src="${LOGO_URL}" alt="SmartSentinels Logo" class="inline-logo"/>
            <h1 class="report-title font-extrabold text-neon neon-header">SMARTSENTINELS AI AUDIT REPORT</h1>
        </div>
    </header>

    <div class="container-responsive">
        
        <!-- Project Details and Security Score -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div class="lg:col-span-1 bg-gray-800 p-4 sm:p-5 md:p-6 rounded-xl border border-gray-700">
                <h2 class="section-header font-bold text-neon mb-3 sm:mb-4">Project Details</h2>
                <div class="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                    <p class="break-words"><strong>Contract:</strong> ${auditData.contractName || 'N/A'}</p>
                    <p><strong>Version:</strong> Solidity ${auditData.version || 'N/A'}</p>
                    <p><strong>Auditor:</strong> SmartSentinels AI</p>
                    <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
                    ${auditData.transactionHash ? `
                    <p class="break-all"><strong>TX Hash:</strong> 
                        <a href="https://testnet.bscscan.com/tx/${auditData.transactionHash}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="text-neon hover:underline"
                           style="word-break: break-all;">
                            ${auditData.transactionHash.slice(0, 10)}...${auditData.transactionHash.slice(-8)}
                        </a>
                    </p>
                    ` : ''}
                </div>
            </div>

            <div class="lg:col-span-2 score-box p-4 sm:p-5 md:p-6 rounded-xl border border-gray-700 flex items-center gap-6">
                <div class="flex-1">
                    <h2 class="section-header font-bold text-neon mb-3 sm:mb-4">Security Score</h2>
                    <p class="text-gray-300 text-xs sm:text-sm leading-relaxed">${auditData.overallAssessment || 'The contract demonstrates a high level of security. Minor issues identified, mainly related to gas optimization and design considerations, but no critical vulnerabilities found.'}</p>
                </div>
                <div class="flex-shrink-0 text-center">
                    ${generateCircularProgressSVG(auditData.securityScore || 0)}
                    <div class="score-status text-${scoreColor === '#4CAF50' ? 'green' : scoreColor === '#FFC107' ? 'yellow' : 'red'}-400 font-bold mt-2">
                        ${auditData.securityScore >= 90 ? 'EXCELLENT' : auditData.securityScore >= 80 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Threat Summary (starts on new page in print) -->
        <section class="mb-6 sm:mb-8" style="page-break-before: always;">
            <h2 class="section-header font-bold text-neon mb-3 sm:mb-4 border-b border-gray-700 pb-2 neon-header">Threat Summary</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4" style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.5rem;">
                ${renderPill('Critical', auditData.vulnerabilityBreakdown?.Critical || 0)}
                ${renderPill('High', auditData.vulnerabilityBreakdown?.High || 0)}
                ${renderPill('Medium', auditData.vulnerabilityBreakdown?.Medium || 0)}
                ${renderPill('Low', auditData.vulnerabilityBreakdown?.Low || 0)}
                ${renderPill('Informational', auditData.vulnerabilityBreakdown?.Informational || 0)}
                ${renderPill('Gas', auditData.vulnerabilityBreakdown?.Gas || 0)}
            </div>
            <p class="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4">Total ${totalVulnerabilities} findings identified across all categories.</p>
        </section>
        
        <!-- Detailed Findings -->
        <section class="mb-6 sm:mb-8">
            <h2 class="section-header font-bold text-neon mb-3 sm:mb-4 border-b border-gray-700 pb-2 neon-header">Detailed Findings</h2>
            ${auditData.vulnerabilities?.length > 0 
                ? auditData.vulnerabilities.map(renderDetailedFindings).join('') 
                : '<p class="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No significant security vulnerabilities found.</p>'}
        </section>

    </div>

    <footer class="container-responsive border-t border-gray-700 mt-6 sm:mt-8 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-xs sm:text-sm leading-relaxed text-gray-500 flex-1 text-center sm:text-left px-2">
                Disclaimer: This audit report was generated by the SmartSentinels AI Agent using a deterministic analysis model trained on the EEA EthTrust Security Levels Specification (ETA Registry) and Smart Contract Weakness Classification (SWC Registry). While this analysis provides comprehensive automated security assessment, users are encouraged to complement AI findings with additional review approaches for maximum assurance. SmartSentinels cannot be held responsible for misinterpretations or misuse of this report.
            </p>
            
            <!-- SmartSentinels Authentication Seal - Right Side -->
            <div class="flex-shrink-0">
                <img src="/ssHoloNew.svg" alt="SmartSentinels Verified" class="ss-seal" title="Verified SmartSentinels Audit Report" />
            </div>
        </div>
    </footer>

    <!-- Download PDF Button - Static, centered, below footer -->
    <div class="download-pdf-container">
        <button onclick="window.print()" class="download-pdf-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
        </button>
    </div>

</body>
</html>`;

    return html;
};

// --- 6. Main Audit Feature Component ---

interface AuditFeatureProps {
    showTitle?: boolean;
    showDescription?: boolean;
}

const SidebarAIAuditSmartContract: React.FC<AuditFeatureProps> = ({ showTitle = true, showDescription = true }) => {
    // Basic state
    const [code, setCode] = useState('');
    const [auditData, setAuditData] = useState<AuditData | null>(null);
    const [statusMessage, setStatusMessage] = useState("SmartSentinels AI Audit Agent is here for you! Paste your Solidity code and run the audit.");
    const [remediation, setRemediation] = useState<RemediationState>({ title: '', code: '', loading: false });
    
    // Processing states
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Transaction states
    const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | undefined>(undefined);
    const [paymentTxHash, setPaymentTxHash] = useState<`0x${string}` | undefined>(undefined);
    const [currentTransactionType, setCurrentTransactionType] = useState<'approve' | 'payAndRunAudit' | null>(null);
    
    // Messages
    const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

    const systemPrompt = useAuditPrompt();
    
    // Wallet connection
    const { address, isConnected, chain } = useAccount();
    
    // Get SSTL token decimals
    const { data: tokenDecimals } = useReadContract({
        address: SSTL_CONTRACT,
        abi: SSTL_TOKEN_ABI as any,
        functionName: 'decimals',
        chainId: chain?.id,
    });
    
    // Get SSTL balance
    const { data: sstlBalance, refetch: refetchBalance } = useReadContract({
        address: SSTL_CONTRACT,
        abi: SSTL_TOKEN_ABI as any,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: chain?.id,
        query: { enabled: !!address && isConnected, refetchInterval: 3000 }
    });

    // Check allowance for Gateway contract
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: SSTL_CONTRACT,
        abi: SSTL_TOKEN_ABI as any,
        functionName: 'allowance',
        args: address ? [address, AUDIT_GATEWAY_ADDRESS] : undefined,
        chainId: chain?.id,
        query: { enabled: !!address && isConnected }
    });
    
    // Token approval/transfer hooks
    const { writeContract, data: txHash, error: transferError, isPending: isTransferPending, reset: resetTransfer } = useWriteContract();
    
    // Wait for transaction confirmation
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Handle transaction completion and error states
    useEffect(() => {
        if (currentTransactionType === 'approve') {
            if (transferError) {
                // Handle error states in sequence to prevent race conditions
                setStatusMessage('Transaction was cancelled or failed.');
                setTimeout(() => {
                    setStatusMessage('Please try approving again when ready.');
                    setIsProcessing(false);
                    setCurrentTransactionType(null);
                    setApprovalTxHash(undefined);
                }, 100);
            } else if (isConfirmed && txHash) {
                // Store approval transaction hash
                setApprovalTxHash(txHash);
                setStatusMessage('Approval successful! You can now proceed with payment.');
                setIsProcessing(false);
                setCurrentTransactionType(null);
            }
        } else if (currentTransactionType === 'payAndRunAudit') {
            if (transferError) {
                // Handle payment error states in sequence
                setStatusMessage('Payment transaction was cancelled or failed.');
                setTimeout(() => {
                    setPaymentMessage('Please try payment again.');
                    setIsProcessing(false);
                    setCurrentTransactionType(null);
                }, 100);
            } else if (isConfirmed && txHash) {
                // Store payment transaction hash and start audit
                setPaymentTxHash(txHash);
                setStatusMessage('Payment successful! 67 SSTL tokens will be minted. Starting AI Audit...');
                // Start the audit with the payment transaction hash
                handleSimpleAudit(txHash);
                setTimeout(async () => {
                    setApprovalMessage(null);
                    setPaymentMessage('Starting AI audit...');
                    setPaymentTxHash(txHash);
                    setCurrentTransactionType(null);
                    
                    // Start the audit process with the payment hash
                    handleSimpleAudit(txHash);
                }, 100);
            }
        }
    }, [isConfirmed, transferError, currentTransactionType, refetchAllowance, txHash]);

    // Check if approval was successful by monitoring allowance
    useEffect(() => {
        if (currentTransactionType === 'approve' && !isProcessing) {
            if (allowance !== undefined && allowance !== null && typeof allowance === 'bigint' && tokenDecimals) {
                const decimals = Number(tokenDecimals);
                const requiredAmount = parseUnits(AUDIT_COST, decimals);
                const hasAllowance = allowance >= requiredAmount;
                
                console.log('🔍 Allowance check:', {
                    current: allowance.toString(),
                    required: requiredAmount.toString(),
                    hasAllowance
                });
                
                if (hasAllowance) {
                    setStatusMessage('SSTL tokens approved successfully! You can now proceed with payment.');
                }
            }
        }
    }, [allowance, tokenDecimals]);

    const handleApproveSSTL = async () => {
        if (!isConnected || !address) {
            setStatusMessage('Please connect your wallet first');
            return;
        }

        if (!code.trim()) {
            setStatusMessage('Please upload a smart contract first');
            return;
        }

        try {
            setStatusMessage('Approving SSTL tokens...');
            setIsProcessing(true);
            setCurrentTransactionType('approve');

            const decimals = Number(tokenDecimals);
            const approvalAmount = parseUnits(AUDIT_COST, decimals);

            console.log('🚀 Approving SSTL tokens:', {
                amount: approvalAmount.toString(),
                spender: AUDIT_GATEWAY_ADDRESS,
                serviceOwner: SERVICE_OWNER
            });

            console.log('Sending approval transaction:', {
                spender: AUDIT_GATEWAY_ADDRESS,
                amount: formatUnits(approvalAmount, decimals),
            });

            writeContract({
                address: SSTL_TOKEN_ADDRESS,
                abi: SSTL_TOKEN_ABI as any,
                functionName: 'approve',
                args: [AUDIT_GATEWAY_ADDRESS, approvalAmount],
                chain: chain,
                account: address
            });
        } catch (error) {
            console.error('❌ Approval error:', error);
            setApprovalMessage('Approval failed: ' + (error as Error).message);
            setIsProcessing(false);
        }
    };

    const handlePayAndRunAudit = async () => {
        if (!isConnected || !address) {
            setStatusMessage('Please connect your wallet first');
            return;
        }

        if (!code.trim()) {
            setStatusMessage('Please upload a smart contract first');
            return;
        }

        if (!approvalTxHash) {
            setStatusMessage('Please approve SSTL tokens first');
            return;
        }

        // Check if we have enough allowance
        if (allowance !== undefined && allowance !== null && typeof allowance === 'bigint' && tokenDecimals) {
            const decimals = Number(tokenDecimals);
            const requiredAmount = parseUnits(AUDIT_COST, decimals);
            
            console.log('Pre-payment allowance check:', {
                currentAllowance: allowance.toString(),
                requiredAmount: requiredAmount.toString(),
                hasEnoughAllowance: allowance >= requiredAmount
            });

            if (allowance < requiredAmount) {
                setStatusMessage('Insufficient allowance. Please approve SSTL tokens first.');
                return;
            }
        }

        try {
            setStatusMessage('Processing payment for AI Audit...');
            setCurrentTransactionType('payAndRunAudit');

            const decimals = Number(tokenDecimals);
            // Use BigInt directly to ensure exact value
            const amount = BigInt('0x3a357573'); // Use the specified amount

            console.log('💰 Paying for audit:', {
                gateway: AUDIT_GATEWAY_ADDRESS,
                amount: amount.toString(), // Amount in wei
                amountWei: amount.toString(), // Full amount in wei
                serviceOwner: '0x46e451d555ebCB4ccE5087555a07F6e69D017b05'
            });

            writeContract({
                address: AUDIT_GATEWAY_ADDRESS,
                abi: AUDIT_GATEWAY_ABI as any,
                functionName: 'payAndRunAudit',
                args: [amount], // Pass the exact BigInt amount
                chain: chain,
                account: address
            });
        } catch (error) {
            console.error('❌ Payment error:', error);
            setPaymentMessage('Payment failed: ' + (error as Error).message);
            setCurrentTransactionType(null);
        }
    };

    const handleViewReport = () => {
        if (auditData) {
            const htmlContent = generateAuditHTML(auditData);
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
            }
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setCode(result);
                    setAuditData(null);
                    setApprovalTxHash(undefined);
                    setPaymentTxHash(undefined);
                    setIsProcessing(false);
                    setCurrentTransactionType(null);
                    setRemediation({ title: '', code: '', loading: false });
                    setStatusMessage('Ready for SSTL approval and payment.');
                    // Reset the file input so the same file can be uploaded again
                    event.target.value = '';
                }
            };
            reader.readAsText(file);
        }
    };

  const callGeminiApi = async (payload: { contents: any[], systemInstruction: { parts: { text: string }[] } }): Promise<any> => {
    let attempt = 0;
    const maxRetries = 3;
    let delay = 2000;

    const apiUrl = API_URL_TEMPLATE + GEMINI_API_KEY;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: payload.contents,
                    systemInstruction: payload.systemInstruction,
                    generationConfig: {
                        temperature: 0.0,    // Purely deterministic
                        topP: 0.1,           // Restrictive sampling
                        topK: 1,             // Most probable token only
                        candidateCount: 1,
                        maxOutputTokens: 8192,
                        responseMimeType: "application/json",
                        responseSchema: AUDIT_REPORT_SCHEMA,
                    },
                })
            });

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(`CRITICAL: HTTP 400 Payload Error. Check schema size or contract length.`);
                }
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Retrying due to API status: ${response.status}`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const content = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!content) {
                const reason = result.candidates?.[0]?.finishReason || 'Unknown failure.';
                throw new Error(`AI generated no content. Reason: ${reason}`);
            }

            const auditData = JSON.parse(content.trim());
            return auditData;

        } catch (error) {
            attempt++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (attempt < maxRetries && errorMessage.includes("Retrying")) {
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } else {
                console.error("Gemini API call failed:", error);
                throw new Error(`Audit agent failed. Final error: ${errorMessage}.`);
            }
        }
    }
    throw new Error("Max retries reached without successful API call.");
  };

    const handleSimpleAudit = async (paymentTxHash: `0x${string}`) => {
        console.log('🎯 handleSimpleAudit called with payment:', paymentTxHash);

        if (!code.trim()) {
            setStatusMessage('Please upload a smart contract first');
            return;
        }

        setIsProcessing(true);
        setAuditData(null);
        setStatusMessage('Payment confirmed. AI Agent analyzing contract...');

        try {
            const payload = {
                contents: [{ parts: [{ text: `Analyze: \n${code}` }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            const structuredData = await callGeminiApi(payload);
            structuredData.transactionHash = txHash; // Use actual transaction hash

            // Always calculate vulnerability breakdown from vulnerabilities array since AI may not count correctly
            const breakdown = {
                Critical: 0,
                High: 0,
                Medium: 0,
                Low: 0,
                Informational: 0,
                Gas: 0
            };

            console.log('AI response structure:', structuredData);
            console.log('Vulnerabilities exists:', !!structuredData.vulnerabilities);
            console.log('Vulnerabilities is array:', Array.isArray(structuredData.vulnerabilities));

            if (structuredData.vulnerabilities && Array.isArray(structuredData.vulnerabilities)) {
                console.log('Vulnerabilities array:', structuredData.vulnerabilities);
                structuredData.vulnerabilities.forEach((vuln: any, index: number) => {
                    const severity = vuln.severity;
                    console.log(`Vulnerability ${index}:`, vuln);
                    console.log(`Severity value: "${severity}"`);
                    const severityLower = severity?.toLowerCase();
                    console.log(`Severity lowercase: "${severityLower}"`);
                    if (severityLower === 'critical') breakdown.Critical++;
                    else if (severityLower === 'high') breakdown.High++;
                    else if (severityLower === 'medium') breakdown.Medium++;
                    else if (severityLower === 'low') breakdown.Low++;
                    else if (severityLower === 'informational') breakdown.Informational++;
                    else if (severityLower === 'gas') breakdown.Gas++;
                    else console.log('Unknown severity:', severity);
                });
            }

            console.log('Final breakdown before setting:', breakdown);

            // Always override the AI's breakdown with our calculation
            const correctedData = {
                ...structuredData,
                vulnerabilityBreakdown: { ...breakdown }
            };

            setAuditData(correctedData);
            setIsProcessing(false);
            // Shorten tx hash and create BscScan testnet link
            const shortTxHash = txHash ? `0x${txHash.slice(2,5)}...${txHash.slice(-5)}` : '';
            const bscScanUrl = `https://testnet.bscscan.com/tx/${txHash}`;
            setStatusMessage(
              `Audit completed successfully! Transaction: <a href='${bscScanUrl}' target='_blank' rel='noopener noreferrer' style='color:#10B981;text-decoration:underline;'>${shortTxHash}</a>`
            );
        } catch (error: any) {
            console.error('❌ Audit failed:', error);
            setStatusMessage('Audit failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

  const startAIAudit = async (contractCode: string, txHash: `0x${string}`) => {
    try {
        // Update UI state
        setIsProcessing(true);
        setPaymentMessage('Starting AI audit analysis...');
        
        // Run the AI audit process
        await handleRunAudit(txHash);
        
        // Success! The handleRunAudit function will update the UI state
    } catch (error) {
        console.error('❌ AI Audit failed:', error);
        setPaymentMessage('AI Audit failed: ' + (error as Error).message);
        setIsProcessing(false);
    }
  };

  const handleRunAudit = useCallback(async (txHash: `0x${string}`) => {
    console.log('🎯 handleRunAudit called with tx:', txHash);
    setIsProcessing(true);
    setStatusMessage("AI Agent analyzing contract...");

    if (code.length > 50000) {
        setStatusMessage("Contract code is too long. Please upload a smaller contract (max 50KB).");
        setIsProcessing(false);
        return;
    }

    try {
        const payload = {
            contents: [{ parts: [{ text: `Analyze: \n${code}` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const structuredData = await callGeminiApi(payload);
        structuredData.transactionHash = txHash;

        // Always calculate vulnerability breakdown from vulnerabilities array since AI may not count correctly
        const breakdown = {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0,
            Informational: 0,
            Gas: 0
        };

        console.log('AI response structure:', structuredData);
        console.log('Vulnerabilities exists:', !!structuredData.vulnerabilities);
        console.log('Vulnerabilities is array:', Array.isArray(structuredData.vulnerabilities));

        if (structuredData.vulnerabilities && Array.isArray(structuredData.vulnerabilities)) {
            console.log('Vulnerabilities array:', structuredData.vulnerabilities);
            structuredData.vulnerabilities.forEach((vuln: any, index: number) => {
                const severity = vuln.severity;
                console.log(`Vulnerability ${index}:`, vuln);
                console.log(`Severity value: "${severity}"`);
                const severityLower = severity?.toLowerCase();
                console.log(`Severity lowercase: "${severityLower}"`);
                if (severityLower === 'critical') breakdown.Critical++;
                else if (severityLower === 'high') breakdown.High++;
                else if (severityLower === 'medium') breakdown.Medium++;
                else if (severityLower === 'low') breakdown.Low++;
                else if (severityLower === 'informational') breakdown.Informational++;
                else if (severityLower === 'gas') breakdown.Gas++;
                else console.log('Unknown severity:', severity);
            });
        }

        console.log('Final breakdown before setting:', breakdown);

        // Always override the AI's breakdown with our calculation
        const correctedData = {
            ...structuredData,
            vulnerabilityBreakdown: { ...breakdown }
        };

        setAuditData(correctedData);
        setIsProcessing(false);
        setStatusMessage("Audit complete! You can now view the report.");
        
    } catch (error: any) {
        console.error("Audit error:", error);
        setStatusMessage(`Audit failed: ${error.message}`);
        setIsProcessing(false);
    }
  }, [code, systemPrompt]);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-orbitron font-bold mb-4 sm:mb-6 neon-glow">AI Audit - Smart Contract Analysis</h1>
      <div className="space-y-4 sm:space-y-6">
        {/* AI Training Information */}
        <div className="audit-training-info bg-[#1f1f1f] border border-yellow-300/30 rounded-lg p-4 sm:p-6 md:p-8 mb-6 text-center shadow-lg shadow-yellow-500/10">
          <h4 className="text-primary mb-3 sm:mb-4 text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 sm:gap-3">
            <Brain size={20} className="text-primary" />
            SmartSentinels AI Training
          </h4>
          <div className="text-white text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
            <p className="mb-3 sm:mb-4">
              <strong className="text-primary">Research-Driven Training:</strong> <span>This AI agent was trained on comprehensive security research from the</span>
              <a href="https://entethalliance.github.io/eta-registry/security-levels-spec.html#sec-2-unicode"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-primary underline hover:text-yellow-300 ml-1">
                Ethereum Technical Alliance (ETA) Registry
              </a>
              <span>, ensuring industry-standard vulnerability detection.</span>
            </p>
            <p className="mb-3 sm:mb-4">
              <strong className="text-primary">SWC Registry Integration:</strong> <span>Trained on all <span className="text-primary">37 Smart Contract Weakness Classification</span> (SWC) vulnerabilities
              with detailed analysis patterns and remediation strategies.</span>
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm sm:text-base font-medium mb-2 font-orbitron">Paste Solidity Code:</label>
          <Textarea
            placeholder="Paste your Solidity code here or upload .sol file..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
          />
        </div>
        <div className="w-fit">
          <input type="file" id="file-upload-ts" accept=".sol" style={{ display: 'none' }} onChange={handleFileUpload} />
          <label htmlFor="file-upload-ts" className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-input rounded-md bg-background hover:bg-[#f8f422] hover:text-[#1f1f1f] cursor-pointer text-sm sm:text-base font-orbitron transition-colors">
            <Upload size={14} />
            Upload .sol File
          </label>
        </div>
        <div className="flex flex-col items-center gap-4">
          {!approvalTxHash ? (
            <Button 
              variant="hero" 
              className="font-orbitron text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3" 
              onClick={handleApproveSSTL} 
              disabled={isProcessing || !code.trim()}
            >
              {isProcessing && currentTransactionType === 'approve' ? 'Approving...' : 'Approve 1000 SSTL'}
            </Button>
          ) : !paymentTxHash ? (
            <Button 
              variant="hero" 
              className="font-orbitron text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3" 
              onClick={handlePayAndRunAudit} 
              disabled={isProcessing || !code.trim()}
            >
              {isProcessing && currentTransactionType === 'payAndRunAudit' ? 'Processing Payment...' : 'Pay 1000 SSTL & Start Audit'}
            </Button>
          ) : null}
          <p className="text-sm text-gray-400 text-center">
            Payment of 1000 SSTL is required to run the AI Audit.
            <br />
            67 SSTL will be minted after successful payment.
            {approvalTxHash && !paymentTxHash && (
              <><br /><span className="text-green-400">✓ SSTL Approved</span></>
            )}
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-600">
            <p className="text-center text-gray-300 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: statusMessage }} />
          </div>
        )}

        {/* Audit Results */}
        {auditData && (
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-600">
              <h3 className="text-lg sm:text-xl font-orbitron font-bold mb-3 sm:mb-4 text-green-400">Audit Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Contract Name:</p>
                  <p className="font-mono text-white">{auditData.contractName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Security Score:</p>
                  <div className="flex items-center justify-center mt-2">
                    <CircularProgress score={auditData.securityScore} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Overall Assessment:</p>
                <p className="text-white">{auditData.overallAssessment}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Vulnerability Breakdown:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <div className="text-red-400">Critical: {auditData.vulnerabilityBreakdown.Critical}</div>
                  <div className="text-orange-400">High: {auditData.vulnerabilityBreakdown.High}</div>
                  <div className="text-yellow-400">Medium: {auditData.vulnerabilityBreakdown.Medium}</div>
                  <div className="text-blue-400">Low: {auditData.vulnerabilityBreakdown.Low}</div>
                  <div className="text-purple-400">Informational: {auditData.vulnerabilityBreakdown.Informational}</div>
                  <div className="text-cyan-400">Gas: {auditData.vulnerabilityBreakdown.Gas}</div>
                </div>
              </div>

              {auditData.vulnerabilities && auditData.vulnerabilities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm sm:text-base text-gray-400 mb-2">Vulnerabilities Found:</p>
                  <div className="space-y-2 sm:space-y-3">
                    {auditData.vulnerabilities.slice(0, 3).map((vuln, index) => (
                      <div key={index} className="p-3 sm:p-4 bg-gray-700 rounded border-l-4 border-red-500">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                          <h4 className="font-bold text-red-400 text-sm sm:text-base">{vuln.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded self-start ${
                            vuln.severity === 'Critical' ? 'bg-red-900 text-red-200' :
                            vuln.severity === 'High' ? 'bg-orange-900 text-orange-200' :
                            vuln.severity === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-blue-900 text-blue-200'
                          }`}>
                            {vuln.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{vuln.description}</p>
                        {vuln.lineNumbers && vuln.lineNumbers.length > 0 && (
                          <p className="text-xs text-gray-500 mt-2">Lines: {vuln.lineNumbers.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-4 sm:mt-6">
                <Button variant="outline" onClick={handleViewReport} className="font-orbitron text-sm sm:text-base">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarAIAuditSmartContract;