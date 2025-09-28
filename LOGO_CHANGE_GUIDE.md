# 🎨 ওয়েবসাইট লোগো চেঞ্জ করার গাইড

## 📍 লোগো ব্যবহার করা জায়গাসমূহ:

### 1. **Landing Page** (`app/landing/page.tsx`)
- **লাইন 797-816**: Header এ main logo
- **বর্তমান**: Zap icon + "DevTools Pro" text

### 2. **Sidebar Navigation** (`components/sidebar-navigation.tsx`)
- **লাইন 58-70**: Sidebar এ logo
- **বর্তমান**: Code icon + "UGen Pro" text

### 3. **Login Page** (`app/login/page.tsx`)
- **লাইন 344-350**: Left branding section
- **বর্তমান**: Shield icon

### 4. **Signup Page** (`app/signup/page.tsx`)
- **লাইন 186-192**: Left branding section
- **বর্তমান**: UserPlus icon

## 🔧 লোগো চেঞ্জ করার পদ্ধতি:

### **পদ্ধতি ১: Image Logo ব্যবহার**

1. **নতুন লোগো ফাইল যোগ করুন:**
   ```
   public/your-logo.png
   public/your-logo.svg
   ```

2. **Landing Page এ চেঞ্জ করুন:**
   ```tsx
   {/* Option 1: Use your custom logo image */}
   <img src="/your-logo.png" alt="Logo" className="w-8 h-8 relative z-10" />
   ```

3. **Sidebar এ চেঞ্জ করুন:**
   ```tsx
   <img src="/your-logo.png" alt="Logo" className="w-8 h-8 relative z-10" />
   ```

### **পদ্ধতি ২: Icon চেঞ্জ করা**

1. **Lucide React icons ব্যবহার করুন:**
   ```tsx
   import { YourIcon } from "lucide-react"
   
   <YourIcon className="w-7 h-7 text-white relative z-10" />
   ```

2. **Custom SVG ব্যবহার করুন:**
   ```tsx
   <svg className="w-7 h-7 text-white relative z-10">
     {/* Your SVG content */}
   </svg>
   ```

### **পদ্ধতি ৩: Text Logo চেঞ্জ**

1. **Company name চেঞ্জ করুন:**
   ```tsx
   <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
     Your Company Name
   </span>
   ```

2. **Tagline চেঞ্জ করুন:**
   ```tsx
   <p className="text-xs text-muted-foreground -mt-1">Your Tagline</p>
   ```

## 🎨 Color Scheme চেঞ্জ:

### **Gradient Colors:**
```tsx
// Blue to Indigo
bg-gradient-to-br from-blue-500 to-indigo-600

// Green to Emerald
bg-gradient-to-br from-green-500 to-emerald-600

// Purple to Pink
bg-gradient-to-br from-purple-500 to-pink-600

// Custom colors
bg-gradient-to-br from-[#your-color-1] to-[#your-color-2]
```

### **Text Colors:**
```tsx
// Blue gradient text
bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent

// Green gradient text
bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent
```

## 📝 Step-by-Step Instructions:

### **Step 1: Logo File যোগ করুন**
1. `public/` folder এ আপনার লোগো ফাইল রাখুন
2. নাম দিন: `logo.png`, `logo.svg`, বা `company-logo.png`

### **Step 2: Landing Page আপডেট করুন**
1. `app/landing/page.tsx` ফাইল খুলুন
2. লাইন 802 এ comment সরিয়ে দিন
3. আপনার লোগো path দিন: `src="/your-logo.png"`

### **Step 3: Sidebar আপডেট করুন**
1. `components/sidebar-navigation.tsx` ফাইল খুলুন
2. লাইন 62 এ icon replace করুন
3. আপনার লোগো যোগ করুন

### **Step 4: Login/Signup Pages আপডেট করুন**
1. `app/login/page.tsx` এবং `app/signup/page.tsx` ফাইল খুলুন
2. Left branding section এ লোগো আপডেট করুন

### **Step 5: Company Name চেঞ্জ করুন**
1. সব জায়গায় "DevTools Pro" → "Your Company Name"
2. সব জায়গায় "UGen Pro" → "Your Company Name"

## 🚀 Quick Start:

1. **Logo file যোগ করুন:**
   ```bash
   # public/ folder এ আপনার লোগো রাখুন
   cp your-logo.png public/logo.png
   ```

2. **Landing page আপডেট করুন:**
   ```tsx
   <img src="/logo.png" alt="Your Company" className="w-8 h-8 relative z-10" />
   ```

3. **Company name চেঞ্জ করুন:**
   ```tsx
   <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
     Your Company Name
   </span>
   ```

## 💡 Tips:

- **PNG/SVG format** ব্যবহার করুন best quality এর জন্য
- **Square aspect ratio** (1:1) রাখুন
- **Transparent background** রাখুন
- **High resolution** (512x512 বা তার বেশি) ব্যবহার করুন
- **File size** ছোট রাখুন (100KB এর কম)

## 🔍 Files to Edit:

1. `app/landing/page.tsx` - Main landing page logo
2. `components/sidebar-navigation.tsx` - Sidebar logo
3. `app/login/page.tsx` - Login page branding
4. `app/signup/page.tsx` - Signup page branding
5. `app/layout.tsx` - Meta tags এবং title

এই গাইড অনুসরণ করে আপনি সহজেই আপনার ওয়েবসাইটের লোগো চেঞ্জ করতে পারবেন! 🎉
