<div align="center">
  
  # 🎓 Antigravity Assessment API
  **An Enterprise-Grade AI Question Paper Generator**

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
  [![AI](https://img.shields.io/badge/AI-Groq%20%7C%20OpenAI-blue?style=flat-square&logo=openai)](https://openai.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

  <p align="center">
    A robust SaaS platform empowering educators and institutions to instantly generate high-quality, rigorous, and syllabus-accurate examination papers using advanced Generative AI.
  </p>
</div>

---

## ✨ Key Features

- **🧠 Intelligent AI Generation**: Context-aware, subject-specific paper generation avoiding generic templates or repetitive questions.
- **📚 Curriculum Alignment**: Input detailed metadata (Subject, Class, School Name, Exam Type) to ensure outputs align with real-world educational standards.
- **⚙️ Dynamic Sectioning**: Create highly customizable sections (MCQs, Long Answer, Numerical Problems) with explicit difficulty controls.
- **🚫 Smart Duplicate Prevention**: Advanced Jaccard similarity and structural fingerprinting algorithms strictly prevent question repetition.
- **⚡ Real-Time Dashboard**: Beautiful, responsive assignment dashboard with live-polling status indicators (🟠 Generating... 🟢 Generated).
- **🖨️ PDF Export & Print Ready**: Seamlessly export beautifully formatted, print-ready PDF question papers utilizing `html2pdf.js` and `jsPDF`.
- **🚀 Scalable Architecture**: Built on a modern Monorepo architecture (Turborepo) utilizing BullMQ, Redis, and exponential backoff strategies to gracefully handle AI API rate limits.

---

## 🖼️ Screenshots

*(Add your high-resolution screenshots here)*

| Dashboard | Create Assignment |
| :---: | :---: |
| <img src="docs/placeholder-dashboard.png" width="400" alt="Dashboard" /> | <img src="docs/placeholder-create.png" width="400" alt="Create" /> |

| Generated Paper View | Print / Export |
| :---: | :---: |
| <img src="docs/placeholder-view.png" width="400" alt="Paper View" /> | <img src="docs/placeholder-print.png" width="400" alt="Print" /> |

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **PDF Export**: `html2pdf.js`, `jsPDF`

### Backend (Server)
- **Runtime & Framework**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Queue System**: BullMQ, Redis (for asynchronous generation processing)
- **Validation**: Zod
- **AI Integration**: [Groq SDK](https://groq.com) (Llama-3), OpenAI API (Fallback mechanism)

### Architecture
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: pnpm

---

## 📂 Folder Structure

This project follows a strict Monorepo design pattern for maximum scalability:

```text
.
├── apps/
│   ├── web/                # Next.js Frontend Application
│   │   ├── src/app/        # App Router Pages
│   │   ├── src/components/ # Sliced React Components (UI, Dashboard, Forms)
│   │   ├── src/store/      # Zustand Global State
│   │   └── src/lib/        # API Client & Utility Functions
│   │
│   └── server/             # Express.js API Server
│       ├── src/config/     # Environment & DB configs
│       ├── src/modules/    # Domain-driven backend modules (Assignments, AI)
│       └── src/jobs/       # BullMQ Worker Queues
│
├── packages/
│   ├── ui/                 # Shared UI component library
│   ├── types/              # Shared TypeScript definitions
│   └── prompts/            # Centralized LLM Prompt engineering
│
└── package.json            # Root configuration
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v20+ recommended)
- `pnpm` (v10+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Redis Server running locally (for BullMQ)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-assessment-creator.git
cd ai-assessment-creator
```

### 2. Install Dependencies
```bash
pnpm install
```

---

## 🔐 Environment Variables

You need to set up environment variables for both the backend and frontend.

### Backend (`apps/server/.env`)
Create a `.env` file in the `apps/server` directory:

```env
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai_assessment
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# AI Providers (Groq acts as primary, OpenAI as fallback for rate-limits)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (`apps/web/.env.local`)
Create a `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 🚀 Running Locally

Once dependencies are installed and `.env` files are configured, you can start the entire stack using Turborepo.

### Start all services (Frontend & Backend)
```bash
pnpm dev
```
- **Web App**: http://localhost:3000
- **API Server**: http://localhost:4000

*Note: Ensure your local MongoDB and Redis instances are actively running before starting the server.*

---

## 🏗️ Build Commands

To verify and compile the project for production, run:

```bash
# Formats and fixes linting across the monorepo
pnpm format
pnpm lint:fix

# Type-check the codebase
pnpm type-check

# Compile the production builds
pnpm build
```

---

## 🌍 Deployment

This monorepo is fully optimized for modern cloud deployments.

### Frontend Deployment (Vercel)
1. Import the repository into [Vercel](https://vercel.com).
2. Set the Framework Preset to `Next.js`.
3. Set the Root Directory to `apps/web`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend.
5. Deploy!

### Backend Deployment (Render / Railway / AWS)
1. Link your repository to your PaaS provider.
2. Set the Root Directory to `apps/server`.
3. Set the Build Command: `pnpm install && pnpm build`
4. Set the Start Command: `pnpm start`
5. Supply all backend Environment Variables (Mongo, Redis, API keys).
6. Ensure a Redis instance is provisioned and attached.

---

## 🔮 Future Improvements

- **Multi-Tenant RBAC**: Add distinct roles for School Admins, Teachers, and Reviewers.
- **Image Generation Support**: Automatically integrate scientific diagrams into questions via Stable Diffusion or MidJourney APIs.
- **Export to DOCX**: Add robust Microsoft Word export capabilities alongside the existing PDF generator.
- **WebSocket Streaming**: Transition from short-polling to WebSockets for real-time generation streaming.

---

## 👨‍💻 Author

**Your Name / Organization**
- Website: [yourportfolio.com](https://yourportfolio.com)
- GitHub: [@iniwdev](https://github.com/iniwdev)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

<div align="center">
  <i>Built with passion for the future of education technology. 🚀</i>
</div>
