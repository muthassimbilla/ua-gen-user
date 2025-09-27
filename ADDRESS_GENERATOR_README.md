# এড্রেস জেনারেটর টুল

এই টুলটি Python এর `mx.py` স্ক্রিপ্টের লজিক অনুযায়ী তৈরি করা হয়েছে। এটি IP ঠিকানা বা ZIP কোড থেকে বাস্তব এড্রেস জেনারেট করতে পারে।

## ফিচারসমূহ

### 1. IP থেকে এড্রেস জেনারেট
- IP ঠিকানা ইনপুট নেয়
- ipinfo.io API ব্যবহার করে IP থেকে coordinates পাওয়া যায়
- Mapbox Reverse Geocoding API ব্যবহার করে coordinates থেকে এড্রেস জেনারেট করা হয়
- একাধিক এড্রেস প্রদান করে (সর্বোচ্চ ৫টি)

### 2. ZIP কোড থেকে এড্রেস জেনারেট
- ZIP কোড ইনপুট নেয়
- Mapbox API ব্যবহার করে ZIP কোডের bounding box পাওয়া যায়
- Bounding box এর মধ্যে র্যান্ডম coordinates জেনারেট করা হয়
- প্রতিটি coordinate থেকে এড্রেস জেনারেট করা হয়
- একাধিক unique এড্রেস প্রদান করে

### 3. ইউজার ইন্টারফেস
- **Tabs**: IP এবং ZIP এর জন্য আলাদা ট্যাব
- **Paste ফিচার**: ক্লিপবোর্ড থেকে ডেটা পেস্ট করা
- **Navigation**: Previous/Next বাটন দিয়ে এড্রেসগুলোর মধ্যে নেভিগেশন
- **Copy ফিচার**: এড্রেস কপি করা
- **Reset ফিচার**: সব কিছু রিসেট করা
- **Loading States**: API কলের সময় লোডিং স্টেট
- **Error Handling**: ভুল ইনপুটের জন্য error messages

## API Endpoints

### 1. IP থেকে এড্রেস
```
POST /api/address-generator/ip
Body: { "ip": "8.8.8.8" }
Response: {
  "success": true,
  "addresses": ["123 Main St, New York, NY 10001, USA"],
  "coordinates": { "lon": -74.006, "lat": 40.7128 },
  "count": 1
}
```

### 2. ZIP থেকে এড্রেস
```
POST /api/address-generator/zip
Body: { "zip": "10001" }
Response: {
  "success": true,
  "addresses": ["123 Broadway, New York, NY 10001, USA"],
  "boundingBox": { "minx": -74.01, "miny": 40.70, "maxx": -74.00, "maxy": 40.72 },
  "count": 1
}
```

## Environment Variables

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Python টুলের সাথে তুলনা

| ফিচার | Python টুল | Next.js টুল |
|--------|------------|-------------|
| IP থেকে এড্রেস | ✅ | ✅ |
| ZIP থেকে এড্রেস | ✅ | ✅ |
| একাধিক এড্রেস | ✅ | ✅ |
| Navigation | ✅ | ✅ |
| Paste ফিচার | ✅ | ✅ |
| Reset ফিচার | ✅ | ✅ |
| Error Handling | ✅ | ✅ |
| Modern UI | ❌ | ✅ |
| Responsive Design | ❌ | ✅ |
| Loading States | ❌ | ✅ |
| Toast Notifications | ❌ | ✅ |

## ব্যবহারের নিয়ম

1. **IP থেকে এড্রেস**: 
   - IP ঠিকানা দিন (যেমন: 8.8.8.8)
   - "IP থেকে জেনারেট করুন" বাটনে ক্লিক করুন
   - পাওয়া এড্রেসগুলো দেখুন এবং নেভিগেট করুন

2. **ZIP থেকে এড্রেস**:
   - ZIP কোড দিন (যেমন: 10001)
   - "ZIP থেকে জেনারেট করুন" বাটনে ক্লিক করুন
   - পাওয়া এড্রেসগুলো দেখুন এবং নেভিগেট করুন

## টেকনোলজি স্ট্যাক

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **APIs**: Mapbox Geocoding, ipinfo.io

## API Rate Limits

- **ipinfo.io**: 50,000 requests/month (free tier)
- **Mapbox**: 100,000 requests/month (free tier)

## নিরাপত্তা

- API keys environment variables এ সংরক্ষিত
- Input validation করা হয়েছে
- Error handling implemented
- CORS headers properly configured
