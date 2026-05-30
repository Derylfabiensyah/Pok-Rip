# Brewek.In - Multi-TCG Booster Pack Simulator

![Brewek.In](https://img.shields.io/badge/Brewek.In-TCG%20Simulator-ff4081?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite)

**Brewek.In** adalah simulator pembukaan booster pack untuk berbagai Trading Card Games (TCG). Rasakan sensasi membuka booster pack Pokemon, One Piece, Yu-Gi-Oh!, Digimon, dan Gundam secara virtual!

## ✨ Features

- 🎴 **5 TCG Supported**: Pokemon, One Piece, Yu-Gi-Oh!, Digimon, Gundam
- 🎨 **Neo-Brutalism Design**: Bold, colorful, dan eye-catching
- ✨ **Smooth Animations**: Powered by Framer Motion
- 🎯 **Card Flip Animation**: Realistic 3D card flip effect
- 🌈 **Rarity Glow Effects**: Different glow for each rarity
- 📱 **Responsive Design**: Works on desktop and mobile
- 💾 **Collection System**: Save and view your pulled cards

## 🚀 Tech Stack

- **React 19.2.6** - UI Framework
- **Vite 8.0.12** - Build Tool
- **Tailwind CSS 4.3.0** - Styling
- **Framer Motion 12.40.0** - Animations
- **TCG APIs** - Real card data from various TCG APIs

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd Brewek.In

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎮 How to Use

1. **Select TCG**: Choose your favorite TCG from the carousel
2. **Rip Pack**: Click "Rip Pack!" button to open a booster pack
3. **Reveal Cards**: Watch the cards flip one by one
4. **View Collection**: Check your collection of pulled cards

## 🎨 Supported TCGs

| TCG | Status | API |
|-----|--------|-----|
| Pokemon | ✅ Active | apitcg.com |
| One Piece | ✅ Active | apitcg.com |
| Yu-Gi-Oh! | ✅ Active | ygoprodeck.com |
| Digimon | ✅ Active | apitcg.com |
| Gundam | ✅ Active | apitcg.com |

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
VITE_TCG_API_KEY=your_api_key_here
```

Get your API key from [apitcg.com](https://www.apitcg.com)

## 📁 Project Structure

```
Brewek.In/
├── public/
│   ├── images/          # Back card images
│   └── favicon.svg
├── src/
│   ├── assets/          # Back card images (primary)
│   ├── components/      # React components
│   │   ├── Home.jsx
│   │   ├── BoosterPack.jsx
│   │   ├── CardReveal.jsx
│   │   ├── CardFlip.jsx
│   │   ├── PackResult.jsx
│   │   └── Collection.jsx
│   ├── services/        # API services
│   │   └── tcgApi.js
│   ├── utils/           # Utility functions
│   │   ├── rarityGlow.js
│   │   └── shuffleCards.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Features in Detail

### Card Flip Animation
- Realistic 3D flip effect
- Auto-flip on reveal
- One-time flip (no accidental re-flip)

### Rarity System
- Common, Uncommon, Rare, Ultra Rare, Secret Rare
- Special rarities: Rainbow, Gold, Full Art, etc.
- Dynamic glow effects based on rarity

### Back Card Detection
- Filters out invalid card images from API
- Fallback to card info if image fails
- McDonald's promo cards filtered

## 🐛 Known Issues

- Some Pokemon McDonald's promo cards may show back card images (filtered by API)
- One Piece images use proxy to bypass hotlink protection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- Card data from [apitcg.com](https://www.apitcg.com)
- Yu-Gi-Oh! data from [ygoprodeck.com](https://ygoprodeck.com)
- Built with ❤️ using React and Vite

---

**Brewek.In** - Rip packs, collect cards, have fun! 🎴✨
