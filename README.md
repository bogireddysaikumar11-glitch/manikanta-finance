# 🏍️ Manikanta Finance — Two-Wheeler Showroom & Financial Ledger

An executive showroom management and financial accounting portal built for second-hand two-wheeler dealerships. Designed for seamless usage on both **Laptops (Executive Workstation)** and **Mobile Phones (Pocket Showroom Assistant)**.

---

## 🌟 Key Features

- **🏍️ Showroom Bike Inventory**: Real-time stock valuation, refurbishment expense tracking, and sales margins.
- **➕ Shop Owner Buying Entry (`/bikes/new`)**: 1-click popular bike presets (*Royal Enfield, Activa, Splendor, Pulsar, TVS Jupiter, Yamaha FZ-S, Access 125*), vehicle specs, live margin calculator, seller KYC, RTO checklist, and printable purchase vouchers.
- **🧾 Customer Sales & Invoicing (`/sales/new`)**: Fast deal creation, down payments, EMI installment scheduling, and customer receipt generation.
- **📖 Daily Record Book (`/daily-book`)**: Integrated cash & UPI daybook ledger tracking daily inflows, outflows, and net profit.
- **📱 Dual-Screen Experience**:
  - **Mobile**: Fixed bottom navigation bar (`Home`, `Stock`, `+ Buy`, `Sell`, `Daybook`, `More`), 1-tap **Direct Call** (`tel:`) and **WhatsApp** shortcuts for customers & sellers, sticky live profit margin strip.
  - **Laptop**: Persistent sidebar, wide multi-column financial tables, and quick keyboard shortcuts (`Ctrl+K`).
- **🛡️ Enterprise Security**: Argon2id password hashing, 2FA authentication, and immutable cryptographic audit logging.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & API Routes)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: SQLite (Local Dev / Single Server) / PostgreSQL (Cloud Production)
- **Authentication**: Custom session-based auth with Argon2id + 2FA

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize Database
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔑 Showroom Admin Credentials
- **Username / Mobile**: `manikantareddy` or `admin` or `9876543210`
- **Email**: `admin@manikantafinance.com`
- **Password**: `manikanta04`
- **2FA Code**: `202600`

---

## 📦 Production Build

```bash
npm run build
npm run start
```

For complete cloud deployment instructions (Vercel, Render, Railway, Cloudflare Tunnel), see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
