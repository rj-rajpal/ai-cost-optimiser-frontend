# AI Cost Optimizer Frontend

A modern React application for analyzing and optimizing AI service costs with integrated authentication and cost analytics.

## ✨ Features

- 🔐 **Authentication**: Supabase-powered auth with email/password and social login (Google, GitHub)
- 📊 **Dashboard**: Real-time cost analytics and metrics visualization
- 📈 **Charts**: Interactive spend vs token usage tracking
- 🔍 **Process Analysis**: AI automation potential evaluation
- 💰 **ROI Calculator**: Return on investment calculations
- 📚 **Scenario Library**: Saved optimization models
- 🎨 **Modern UI**: shadcn/ui components with Tailwind CSS
- 📱 **Responsive**: Mobile-first design

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-cost-optimiser-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Add your Supabase credentials
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Supabase Setup

Follow the detailed setup guide in `SUPABASE_SETUP.md` to:
- Create a Supabase project
- Configure authentication providers
- Set up OAuth (Google, GitHub)
- Configure redirect URLs

### Authentication

The app includes:
- Email/password authentication
- Social login (Google, GitHub)
- Protected routes
- Session management
- User profile management

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state
├── lib/               # Utilities and configurations
│   ├── supabase.js    # Supabase client
│   └── utils.js       # Helper functions
├── pages/             # Page components
│   ├── dashboard/     # Dashboard with analytics
│   ├── login/         # Authentication
│   └── ...
└── styles/            # Global styles and CSS
```

## 🎨 UI Components

Built with modern, accessible components:
- **Button**: Multi-variant button component with shadcn/ui
- **Forms**: Styled form inputs with validation states
- **Navigation**: Responsive header with user menu
- **Modals & Dropdowns**: Animated overlays
- **Charts**: Recharts integration for data visualization

## 🔐 Authentication Flow

1. User visits protected route
2. Redirected to `/login` if not authenticated
3. Choose email/password or social login
4. Supabase handles authentication
5. Redirected to dashboard on success
6. Session persisted across browser sessions

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth
- **State Management**: React Context
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form

## 🌐 Deployment

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Update Supabase redirect URLs for production domain
4. Set production environment variables

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the `SUPABASE_SETUP.md` guide
- Review the codebase documentation
- Open an issue in the repository
