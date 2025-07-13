# 📚 VocabMaster - Interactive Vocabulary Learning Platform  

<img width="1896" height="910" alt="{6A26FE72-578C-41E1-87A4-010C9B00D86A}" src="https://github.com/user-attachments/assets/334d57e6-b0fa-493b-bcf9-1c6c277dc524" />

*A modern, interactive platform for effective vocabulary learning*

Link website: [englishvoca.vercel.app](https://englishvoca.vercel.app/)
## ✨ Features

### 🎯 Engaging Learning Tools
- **Smart Flashcards** with flip animations for better retention
- **Adaptive Quizzes** that focus on your weak areas
- **Progress Tracking** with visual analytics
- **Topic-based Learning** organized by categories

### ⚡ Technical Highlights
- **Offline-First** design using IndexedDB
- **Real-time Sync** with Supabase backend
- **Responsive UI** works on all devices
- **Type-Safe** codebase with TypeScript

## 🛠 Tech Stack

**Frontend:**
- Next.js (App Router)
- React 18
- TypeScript
- Tailwind CSS

**Backend & Storage:**
- Supabase (Auth + PostgreSQL)
- IndexedDB (offline storage)

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vocabmaster.git
   cd vocabmaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Database setup**
   - Import the SQL schema from `/supabase/setup.sql`
   - Or set up tables manually in Supabase Dashboard

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔧 Build & Deployment

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

**Deploy to Vercel:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/vocabmaster)

## 📬 Contact

For questions or opportunities:

- **Email**: qk31082000@gmail.com


**Happy Learning!** 🚀
