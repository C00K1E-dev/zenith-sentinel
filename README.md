# SmartSentinels - Decentralized AI Agents Platform

A futuristic web application for SmartSentinels, featuring decentralized AI agents powered by Proof of Useful Work. Built with React, TypeScript, TailwindCSS, and integrated with Thirdweb for Web3 functionality.

![SmartSentinels](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## 🚀 Features

- **Landing Page**: Beautiful glassmorphism design with hero section and content cards
- **Hub Dashboard**: Complete dashboard with sidebar navigation and stats
- **Wallet Integration**: Thirdweb Connect Wallet for seamless Web3 interactions
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Futuristic UI**: Neon glow effects, animated gradients, and smooth transitions
- **Token Sale**: Dedicated page for seed funding and token sale information

## 🎨 Design System

- **Primary Color**: #f8f442 (Neon Yellow)
- **Background**: #1f1f1f (Dark Gray)
- **Font**: Orbitron for headings, system fonts for body
- **Effects**: Glassmorphism, neon glows, gradient animations

## 📦 Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Web3**: Thirdweb SDK
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm (install via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Thirdweb account (free at [thirdweb.com](https://thirdweb.com))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd smartsentinelsv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Thirdweb**
   
   a. Visit [Thirdweb Dashboard](https://thirdweb.com/dashboard/settings)
   
   b. Create a new project or use existing one
   
   c. Copy your **Client ID**
   
   d. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   e. Add your Thirdweb Client ID to `.env`:
   ```
   VITE_THIRDWEB_CLIENT_ID=your_client_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

## 🏗️ Project Structure

```
smartsentinelsv2/
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   └── ContentCard.tsx
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Hub.tsx         # Dashboard layout
│   │   ├── HubFunding.tsx  # Token sale page
│   │   └── NotFound.tsx    # 404 page
│   ├── lib/                # Utilities
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Root component with providers
│   ├── index.css           # Global styles & design system
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── index.html             # HTML template
├── tailwind.config.ts     # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

## 🎯 Pages

### Landing Page (`/`)
- Hero section with animated background
- Feature cards explaining the platform
- Call-to-action buttons
- Footer with social links

### Hub Dashboard (`/hub`)
- Collapsible sidebar navigation
- General stats overview
- Personal stats cards
- Tabbed interface for NFTs, Agents, Rewards, and Activity

### Hub Sub-Pages
- `/hub/funding` - Token sale information
- `/hub/nfts` - NFTs & iNFTs Hub (Coming Soon)
- `/hub/audit` - AI Smart Contract Audit (Coming Soon)
- `/hub/devices` - Device Monitoring (Coming Soon)
- `/hub/create-agent` - Create Agent (Coming Soon)
- `/hub/marketplace` - Marketplace (Coming Soon)
- `/hub/staking` - Staking (Coming Soon)

## 🎨 Customization

### Design Tokens

All design tokens are defined in `src/index.css`. Modify the CSS variables to customize colors, spacing, and effects:

```css
:root {
  --primary: 61 95% 62%;        /* Neon Yellow */
  --background: 0 0% 12.2%;     /* Dark Background */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glow-primary: 0 0 20px rgba(248, 244, 66, 0.5);
}
```

### Tailwind Configuration

Extend the Tailwind configuration in `tailwind.config.ts` to add custom utilities, animations, or colors.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Using Lovable

Simply open your [Lovable Project](https://lovable.dev/projects/87305485-0eeb-4411-b451-717bf4220fcb) and click **Share → Publish**.

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

3. Set environment variables:
   - `VITE_THIRDWEB_CLIENT_ID` - Your Thirdweb Client ID

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_THIRDWEB_CLIENT_ID` | Thirdweb API Client ID | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the SmartSentinels ecosystem.

## 🔗 Links

- **Website**: Coming Soon
- **Documentation**: Coming Soon
- **Twitter**: Coming Soon
- **Discord**: Coming Soon

## 💡 Support

For support, join our Discord community or open an issue on GitHub.

---

Built with ❤️ by the SmartSentinels Team
