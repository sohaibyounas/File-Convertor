# ⚡ Quick Start Guide - FileConvert Pro

Get up and running in under 5 minutes!

## 🎯 What You've Got

A production-ready file conversion website with:

- ✅ **DOCX ↔ PDF conversion**
- ✅ **PPTX ↔ DOCX conversion**
- ✅ **Image → PDF/DOCX/TXT with OCR**
- ✅ **12 language OCR support**
- ✅ **Premium animations** (Framer Motion + Lenis)
- ✅ **Dark mode** (automatic theme switching)
- ✅ **Batch processing** (up to 10 files)
- ✅ **100% client-side** (no server uploads)

---

## 🚀 Running Locally

### Option 1: Already Running!

If you can see this, your dev server is already running at:
**🌐 http://localhost:3000**

### Option 2: Start Fresh

```bash
# Navigate to project
cd "d:\Downloads\Practice projects\File_Conversion"

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Then open:** http://localhost:3000

---

## 📸 Quick Feature Tour

### 1. **Upload Files** (3 Ways)

- Drag & drop files onto the upload zone
- Click the upload zone to browse
- Support for: PDF, DOCX, PPTX, JPG, PNG

### 2. **Choose Format**

- Select target format: PDF, DOCX, PPTX, or TXT (OCR)
- For OCR: Choose language (English, French, German, etc.)

### 3. **Convert**

- Click "Convert Files"
- Watch real-time progress with liquid animations
- Get instant downloads

### 4. **Download**

- Single file: Click "Download" on each file
- Multiple files: Click "Download All" (creates ZIP)

---

## 🎨 Try These Features

### **Test OCR (Image to Text)**

1. Upload a screenshot or scanned document (JPG/PNG)
2. Select "TXT (OCR)" as target format
3. Choose language
4. Convert & download extracted text

### **Batch Conversion**

1. Upload multiple DOCX files
2. Select "PDF" as target
3. Convert all at once
4. Download as ZIP

### **Dark Mode**

- Click the moon/sun icon in the header
- Theme preference is saved automatically

---

## 🏗️ Project Structure (Simplified)

```
File_Conversion/
├── app/                      # Next.js pages
│   ├── page.tsx             # Main converter page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── converter/           # Converter UI
│   │   ├── conversion-zone.tsx      # Main conversion area
│   │   ├── drag-zone.tsx            # Drag & drop
│   │   └── file-card.tsx            # File status cards
│   ├── ui/                  # Reusable UI components
│   └── layout/              # Header & footer
├── lib/
│   ├── converters/          # File conversion logic
│   ├── ocr/                 # OCR processing
│   └── store.ts             # State management
└── hooks/
    └── use-conversion.ts    # Conversion hook
```

---

## 🛠️ Common Tasks

### **Add New Language for OCR**

Edit `lib/ocr/tesseract-worker.ts`:

```typescript
export const SUPPORTED_OCR_LANGUAGES = [
  // ... existing languages
  { code: "kor", name: "Korean" }, // Add this
];
```

### **Change File Limits**

Edit `components/converter/drag-zone.tsx`:

```typescript
const MAX_FILES = 10; // Change this
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB → change this
```

### **Customize Colors**

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "hsl(262, 83%, 58%)",  // Change primary color
}
```

### **Change Animations Speed**

Edit `app/globals.css`:

```css
.shimmer {
  animation: shimmer 2s linear infinite; /* Change duration */
}
```

---

## 🧪 Test Conversions

### **Sample Files to Test:**

1. **DOCX → PDF**

   - Create a simple `.docx` file in Word
   - Upload and convert to PDF

2. **Image → Text (OCR)**

   - Take a screenshot of text
   - Upload as JPG/PNG
   - Select TXT (OCR)
   - See extracted text

3. **Batch Processing**
   - Upload 3-5 small documents
   - Convert all to PDF
   - Download ZIP

---

## 🐛 Troubleshooting

### **Server not starting?**

```bash
# Kill any process on port 3000
npx kill-port 3000

# Start again
npm run dev
```

### **TypeScript errors?**

```bash
# Type check
npm run type-check

# Most errors are auto-fixed by Next.js
```

### **Conversion failing?**

- Check file size (max 100MB)
- Ensure file is not corrupted
- Try with a smaller test file first

### **OCR slow?**

- OCR runs in browser (client-side)
- First run downloads language files (~5MB)
- Subsequent runs are faster
- Large images take longer

---

## 📦 Build for Production

```bash
# Build
npm run build

# Test production build locally
npm start

# Then visit http://localhost:3000
```

---

## 🚀 Deploy (One Command)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**That's it!** Your site is live in under 2 minutes.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

---

## 📚 Learn More

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Deployment guide
- **Next.js Docs** - https://nextjs.org/docs
- **Tesseract.js** - https://tesseract.projectnaptha.com/

---

## 💡 Next Steps

### **Immediate:**

1. ✅ Test all conversion types
2. ✅ Try dark mode
3. ✅ Test OCR with different languages
4. ✅ Upload batch files

### **Customization:**

1. Change colors in `tailwind.config.ts`
2. Update logo/branding in `components/layout/header.tsx`
3. Modify file limits in `drag-zone.tsx`
4. Add more features!

### **Deployment:**

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Choose platform (Vercel recommended)
3. Deploy in under 5 minutes
4. Share with the world!

---

## 🎉 You're All Set!

Your file conversion platform is ready to use.

**Running at:** http://localhost:3000

**Questions?** Check the README.md or open an issue.

**Happy Converting! 🚀**
