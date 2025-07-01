# ✨ AI Prompt Engineer

<div align="center">

![AI Prompt Engineer](https://img.shields.io/badge/AI%20Prompt-Engineer-blue?style=for-the-badge&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**Transform basic prompts into powerful, context-rich instructions optimized for any AI model.**

[🚀 Live Demo](https://promptify-ai-ten.vercel.app) • [📖 Documentation](#features) • [🛠️ Setup](#installation) • [💡 Contributing](#contributing)

</div>

---

## 🎯 **What is AI Prompt Engineer?**

AI Prompt Engineer is a professional web application that transforms your basic prompts into powerful, context-rich instructions optimized for AI models like ChatGPT, Claude, and Gemini. Whether you're a content creator, developer, marketer, or researcher, this tool helps you get better results from AI models.

### 🌟 **Key Highlights**

- 🔐 **Secure Authentication** - Google OAuth & email authentication
- 🔑 **Bring Your Own Key (BYOK)** - Use your own OpenRouter API key
- 🎨 **Multiple Enhancement Modes** - Professional, Creative, Academic, Technical, Marketing, Storytelling
- 🖼️ **Image Prompt Optimization** - Specialized for AI image generation
- 💾 **Cloud Sync** - Your prompts and settings sync across devices
- 🔒 **Encrypted Storage** - API keys encrypted with AES-GCM
- 📱 **Mobile Responsive** - Works perfectly on all devices

---

## 🚀 **Features**

### 🎭 **Enhancement Modes**

Transform your prompts with specialized AI enhancement modes:

| Mode | Best For | Example Use Case |
|------|----------|------------------|
| 🏢 **Professional** | Business communications, reports | Transform "Write an email" → Structured, formal business correspondence |
| 🎨 **Creative** | Stories, creative writing | Transform "Write a story" → Rich, imaginative narrative with vivid details |
| 🎓 **Academic** | Research, essays, documentation | Transform "Explain AI" → Comprehensive, well-cited academic explanation |
| ⚙️ **Technical** | Code, documentation, tutorials | Transform "Fix this bug" → Detailed technical solution with examples |
| 📈 **Marketing** | Copy, campaigns, social media | Transform "Sell this product" → Compelling marketing copy with CTAs |
| 📚 **Storytelling** | Narratives, content creation | Transform basic ideas → Engaging stories with structure and emotion |

### 🖼️ **Image Prompt Enhancement**

Specialized optimization for AI image generation models like Midjourney, DALL·E, and Stable Diffusion:

- **Visual Details**: Colors, lighting, textures, composition
- **Style Specifications**: Digital art, photography, painting styles
- **Technical Parameters**: Camera settings, aspect ratios, quality modifiers
- **Mood & Atmosphere**: Environmental and emotional context

### 🔐 **Authentication & Security**

- **Google OAuth Integration** - One-click sign-in with Google
- **Email/Password Authentication** - Traditional login option
- **Secure Profile Management** - Encrypted user data
- **Cross-Device Synchronization** - Access your data anywhere

### 🔑 **BYOK (Bring Your Own Key) System**

- **No Hidden Costs** - Use your own OpenRouter API key
- **Encrypted Storage** - Keys encrypted with AES-GCM before storage
- **Flexible Options** - Save to account (syncs) or locally
- **API Key Validation** - Real-time testing and validation
- **Free Monthly Credits** - OpenRouter provides free credits monthly

### 💾 **Data Management**

- **Cloud Storage** - Prompt history saved to Supabase database
- **Local Fallback** - Works offline with localStorage
- **Saved Prompts** - Bookmark your best enhanced prompts
- **Export Options** - Copy enhanced prompts with one click
- **History Tracking** - Keep track of your enhancement journey

---

## 🛠️ **Installation**

### **Prerequisites**

- Node.js 18+ and npm
- [OpenRouter API Key](https://openrouter.ai/keys) (free monthly credits available)

### **Quick Start**

```bash
# Clone the repository
git clone https://github.com/your-username/ai-prompt-engineer.git
cd ai-prompt-engineer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### **Environment Variables**

Create a `.env.local` file:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Database Setup**

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL script from `database_setup.sql` in Supabase SQL Editor
3. Enable Row Level Security and configure authentication providers

---

## 🎮 **Usage**

### **Getting Started**

1. **Sign Up/Login** - Use Google OAuth or email authentication
2. **Add API Key** - Go to Settings → API Keys and add your OpenRouter key
3. **Choose Mode** - Select enhancement mode (Professional, Creative, etc.)
4. **Enter Prompt** - Type your basic prompt
5. **Enhance** - Click "Enhance Prompt" and get AI-optimized results
6. **Save & Share** - Save to collection or copy enhanced prompt

### **Example Transformations**

#### Text Prompts

**Input (Basic):**
```
Write a blog post about AI
```

**Output (Professional Mode):**
```
Create a comprehensive, SEO-optimized blog post about Artificial Intelligence that:
- Provides an engaging introduction that hooks readers
- Explains AI concepts in accessible language for a general audience
- Includes real-world applications and current trends
- Addresses common misconceptions and concerns
- Concludes with actionable insights for businesses
- Maintains a professional, authoritative tone throughout
- Is structured with clear headings and subheadings for readability
- Targets 1500-2000 words with strategic keyword placement
```

#### Image Prompts

**Input (Basic):**
```
A futuristic city
```

**Output (Image Mode):**
```
A breathtaking futuristic cyberpunk cityscape at night, illuminated by vibrant neon lights in electric blue and hot pink, towering glass skyscrapers with holographic advertisements, flying cars streaking across the sky leaving light trails, wet reflective streets creating mirror effects, atmospheric fog rolling between buildings, ultra-wide angle perspective, photorealistic digital art, 8K resolution, cinematic lighting, blade runner aesthetic
```

---

## 🏗️ **Tech Stack**

<div align="center">

| Frontend | Backend | Database | Authentication | Deployment |
|----------|---------|----------|----------------|------------|
| ⚛️ React 18 | 🔥 Supabase | 🐘 PostgreSQL | 🔐 Supabase Auth | ▲ Vercel |
| 📘 TypeScript | 🎨 shadcn/ui | 🔒 Row Level Security | 🌐 Google OAuth | 🚀 Auto Deploy |
| 🎨 Tailwind CSS | 🎯 Zustand | 💾 Real-time sync | 📧 Email Auth | 📊 Analytics |
| ⚡ Vite | 🔧 React Hook Form | 🔄 Migrations | 🔑 JWT Tokens | 🌍 Global CDN |

</div>

### **Key Libraries**

- **UI Components**: shadcn/ui, Radix UI, Lucide Icons
- **Styling**: Tailwind CSS, CSS Variables for theming
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context + Hooks
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (Google OAuth, Email/Password)
- **API Integration**: OpenRouter API for AI model access
- **Deployment**: Vercel with automatic deployments

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### **Contribution Guidelines**

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation for significant changes
- Ensure mobile responsiveness
- Test authentication flows thoroughly

### **Areas for Contribution**

- 🎨 **UI/UX Improvements** - Better design, animations, accessibility
- 🔧 **New Features** - Additional enhancement modes, export formats
- 🐛 **Bug Fixes** - Performance optimizations, edge cases
- 📖 **Documentation** - Tutorials, API docs, video guides
- 🌐 **Internationalization** - Multiple language support
- 🧪 **Testing** - Unit tests, integration tests, E2E tests

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **OpenRouter** - For providing AI model access with free monthly credits
- **Supabase** - For the amazing backend-as-a-service platform
- **shadcn/ui** - For the beautiful, accessible UI components
- **Vercel** - For seamless deployment and hosting
- **React Community** - For the incredible ecosystem and tools

---

## 📞 **Support**

- 🐛 **Found a bug?** [Open an issue](https://github.com/your-username/ai-prompt-engineer/issues)
- 💡 **Have a feature request?** [Start a discussion](https://github.com/your-username/ai-prompt-engineer/discussions)
- 📧 **Need help?** Contact us at support@yourproject.com
- 💬 **Join our community** on [Discord](https://discord.gg/yourserver)

---

<div align="center">

**Built with ❤️ by developers, for developers**

[⭐ Star this repo](https://github.com/your-username/ai-prompt-engineer) • [🐦 Follow on Twitter](https://twitter.com/yourhandle) • [🌐 Visit Website](https://promptify-ai-ten.vercel.app)

</div>
