export const translations = {
  en: {
    nav: {
      search: "Search cryptocurrencies...",
      signIn: "Sign In"
    },
    sidebar: {
      dashboard: "Dashboard",
      explore: "Explore",
      portfolio: "Portfolio",
      watchlist: "Watchlist",
      settings: "Settings",
      admin: "Admin"
    },
    dashboard: {
      title: "Market Overview",
      subtitle: "Track and analyze real-time cryptocurrency data.",
      dominance: "Market Dominance",
      trending: "Trending Coins"
    },
    explore: {
      title: "Explore Cryptocurrencies",
      subtitle: "Discover and analyze the crypto market.",
      asset: "Asset",
      price: "Price",
      change24h: "24h Change",
      marketCap: "Market Cap",
      volume24h: "Volume (24h)",
      aiTrend: "AI Trend",
      watch: "Watch"
    },
    watchlist: {
      title: "My Watchlist",
      subtitle: "Track your favorite cryptocurrencies in one place.",
      empty: "Your watchlist is empty",
      emptySub: "Go to the Explore page to add some coins to your watchlist.",
      exploreBtn: "Explore Coins"
    },
    portfolio: {
      title: "My Portfolio",
      subtitle: "Track your assets and overall profitability.",
      totalBalance: "Total Balance",
      yourAssets: "Your Assets",
      asset: "Asset",
      balance: "Balance",
      price: "Price",
      profitLoss: "Profit/Loss"
    },
    coinDetail: {
      back: "Back to Dashboard",
      currentPrice: "Current Price",
      marketCap: "Market Cap",
      volume24h: "24h Volume",
      supply: "Circulating Supply",
      priceHistory: "Price History (7D)",
      aiIntelligence: "AI Market Intelligence",
      poweredBy: "Powered by Neural Analytics",
      trend: "Market Trend",
      action: "Action Suggestion",
      trajectory: "Price Trajectory",
      prev24h: "Previous (24h)",
      present: "Present",
      predicted: "Predicted"
    },
    auth: {
      signInToAccount: "Sign in to your account",
      or: "Or",
      createAccount: "create a new account",
      email: "Email address",
      password: "Password",
      rememberMe: "Remember me",
      forgotPass: "Forgot your password?",
      signInBtn: "Sign in",
      loggingIn: "Signing in...",
      invalidCreds: "Invalid email or password",
      serverError: "Server error occurred"
    },
    verification: {
      title: "Price Verification",
      subtitle: "This price is aggregated and verified across",
      subtitleEnd: "different data sources to ensure maximum reliability and prevent manipulation.",
      chosenPrice: "Chosen Price:",
      chosenDesc: "Calculated as the median to filter out extreme outliers and ensure stability."
    },
    news: {
      latest: "Latest News",
      readMore: "Read more"
    }
  },
  uz: {
    nav: {
      search: "Kriptovalyutalarni qidirish...",
      signIn: "Kirish"
    },
    sidebar: {
      dashboard: "Bosh sahifa",
      explore: "Kashf qilish",
      portfolio: "Portfel",
      watchlist: "Kuzatuvlar",
      settings: "Sozlamalar",
      admin: "Admin"
    },
    dashboard: {
      title: "Bozor holati",
      subtitle: "Haqiqiy vaqtda kriptovalyuta ma'lumotlarini kuzating.",
      dominance: "Bozor ustunligi",
      trending: "Ommabop tangalar"
    },
    explore: {
      title: "Kriptovalyutalarni kashf qilish",
      subtitle: "Kripto bozorni o'rganing va tahlil qiling.",
      asset: "Aktiv",
      price: "Narx",
      change24h: "24s O'zgarish",
      marketCap: "Bozor qiymati",
      volume24h: "Aylanma (24s)",
      aiTrend: "AI Trendi",
      watch: "Kuzatish"
    },
    watchlist: {
      title: "Mening kuzatuvlarim",
      subtitle: "Sevimli kriptovalyutalaringizni bir joyda kuzatib boring.",
      empty: "Kuzatuv ro'yxatingiz bo'sh",
      emptySub: "Tangalarni qo'shish uchun Kashf qilish sahifasiga o'ting.",
      exploreBtn: "Tangalarni kashf qilish"
    },
    portfolio: {
      title: "Mening Portfelim",
      subtitle: "Aktivlaringiz va umumiy foydangizni kuzating.",
      totalBalance: "Umumiy balans",
      yourAssets: "Sizning aktivlaringiz",
      asset: "Aktiv",
      balance: "Balans",
      price: "Narx",
      profitLoss: "Foyda/Zarar"
    },
    coinDetail: {
      back: "Bosh sahifaga qaytish",
      currentPrice: "Joriy narx",
      marketCap: "Bozor qiymati",
      volume24h: "24s Aylanma",
      supply: "Muomaladagi miqdor",
      priceHistory: "Narxlar tarixi (7 kun)",
      aiIntelligence: "AI Bozor Tahlili",
      poweredBy: "Neyron tahlili yordamida",
      trend: "Bozor trendi",
      action: "Tavsiya",
      trajectory: "Narx trayektoriyasi",
      prev24h: "Oldingi (24s)",
      present: "Joriy",
      predicted: "Kutilayotgan"
    },
    auth: {
      signInToAccount: "Tizimga kiring",
      or: "Yoki",
      createAccount: "yangi hisob yarating",
      email: "Email manzil",
      password: "Parol",
      rememberMe: "Eslab qolish",
      forgotPass: "Parolni unutdingizmi?",
      signInBtn: "Tizimga kirish",
      loggingIn: "Kirilmoqda...",
      serverError: "Serverda xatolik yuz berdi"
    },
    verification: {
      title: "Narx tasdiqlanishi",
      subtitle: "Ushbu narx maksimal ishonchlilikni ta'minlash uchun",
      subtitleEnd: "ta turli manbalardan yig'ilgan va tasdiqlangan.",
      chosenPrice: "Tanlangan narx:",
      chosenDesc: "Nomutanosib farqlarni chiqarib tashlash va barqarorlikni ta'minlash uchun median qiymat tanlandi."
    },
    news: {
      latest: "So'nggi Yangiliklar",
      readMore: "Batafsil"
    }
  }
};

export type Language = 'en' | 'uz';
export type TranslationKey = keyof typeof translations.en;
