# Vercel Deployment Guide for Zenith-Sentinel

## Project Overview
This is a Vite-based React TypeScript application for SmartSentinels, a decentralized AI agents platform. It integrates with Web3 (BSC/Binance Smart Chain) using Thirdweb, Wagmi, and Viem, and uses Google's Gemini API for AI functionality.

## Prerequisites
- Vercel account connected to your GitHub repository
- Thirdweb account with a project Client ID
- Google AI Studio account with Gemini API key
- Git repository pushed to GitHub

## Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (default for Vite)
- **Install Command**: `npm install`

## Environment Variables
Set the following environment variables in your Vercel project dashboard (Project Settings > Environment Variables). These are client-side variables (prefixed with `VITE_`) that will be exposed to the browser.

### Required Variables:
1. **VITE_THIRDWEB_CLIENT_ID**
   - Value: Your Thirdweb Client ID (get from https://thirdweb.com/dashboard/settings)
   - Description: Required for Web3 wallet connections and blockchain interactions

2. **VITE_GEMINI_API_KEY**
   - Value: Your Google Gemini API key (get from https://aistudio.google.com/app/apikey)
   - Description: Required for AI smart contract auditing functionality

### Scopes:
- Set both variables for **Production**, **Preview**, and **Development** environments
- No sensitive server-side secrets are needed as this is a client-side application

## Deployment Steps

### 1. Connect Repository to Vercel
1. Go to Vercel dashboard
2. Click "Add New..." > "Project"
3. Import your GitHub repository (`zenith-sentinel`)
4. Vercel should auto-detect it as a Vite project

### 2. Configure Build Settings
In the project settings:
- **Framework Preset**: Vite (should be auto-detected)
- **Root Directory**: Leave empty (root of repo)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)
- **Install Command**: `npm install` (default)

### 3. Add Environment Variables
1. Go to Project Settings > Environment Variables
2. Add the two required variables listed above
3. Set scope to "Production" initially
4. For staging/preview deployments, add the same variables with "Preview" scope

### 4. Deploy
1. Click "Deploy" in Vercel
2. Monitor the build logs for any errors
3. Once deployed, your app will be available at the generated Vercel URL

### 5. Custom Domain (Optional)
- Go to Project Settings > Domains
- Add your custom domain if desired
- Follow Vercel's DNS configuration instructions

## Post-Deployment Checks
- Verify wallet connection works (MetaMask, etc.)
- Test BSC mainnet/testnet interactions
- Check Gemini API integration in the AI audit feature
- Ensure responsive design on mobile/desktop
- Confirm all links and navigation work

## Security Notes
- The `.env` file in your repository contains sensitive API keys - ensure it's added to `.gitignore` before committing
- Never commit API keys to version control
- Use Vercel's encrypted environment variables for production

## Troubleshooting
- **Build fails**: Check Vercel logs for missing dependencies or env vars
- **Web3 not working**: Verify `VITE_THIRDWEB_CLIENT_ID` is set correctly
- **Gemini API errors**: Check `VITE_GEMINI_API_KEY` and API quota limits
- **404 errors**: Ensure routing is configured for SPA (Vite handles this automatically)

## Additional Configuration
No `vercel.json` is required for this project as it uses standard Vite settings. If you need custom redirects or headers, you can add a `vercel.json` file to the root.

## Dependencies Overview
- **Web3**: Thirdweb, Wagmi, Viem, Ethers
- **UI**: React, TailwindCSS, shadcn/ui, Framer Motion
- **Blockchain**: BSC Mainnet (Chain ID 56) and Testnet (Chain ID 97)
- **AI**: Google Gemini 2.0 Flash API

The application is fully client-side with no backend requirements, making it ideal for static hosting on Vercel.</content>
<parameter name="filePath">c:\Users\User\Desktop\zenith-sentinel\Vercel_Deployment_Guide.md