import { useState, useEffect, useRef } from "react";
import { Search, Send, MessageCircle, X, ChevronRight, FileText, CheckCircle, Clock, XCircle, AlertCircle, Star, Globe, Phone, Mail, MapPin, Upload, ArrowLeft, Menu, Home, ClipboardList, MessageSquare, Settings, Filter, ThumbsUp, Bot, Mic, MicOff, CreditCard, Link2, ShieldCheck, Smartphone, Wifi, WifiOff, Building2, Landmark, Car, Droplets, Zap, Baby, Heart, GraduationCap, Briefcase, Scale, FileCheck, QrCode, Fingerprint, ExternalLink, RefreshCw, IndianRupee } from "lucide-react";

// ─── Department & Service Config ───
const DEPARTMENTS = {
  dm: { en: "DM Office", hi: "डीएम कार्यालय", color: "#000080" },
  revenue: { en: "Revenue", hi: "राजस्व विभाग", color: "#8B4513" },
  police: { en: "Police", hi: "पुलिस विभाग", color: "#1a1a2e" },
  municipal: { en: "Municipal", hi: "नगरपालिका", color: "#2E7D32" },
  esathi: { en: "e-Sathi", hi: "ई-साथी", color: "#FF6F00" },
};

const ALL_SERVICES = [
  { key: "income", dept: "dm", icon: "₹", en: "Income Certificate", hi: "आय प्रमाण पत्र", desc_en: "Annual family income proof", desc_hi: "वार्षिक पारिवारिक आय प्रमाण", fee: 10, days: "3-5" },
  { key: "caste", dept: "dm", icon: "👥", en: "Caste Certificate", hi: "जाति प्रमाण पत्र", desc_en: "SC/ST/OBC verification", desc_hi: "SC/ST/OBC जाति सत्यापन", fee: 10, days: "5-7" },
  { key: "domicile", dept: "dm", icon: "🏠", en: "Domicile Certificate", hi: "निवास प्रमाण पत्र", desc_en: "Proof of residence in UP", desc_hi: "उ.प्र. में निवास का प्रमाण", fee: 10, days: "5-7" },
  { key: "character", dept: "dm", icon: "✓", en: "Character Certificate", hi: "चरित्र प्रमाण पत्र", desc_en: "DM office verification", desc_hi: "डीएम कार्यालय सत्यापन", fee: 15, days: "7-10" },
  { key: "birth", dept: "municipal", icon: "👶", en: "Birth Certificate", hi: "जन्म प्रमाण पत्र", desc_en: "Official birth record", desc_hi: "आधिकारिक जन्म रिकॉर्ड", fee: 0, days: "3-5" },
  { key: "death", dept: "municipal", icon: "📋", en: "Death Certificate", hi: "मृत्यु प्रमाण पत्र", desc_en: "Official death record", desc_hi: "आधिकारिक मृत्यु रिकॉर्ड", fee: 0, days: "3-5" },
  { key: "marriage", dept: "municipal", icon: "💍", en: "Marriage Certificate", hi: "विवाह प्रमाण पत्र", desc_en: "Marriage registration", desc_hi: "विवाह पंजीकरण", fee: 50, days: "7-15" },
  { key: "property_tax", dept: "municipal", icon: "🏢", en: "Property Tax Payment", hi: "संपत्ति कर भुगतान", desc_en: "Pay property tax online", desc_hi: "ऑनलाइन संपत्ति कर भुगतान", fee: 0, days: "Instant" },
  { key: "trade_license", dept: "municipal", icon: "🏪", en: "Trade License", hi: "व्यापार लाइसेंस", desc_en: "Business operation license", desc_hi: "व्यापार संचालन लाइसेंस", fee: 200, days: "10-15" },
  { key: "police_verify", dept: "police", icon: "🔍", en: "Police Verification", hi: "पुलिस सत्यापन", desc_en: "Character & address check", desc_hi: "चरित्र व पता जांच", fee: 0, days: "7-15" },
  { key: "fir_status", dept: "police", icon: "📝", en: "FIR Status", hi: "एफआईआर स्थिति", desc_en: "Track FIR & complaint status", desc_hi: "एफआईआर और शिकायत स्थिति", fee: 0, days: "—" },
  { key: "passport_noc", dept: "police", icon: "🛂", en: "Passport NOC", hi: "पासपोर्ट अनापत्ति", desc_en: "Police NOC for passport", desc_hi: "पासपोर्ट हेतु पुलिस अनापत्ति", fee: 0, days: "15-21" },
  { key: "land_record", dept: "revenue", icon: "📜", en: "Land Record / Khatauni", hi: "भूलेख / खतौनी", desc_en: "View & download land records", desc_hi: "भूलेख देखें व डाउनलोड करें", fee: 10, days: "Instant" },
  { key: "mutation", dept: "revenue", icon: "📐", en: "Mutation / Dakhil Kharij", hi: "दाखिल खारिज", desc_en: "Land ownership transfer", desc_hi: "भूमि स्वामित्व हस्तांतरण", fee: 25, days: "15-30" },
  { key: "rent_agreement", dept: "revenue", icon: "📄", en: "e-Rent Agreement", hi: "ई-किराया अनुबंध", desc_en: "Online rent agreement registration", desc_hi: "ऑनलाइन किराया अनुबंध पंजीकरण", fee: 100, days: "1-2" },
  { key: "solvency", dept: "esathi", icon: "🏦", en: "Solvency Certificate", hi: "शोधन क्षमता प्रमाण पत्र", desc_en: "Financial solvency proof via e-Sathi", desc_hi: "ई-साथी द्वारा शोधन क्षमता प्रमाण", fee: 20, days: "5-7" },
  { key: "freedom_fighter", dept: "esathi", icon: "🇮🇳", en: "Freedom Fighter Certificate", hi: "स्वतंत्रता सेनानी प्रमाण पत्र", desc_en: "Heritage verification via e-Sathi", desc_hi: "ई-साथी द्वारा विरासत सत्यापन", fee: 10, days: "10-15" },
  { key: "obc_ncl", dept: "esathi", icon: "📃", en: "OBC Non-Creamy Layer", hi: "OBC नॉन-क्रीमी लेयर", desc_en: "Income-based OBC verification", desc_hi: "आय आधारित OBC सत्यापन", fee: 10, days: "7-10" },
];

// ─── Mock Data ───
const initialApplications = [
  { id: "GBN-2026-0001", name: "Rajesh Kumar", nameHi: "राजेश कुमार", fatherName: "Shri Ram Prasad", fatherNameHi: "श्री राम प्रसाद", service: "income", dept: "dm", mobile: "9876543210", aadhaar: "1234-5678-9012", address: "Sector 62, Noida", addressHi: "सेक्टर 62, नोएडा", tehsil: "Dadri", tehsilHi: "दादरी", village: "Surajpur", villageHi: "सूरजपुर", purpose: "Scholarship", purposeHi: "छात्रवृत्ति", status: "pending", dateApplied: "2026-03-10", lastUpdated: "2026-03-10", remarks: "", remarksHi: "", paid: true, ekyc: true, digilocker: false, esathiRef: "", timeline: [{ date: "2026-03-10", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }] },
  { id: "GBN-2026-0002", name: "Priya Sharma", nameHi: "प्रिया शर्मा", fatherName: "Shri Anil Sharma", fatherNameHi: "श्री अनिल शर्मा", service: "caste", dept: "dm", mobile: "9988776655", aadhaar: "9876-5432-1098", address: "Sector 18, Noida", addressHi: "सेक्टर 18, नोएडा", tehsil: "Noida", tehsilHi: "नोएडा", village: "Sector 18", villageHi: "सेक्टर 18", purpose: "Government Job", purposeHi: "सरकारी नौकरी", status: "processing", dateApplied: "2026-03-05", lastUpdated: "2026-03-12", remarks: "Documents under verification", remarksHi: "दस्तावेज़ सत्यापन में", paid: true, ekyc: true, digilocker: true, esathiRef: "ES-2026-44821", timeline: [{ date: "2026-03-05", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }, { date: "2026-03-06", status: "ekyc", note: "Aadhaar e-KYC verified", noteHi: "आधार ई-केवाईसी सत्यापित" }, { date: "2026-03-08", status: "processing", note: "Assigned to verification officer", noteHi: "सत्यापन अधिकारी को सौंपा गया" }, { date: "2026-03-12", status: "processing", note: "Documents under verification", noteHi: "दस्तावेज़ सत्यापन में" }] },
  { id: "GBN-2026-0003", name: "Amit Singh", nameHi: "अमित सिंह", fatherName: "Shri Vijay Singh", fatherNameHi: "श्री विजय सिंह", service: "domicile", dept: "dm", mobile: "9112233445", aadhaar: "5566-7788-9900", address: "Greater Noida West", addressHi: "ग्रेटर नोएडा वेस्ट", tehsil: "Dadri", tehsilHi: "दादरी", village: "Bisrakh", villageHi: "बिसरख", purpose: "College Admission", purposeHi: "कॉलेज प्रवेश", status: "approved", dateApplied: "2026-02-20", lastUpdated: "2026-03-01", remarks: "All documents verified. Certificate ready.", remarksHi: "सभी दस्तावेज़ सत्यापित। प्रमाण पत्र तैयार।", paid: true, ekyc: true, digilocker: true, esathiRef: "ES-2026-38012", timeline: [{ date: "2026-02-20", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }, { date: "2026-02-20", status: "paid", note: "Fee ₹10 paid via UPI", noteHi: "शुल्क ₹10 UPI से भुगतान" }, { date: "2026-02-21", status: "ekyc", note: "Aadhaar e-KYC verified", noteHi: "आधार ई-केवाईसी सत्यापित" }, { date: "2026-02-23", status: "processing", note: "Assigned to verification officer", noteHi: "सत्यापन अधिकारी को सौंपा गया" }, { date: "2026-02-27", status: "processing", note: "Field verification completed", noteHi: "क्षेत्रीय सत्यापन पूर्ण" }, { date: "2026-03-01", status: "approved", note: "Certificate issued — available on DigiLocker", noteHi: "प्रमाण पत्र जारी — डिजिलॉकर पर उपलब्ध" }] },
  { id: "GBN-2026-0004", name: "Sunita Devi", nameHi: "सुनीता देवी", fatherName: "Shri Mohan Lal", fatherNameHi: "श्री मोहन लाल", service: "police_verify", dept: "police", mobile: "9223344556", aadhaar: "1122-3344-5566", address: "Sector 137, Noida", addressHi: "सेक्टर 137, नोएडा", tehsil: "Noida", tehsilHi: "नोएडा", village: "Sector 137", villageHi: "सेक्टर 137", purpose: "Passport Application", purposeHi: "पासपोर्ट आवेदन", status: "rejected", dateApplied: "2026-02-15", lastUpdated: "2026-02-25", remarks: "Incomplete address proof. Please reapply.", remarksHi: "अपूर्ण पता प्रमाण। कृपया पुनः आवेदन करें।", paid: false, ekyc: true, digilocker: false, esathiRef: "", timeline: [{ date: "2026-02-15", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }, { date: "2026-02-18", status: "processing", note: "Assigned to verification officer", noteHi: "सत्यापन अधिकारी को सौंपा गया" }, { date: "2026-02-25", status: "rejected", note: "Address proof mismatch — rejected", noteHi: "पता प्रमाण मेल नहीं — अस्वीकृत" }] },
  { id: "GBN-2026-0005", name: "Vikram Yadav", nameHi: "विक्रम यादव", fatherName: "Shri Suresh Yadav", fatherNameHi: "श्री सुरेश यादव", service: "income", dept: "dm", mobile: "9334455667", aadhaar: "6677-8899-0011", address: "Jewar, Gautam Budh Nagar", addressHi: "जेवर, गौतम बुद्ध नगर", tehsil: "Jewar", tehsilHi: "जेवर", village: "Jewar Town", villageHi: "जेवर टाउन", purpose: "Bank Loan", purposeHi: "बैंक ऋण", status: "ready", dateApplied: "2026-03-01", lastUpdated: "2026-03-15", remarks: "Certificate ready for collection at Tehsil office.", remarksHi: "प्रमाण पत्र तहसील कार्यालय से संग्रह हेतु तैयार।", paid: true, ekyc: true, digilocker: true, esathiRef: "ES-2026-51093", timeline: [{ date: "2026-03-01", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }, { date: "2026-03-01", status: "paid", note: "Fee ₹10 paid via UPI", noteHi: "शुल्क ₹10 UPI से भुगतान" }, { date: "2026-03-02", status: "ekyc", note: "Aadhaar e-KYC verified", noteHi: "आधार ई-केवाईसी सत्यापित" }, { date: "2026-03-05", status: "processing", note: "Assigned to verification officer", noteHi: "सत्यापन अधिकारी को सौंपा गया" }, { date: "2026-03-10", status: "approved", note: "Verified and approved", noteHi: "सत्यापित और स्वीकृत" }, { date: "2026-03-15", status: "ready", note: "Certificate on DigiLocker & ready for physical collection", noteHi: "प्रमाण पत्र डिजिलॉकर पर और भौतिक संग्रह हेतु तैयार" }] },
  { id: "GBN-2026-0006", name: "Meena Kumari", nameHi: "मीना कुमारी", fatherName: "Shri Rampal", fatherNameHi: "श्री रामपाल", service: "birth", dept: "municipal", mobile: "9445566778", aadhaar: "2233-4455-6677", address: "Dankaur, GB Nagar", addressHi: "दनकौर, जी.बी. नगर", tehsil: "Dankaur", tehsilHi: "दनकौर", village: "Dankaur Town", villageHi: "दनकौर टाउन", purpose: "School Admission", purposeHi: "विद्यालय प्रवेश", status: "approved", dateApplied: "2026-03-08", lastUpdated: "2026-03-14", remarks: "Birth certificate issued.", remarksHi: "जन्म प्रमाण पत्र जारी।", paid: false, ekyc: true, digilocker: true, esathiRef: "", timeline: [{ date: "2026-03-08", status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }, { date: "2026-03-10", status: "processing", note: "Hospital records verified", noteHi: "अस्पताल रिकॉर्ड सत्यापित" }, { date: "2026-03-14", status: "approved", note: "Birth certificate issued", noteHi: "जन्म प्रमाण पत्र जारी" }] },
  { id: "GBN-2026-0007", name: "Suraj Pal", nameHi: "सूरज पाल", fatherName: "Shri Hira Lal", fatherNameHi: "श्री हीरा लाल", service: "land_record", dept: "revenue", mobile: "9556677889", aadhaar: "3344-5566-7788", address: "Bisrakh, GB Nagar", addressHi: "बिसरख, जी.बी. नगर", tehsil: "Dadri", tehsilHi: "दादरी", village: "Bisrakh", villageHi: "बिसरख", purpose: "Land verification", purposeHi: "भूमि सत्यापन", status: "approved", dateApplied: "2026-03-12", lastUpdated: "2026-03-12", remarks: "Khatauni downloaded.", remarksHi: "खतौनी डाउनलोड हुई।", paid: true, ekyc: true, digilocker: false, esathiRef: "", timeline: [{ date: "2026-03-12", status: "submitted", note: "Request received", noteHi: "अनुरोध प्राप्त हुआ" }, { date: "2026-03-12", status: "approved", note: "Khatauni record available for download", noteHi: "खतौनी रिकॉर्ड डाउनलोड हेतु उपलब्ध" }] },
];

const mockFeedbacks = [
  { id: 1, ref: "GBN-2026-0003", rating: 5, category: "Service Quality", message: "Very smooth process. Got my domicile certificate on DigiLocker within 10 days!", date: "2026-03-05" },
  { id: 2, ref: "GBN-2026-0004", rating: 2, category: "Processing Speed", message: "Application was rejected without clear reason. Need better communication.", date: "2026-03-01" },
  { id: 3, ref: "", rating: 4, category: "Portal Usability", message: "Good initiative. Hindi support and voice input are very helpful for local citizens.", date: "2026-02-28" },
  { id: 4, ref: "GBN-2026-0005", rating: 5, category: "UPI Payment", message: "UPI payment was instant. No need to visit tehsil for fee payment!", date: "2026-03-16" },
];

// ─── Translations (compact) ───
const L = (lang, en, hi) => lang === "en" ? en : hi;

// ─── Ashoka Chakra SVG ───
function AshokaChakra({ size = 40 }) {
  const r = size / 2, sl = r * 0.75;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke="#000080" strokeWidth="1.5" />
      <circle cx={r} cy={r} r={r * 0.15} fill="#000080" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 - 90) * Math.PI / 180;
        return <line key={i} x1={r} y1={r} x2={r + sl * Math.cos(a)} y2={r + sl * Math.sin(a)} stroke="#000080" strokeWidth="1" />;
      })}
    </svg>
  );
}

// ─── Status Badge ───
function StatusBadge({ status, lang }) {
  const labels = {
    pending: { en: "Pending Review", hi: "समीक्षा लंबित", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    processing: { en: "Under Processing", hi: "प्रसंस्करण में", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    approved: { en: "Approved", hi: "स्वीकृत", bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    rejected: { en: "Rejected", hi: "अस्वीकृत", bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    ready: { en: "Ready for Collection", hi: "संग्रह हेतु तैयार", bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
    ekyc: { en: "e-KYC Verified", hi: "ई-केवाईसी सत्यापित", bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-300" },
    paid: { en: "Fee Paid", hi: "शुल्क भुगतान", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  };
  const c = labels[status] || labels.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {status === "approved" || status === "ready" ? <CheckCircle size={12} /> : status === "rejected" ? <XCircle size={12} /> : <Clock size={12} />}
      {c[lang]}
    </span>
  );
}

// ─── Header ───
function Header({ lang, setLang, page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "home", icon: Home, en: "Home", hi: "होम" },
    { key: "apply", icon: FileText, en: "Apply", hi: "आवेदन" },
    { key: "track", icon: Search, en: "Track", hi: "स्थिति" },
    { key: "digilocker", icon: Link2, en: "DigiLocker", hi: "डिजिलॉकर" },
    { key: "feedback", icon: MessageSquare, en: "Feedback", hi: "प्रतिक्रिया" },
    { key: "admin", icon: Settings, en: "Admin", hi: "प्रशासन" },
  ];
  return (
    <header style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="flex" style={{ height: 4 }}>
        <div className="flex-1" style={{ background: "#FF9933" }} />
        <div className="flex-1" style={{ background: "#FFFFFF" }} />
        <div className="flex-1" style={{ background: "#138808" }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
            <div className="bg-white rounded-full p-1.5"><AshokaChakra size={36} /></div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">{L(lang, "District Magistrate Office", "जिला मजिस्ट्रेट कार्यालय")}</h1>
              <p className="text-blue-200 text-xs">{L(lang, "Gautam Budh Nagar, Uttar Pradesh", "गौतम बुद्ध नगर, उत्तर प्रदेश")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* SMS/Notification toggle */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-lg">
              <Smartphone size={12} className="text-green-400" />
              <span className="text-green-300 text-xs">{L(lang, "SMS Active", "SMS सक्रिय")}</span>
            </div>
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
              <Globe size={14} />{lang === "en" ? "हिंदी" : "English"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white"><Menu size={22} /></button>
          </div>
        </div>
        <nav className={`${menuOpen ? "block" : "hidden"} md:block mt-3`}>
          <div className="flex flex-col md:flex-row gap-1 md:gap-0">
            {navItems.map(({ key, icon: Icon, en, hi }) => (
              <button key={key} onClick={() => { setPage(key); setMenuOpen(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === key ? "bg-white/20 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"}`}>
                <Icon size={14} />{L(lang, en, hi)}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

// ─── Home Page ───
function HomePage({ lang, setPage }) {
  const deptKeys = Object.keys(DEPARTMENTS);
  return (
    <div>
      {/* Hero */}
      <div className="text-center py-12 px-4" style={{ background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)" }}>
        <div className="bg-white/60 inline-block rounded-full p-3 mb-4"><AshokaChakra size={60} /></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{L(lang, "Welcome to e-Seva Portal", "ई-सेवा पोर्टल में आपका स्वागत है")}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-3">{L(lang,
          "Apply for government certificates, pay fees via UPI, verify identity with Aadhaar e-KYC, receive certificates on DigiLocker, and track applications — all from one place or via WhatsApp.",
          "सरकारी प्रमाण पत्रों के लिए आवेदन करें, UPI से शुल्क भुगतान करें, आधार ई-केवाईसी से पहचान सत्यापित करें, डिजिलॉकर पर प्रमाण पत्र प्राप्त करें — सब एक ही जगह या WhatsApp से।"
        )}</p>
        {/* Integration badges */}
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          {[
            { icon: Fingerprint, label: L(lang, "Aadhaar e-KYC", "आधार ई-केवाईसी"), color: "#FF6F00" },
            { icon: IndianRupee, label: L(lang, "UPI Payments", "UPI भुगतान"), color: "#138808" },
            { icon: Link2, label: L(lang, "DigiLocker", "डिजिलॉकर"), color: "#000080" },
            { icon: MessageCircle, label: L(lang, "AI WhatsApp Bot", "AI WhatsApp बॉट"), color: "#25D366" },
            { icon: ExternalLink, label: L(lang, "e-Sathi Sync", "ई-साथी सिंक"), color: "#FF6F00" },
            { icon: Smartphone, label: L(lang, "SMS Fallback", "SMS फॉलबैक"), color: "#7B2D8E" },
          ].map(({ icon: Icon, label, color }, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium" style={{ color }}>
              <Icon size={13} />{label}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={() => setPage("apply")} className="px-6 py-2.5 rounded-lg font-semibold text-white transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #FF9933, #FF7700)" }}>
            {L(lang, "Apply Now", "अभी आवेदन करें")} <ChevronRight className="inline" size={16} />
          </button>
          <button onClick={() => setPage("track")} className="px-6 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-blue-500 transition-colors">
            {L(lang, "Track Application", "आवेदन ट्रैक करें")}
          </button>
        </div>
      </div>

      {/* Departments */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">{L(lang, "Services by Department", "विभाग अनुसार सेवाएं")}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{L(lang, `${ALL_SERVICES.length} services across ${deptKeys.length} departments — inspired by Mana Mitra`, `${ALL_SERVICES.length} सेवाएं ${deptKeys.length} विभागों में — मना मित्र से प्रेरित`)}</p>
        {deptKeys.map(dk => {
          const deptServices = ALL_SERVICES.filter(s => s.dept === dk);
          if (!deptServices.length) return null;
          return (
            <div key={dk} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: DEPARTMENTS[dk].color }} />
                <h4 className="font-bold text-gray-800">{DEPARTMENTS[dk][lang]} <span className="text-xs font-normal text-gray-400">({deptServices.length} {L(lang, "services", "सेवाएं")})</span></h4>
                {dk === "esathi" && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">e-Sathi Integrated</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {deptServices.map(svc => (
                  <button key={svc.key} onClick={() => setPage("apply")} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left group flex items-start gap-3">
                    <span className="text-2xl">{svc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700">{svc[lang]}</h5>
                      <p className="text-xs text-gray-500">{lang === "en" ? svc.desc_en : svc.desc_hi}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {svc.fee > 0 && <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">₹{svc.fee}</span>}
                        <span className="text-xs text-gray-400">{svc.days} {L(lang, "days", "दिन")}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* How it works — enhanced */}
      <div className="bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">{L(lang, "How It Works", "कैसे काम करता है")}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { icon: FileText, label: L(lang, "Select Service", "सेवा चुनें"), color: "#FF9933" },
              { icon: Fingerprint, label: L(lang, "Aadhaar e-KYC", "आधार ई-केवाईसी"), color: "#FF6F00" },
              { icon: Upload, label: L(lang, "Fill & Upload", "भरें और अपलोड"), color: "#000080" },
              { icon: IndianRupee, label: L(lang, "Pay via UPI", "UPI से भुगतान"), color: "#138808" },
              { icon: Search, label: L(lang, "Track Status", "स्थिति ट्रैक"), color: "#7B2D8E" },
              { icon: Link2, label: L(lang, "Get on DigiLocker", "डिजिलॉकर पर प्राप्त"), color: "#0066CC" },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} className="text-center">
                <div className="w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center text-white" style={{ background: color }}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { val: "12,847", label: L(lang, "Applications", "आवेदन"), color: "#FF9933" },
            { val: "11,203", label: L(lang, "Certificates Issued", "प्रमाण पत्र जारी"), color: "#138808" },
            { val: "₹4.2L", label: L(lang, "UPI Fees Collected", "UPI शुल्क एकत्रित"), color: "#000080" },
            { val: "2,841", label: L(lang, "DigiLocker Deliveries", "डिजिलॉकर वितरण"), color: "#7B2D8E" },
          ].map(({ val, label, color }, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold" style={{ color }}>{val}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* e-Sathi sync banner */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="bg-orange-100 rounded-full p-3"><ExternalLink size={24} className="text-orange-600" /></div>
          <div className="flex-1">
            <h4 className="font-bold text-orange-900">{L(lang, "Connected to UP e-Sathi Portal", "उ.प्र. ई-साथी पोर्टल से जुड़ा")}</h4>
            <p className="text-sm text-orange-700">{L(lang,
              "Applications sync automatically with edistrict.up.gov.in. Your e-Sathi reference number is generated for every application for cross-platform tracking.",
              "आवेदन स्वचालित रूप से edistrict.up.gov.in से सिंक होते हैं। प्रत्येक आवेदन के लिए ई-साथी संदर्भ संख्या उत्पन्न होती है।"
            )}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> {L(lang, "Synced", "सिंक्ड")}
          </div>
        </div>
      </div>

      {/* SMS Fallback banner */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="bg-purple-100 rounded-full p-3"><Smartphone size={24} className="text-purple-600" /></div>
          <div className="flex-1">
            <h4 className="font-bold text-purple-900">{L(lang, "SMS Fallback for Non-WhatsApp Users", "गैर-WhatsApp उपयोगकर्ताओं के लिए SMS")}</h4>
            <p className="text-sm text-purple-700">{L(lang,
              "Citizens without smartphones can send SMS to 1800-XXX-XXXX to apply, track status, and receive updates. Critical for rural tehsils like Jewar and Dankaur.",
              "बिना स्मार्टफोन वाले नागरिक 1800-XXX-XXXX पर SMS भेजकर आवेदन कर सकते हैं, स्थिति ट्रैक कर सकते हैं। जेवर और दनकौर जैसे ग्रामीण तहसीलों के लिए महत्वपूर्ण।"
            )}</p>
          </div>
          <div className="text-xs bg-white border border-purple-200 rounded-lg p-2 font-mono text-purple-800">
            SMS "APPLY INCOME" → 1800-XXX-XXXX
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-lg">{L(lang, "Helpline", "हेल्पलाइन")}: 1800-XXX-XXXX</h4>
            <p className="text-gray-400 text-sm flex items-center gap-2"><Mail size={14} /> dm-gbn@nic.in</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin size={14} /> Collectorate, Surajpur, Greater Noida, UP — 201306
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UPI Payment Modal ───
function UPIPaymentModal({ amount, onComplete, onCancel, lang }) {
  const [step, setStep] = useState("choose"); // choose, qr, processing, done
  useEffect(() => {
    if (step === "processing") {
      const t = setTimeout(() => setStep("done"), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);
  useEffect(() => {
    if (step === "done") {
      const t = setTimeout(onComplete, 1000);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
        {step === "choose" && <>
          <IndianRupee size={32} className="mx-auto text-green-600 mb-3" />
          <h3 className="font-bold text-lg text-gray-900 mb-1">{L(lang, "Pay Application Fee", "आवेदन शुल्क भुगतान")}</h3>
          <div className="text-3xl font-bold text-green-700 mb-4">₹{amount}</div>
          <div className="space-y-2 mb-4">
            <button onClick={() => setStep("qr")} className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 flex items-center justify-center gap-2"><QrCode size={16} /> {L(lang, "Pay with UPI QR", "UPI QR से भुगतान")}</button>
            <button onClick={() => setStep("processing")} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 flex items-center justify-center gap-2"><Smartphone size={16} /> {L(lang, "Pay with UPI ID", "UPI ID से भुगतान")}</button>
          </div>
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">{L(lang, "Pay Later", "बाद में भुगतान")}</button>
        </>}
        {step === "qr" && <>
          <h3 className="font-bold text-gray-900 mb-3">{L(lang, "Scan QR Code", "QR कोड स्कैन करें")}</h3>
          <div className="bg-gray-100 rounded-xl p-6 mb-4 inline-block">
            <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto">
              <div className="grid grid-cols-5 gap-1">
                {Array.from({length: 25}).map((_, i) => <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.4 ? "bg-gray-900" : "bg-white"}`} />)}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">UPI: gbnagar-dm@gov.upi</p>
          <button onClick={() => setStep("processing")} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm">{L(lang, "I've Paid", "मैंने भुगतान किया")}</button>
        </>}
        {step === "processing" && <>
          <RefreshCw size={32} className="mx-auto text-blue-600 mb-3 animate-spin" />
          <h3 className="font-bold text-gray-900">{L(lang, "Verifying Payment...", "भुगतान सत्यापित हो रहा है...")}</h3>
        </>}
        {step === "done" && <>
          <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
          <h3 className="font-bold text-green-800">{L(lang, "Payment Successful!", "भुगतान सफल!")}</h3>
          <p className="text-sm text-gray-500">₹{amount} {L(lang, "received", "प्राप्त")}</p>
        </>}
      </div>
    </div>
  );
}

// ─── Aadhaar e-KYC Modal ───
function EKYCModal({ onComplete, onSkip, lang }) {
  const [step, setStep] = useState("input"); // input, otp, verifying, done
  const [aadhaar, setAadhaar] = useState("");
  useEffect(() => {
    if (step === "verifying") { const t = setTimeout(() => setStep("done"), 2000); return () => clearTimeout(t); }
    if (step === "done") { const t = setTimeout(() => onComplete(aadhaar), 1000); return () => clearTimeout(t); }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
        <Fingerprint size={32} className="mx-auto text-orange-600 mb-3" />
        <h3 className="font-bold text-lg text-gray-900 mb-1">{L(lang, "Aadhaar e-KYC Verification", "आधार ई-केवाईसी सत्यापन")}</h3>
        {step === "input" && <>
          <p className="text-sm text-gray-500 mb-4">{L(lang, "Verify your identity to auto-fill application details", "आवेदन विवरण स्वतः भरने हेतु पहचान सत्यापित करें")}</p>
          <input value={aadhaar} onChange={e => setAadhaar(e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-mono tracking-widest focus:border-orange-500 outline-none mb-4" />
          <button onClick={() => setStep("otp")} disabled={aadhaar.length < 12} className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-700 disabled:opacity-40">{L(lang, "Send OTP", "OTP भेजें")}</button>
          <button onClick={onSkip} className="mt-2 text-sm text-gray-500 hover:text-gray-700">{L(lang, "Skip e-KYC", "ई-केवाईसी छोड़ें")}</button>
        </>}
        {step === "otp" && <>
          <p className="text-sm text-gray-500 mb-4">{L(lang, "Enter OTP sent to your registered mobile", "पंजीकृत मोबाइल पर भेजा गया OTP दर्ज करें")}</p>
          <div className="flex justify-center gap-2 mb-4">
            {[0,1,2,3,4,5].map(i => <input key={i} maxLength={1} className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-orange-500 outline-none" />)}
          </div>
          <button onClick={() => setStep("verifying")} className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-medium text-sm">{L(lang, "Verify OTP", "OTP सत्यापित करें")}</button>
        </>}
        {step === "verifying" && <>
          <RefreshCw size={32} className="mx-auto text-orange-600 mb-3 animate-spin" />
          <p className="text-sm text-gray-600">{L(lang, "Verifying with UIDAI...", "UIDAI से सत्यापित हो रहा है...")}</p>
        </>}
        {step === "done" && <>
          <ShieldCheck size={48} className="mx-auto text-green-500 mb-3" />
          <h3 className="font-bold text-green-800">{L(lang, "e-KYC Verified!", "ई-केवाईसी सत्यापित!")}</h3>
          <p className="text-xs text-gray-500">{L(lang, "Identity confirmed via UIDAI", "UIDAI द्वारा पहचान की पुष्टि")}</p>
        </>}
      </div>
    </div>
  );
}

// ─── Apply Page ───
function ApplyPage({ lang, applications, setApplications, setPage }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState("dept"); // dept, service, ekyc, form, payment, success
  const [form, setForm] = useState({ name: "", fatherName: "", dob: "", gender: "", address: "", tehsil: "", village: "", mobile: "", purpose: "" });
  const [aadhaar, setAadhaar] = useState("");
  const [ekycDone, setEkycDone] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [fileName, setFileName] = useState("");

  const svc = ALL_SERVICES.find(s => s.key === selectedService);

  const handleEKYCComplete = (aNum) => { setAadhaar(aNum); setEkycDone(true); setStep("form"); };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (svc && svc.fee > 0) { setStep("payment"); }
    else { finalizeApplication(false); }
  };
  const finalizeApplication = (paid) => {
    const id = `GBN-2026-${String(applications.length + 1).padStart(4, "0")}`;
    const now = new Date().toISOString().split("T")[0];
    const esRef = svc?.dept === "esathi" || svc?.dept === "dm" ? `ES-2026-${String(Math.floor(Math.random() * 90000) + 10000)}` : "";
    const tl = [{ date: now, status: "submitted", note: "Application received", noteHi: "आवेदन प्राप्त हुआ" }];
    if (ekycDone) tl.push({ date: now, status: "ekyc", note: "Aadhaar e-KYC verified", noteHi: "आधार ई-केवाईसी सत्यापित" });
    if (paid) tl.push({ date: now, status: "paid", note: `Fee ₹${svc.fee} paid via UPI`, noteHi: `शुल्क ₹${svc.fee} UPI से भुगतान` });
    const newApp = {
      id, name: form.name, nameHi: form.name, fatherName: form.fatherName, fatherNameHi: form.fatherName, service: selectedService, dept: svc?.dept || "dm",
      mobile: form.mobile, aadhaar, address: form.address, tehsil: form.tehsil, village: form.village, purpose: form.purpose,
      status: "pending", dateApplied: now, lastUpdated: now, remarks: "", paid, ekyc: ekycDone, digilocker: false, esathiRef: esRef, timeline: tl,
    };
    setApplications(prev => [...prev, newApp]);
    setSubmittedId(id);
    setStep("success");
  };

  const reset = () => {
    setSelectedDept(null); setSelectedService(null); setStep("dept"); setForm({ name: "", fatherName: "", dob: "", gender: "", address: "", tehsil: "", village: "", mobile: "", purpose: "" });
    setAadhaar(""); setEkycDone(false); setSubmittedId(null); setFileName("");
  };

  // e-KYC modal
  if (step === "ekyc") return <EKYCModal lang={lang} onComplete={handleEKYCComplete} onSkip={() => { setEkycDone(false); setStep("form"); }} />;
  // UPI payment modal
  if (step === "payment") return <UPIPaymentModal lang={lang} amount={svc?.fee || 0} onComplete={() => finalizeApplication(true)} onCancel={() => finalizeApplication(false)} />;

  // Success
  if (step === "success") {
    const app = applications.find(a => a.id === submittedId);
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{L(lang, "Application Submitted!", "आवेदन जमा हो गया!")}</h3>
          <div className="bg-white rounded-lg px-6 py-3 inline-block border-2 border-green-400 mb-3">
            <span className="text-2xl font-mono font-bold text-green-700">{submittedId}</span>
          </div>
          {app?.esathiRef && (
            <p className="text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-1.5 inline-block mb-3">
              e-Sathi Ref: <span className="font-mono font-bold">{app.esathiRef}</span>
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {ekycDone && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={10} /> e-KYC ✓</span>}
            {app?.paid && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><IndianRupee size={10} /> Paid ✓</span>}
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1"><Smartphone size={10} /> SMS {L(lang, "updates ON", "अपडेट चालू")}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">{L(lang, "Track via web, WhatsApp, or SMS. Certificate will be delivered to DigiLocker upon approval.", "वेब, WhatsApp या SMS से ट्रैक करें। स्वीकृति पर प्रमाण पत्र डिजिलॉकर पर मिलेगा।")}</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setPage("track")} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{L(lang, "Track", "ट्रैक करें")}</button>
            <button onClick={reset} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">{L(lang, "New Application", "नया आवेदन")}</button>
          </div>
        </div>
      </div>
    );
  }

  // Department selection
  if (step === "dept") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{L(lang, "Apply for Service", "सेवा के लिए आवेदन करें")}</h2>
        <p className="text-gray-500 mb-6">{L(lang, "Select a department", "विभाग चुनें")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(DEPARTMENTS).map(([dk, d]) => {
            const count = ALL_SERVICES.filter(s => s.dept === dk).length;
            return (
              <button key={dk} onClick={() => { setSelectedDept(dk); setStep("service"); }}
                className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-white" style={{ background: d.color }}>
                  {dk === "police" ? <Scale size={18}/> : dk === "municipal" ? <Building2 size={18}/> : dk === "revenue" ? <Landmark size={18}/> : dk === "esathi" ? <ExternalLink size={18}/> : <FileCheck size={18}/>}
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-blue-700">{d[lang]}</h4>
                <p className="text-xs text-gray-400 mt-1">{count} {L(lang, "services", "सेवाएं")}</p>
                {dk === "esathi" && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-2 inline-block">{L(lang, "Syncs with e-Sathi Portal", "ई-साथी से सिंक")}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Service selection
  if (step === "service") {
    const deptServices = ALL_SERVICES.filter(s => s.dept === selectedDept);
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => { setStep("dept"); setSelectedDept(null); }} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"><ArrowLeft size={14} /> {L(lang, "Back to Departments", "विभागों पर वापस")}</button>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{DEPARTMENTS[selectedDept]?.[lang]}</h2>
        <p className="text-gray-500 text-sm mb-6">{L(lang, "Select a service to apply", "आवेदन के लिए सेवा चुनें")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {deptServices.map(svc => (
            <button key={svc.key} onClick={() => { setSelectedService(svc.key); setStep("ekyc"); }}
              className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left group flex items-start gap-3">
              <span className="text-2xl">{svc.icon}</span>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 group-hover:text-blue-700">{svc[lang]}</h5>
                <p className="text-xs text-gray-500">{lang === "en" ? svc.desc_en : svc.desc_hi}</p>
                <div className="flex items-center gap-3 mt-2">
                  {svc.fee > 0 ? <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">₹{svc.fee} UPI</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{L(lang, "Free", "निःशुल्क")}</span>}
                  <span className="text-xs text-gray-400">{svc.days} {L(lang, "days", "दिन")}</span>
                </div>
              </div>
              <ChevronRight className="mt-2 text-gray-400 group-hover:text-blue-500" size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Application form
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => setStep("service")} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"><ArrowLeft size={14} /> {L(lang, "Back", "वापस")}</button>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2 pb-4 border-b">
          <span className="text-2xl">{svc?.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{svc?.[lang]}</h3>
            <p className="text-xs text-gray-400">{DEPARTMENTS[svc?.dept]?.[lang]}</p>
          </div>
          {ekycDone && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={10} /> e-KYC ✓</span>}
        </div>
        <form onSubmit={handleSubmitForm} className="space-y-4 mt-4">
          {[
            { key: "name", type: "text", label: L(lang, "Full Name (as per Aadhaar)", "पूरा नाम (आधार अनुसार)") },
            { key: "fatherName", type: "text", label: L(lang, "Father's / Husband's Name", "पिता / पति का नाम") },
            { key: "dob", type: "date", label: L(lang, "Date of Birth", "जन्म तिथि") },
          ].map(({ key, type, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Gender", "लिंग")}</label>
            <div className="flex gap-4">
              {(lang === "en" ? ["Male","Female","Other"] : ["पुरुष","महिला","अन्य"]).map((g, i) => (
                <label key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <input type="radio" name="gender" value={g} required onChange={e => setForm({ ...form, gender: e.target.value })} /> {g}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Address", "पता")}</label>
            <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "tehsil", label: L(lang, "Tehsil", "तहसील") },
              { key: "village", label: L(lang, "Village / Ward", "गांव / वार्ड") },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="text" required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Mobile Number", "मोबाइल नंबर")}</label>
            <input type="tel" required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Purpose", "उद्देश्य")}</label>
            <input type="text" required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Upload Documents", "दस्तावेज़ अपलोड करें")}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer" onClick={() => setFileName("aadhaar_card.pdf")}>
              <Upload size={20} className="mx-auto text-gray-400 mb-1" />
              {fileName ? <p className="text-sm text-green-600 font-medium">{fileName}</p> : <p className="text-xs text-gray-500">{L(lang, "Aadhaar, Ration Card, etc. (PDF/JPG, max 5MB)", "आधार, राशन कार्ड आदि (PDF/JPG, अधिकतम 5MB)")}</p>}
            </div>
          </div>
          {/* SMS notification opt-in */}
          <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-3">
            <Smartphone size={18} className="text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">{L(lang, "SMS Status Updates", "SMS स्थिति अपडेट")}</p>
              <p className="text-xs text-purple-600">{L(lang, "Receive updates on your registered mobile", "पंजीकृत मोबाइल पर अपडेट प्राप्त करें")}</p>
            </div>
            <div className="w-10 h-5 bg-purple-600 rounded-full relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-transform hover:scale-[1.01]" style={{ background: "linear-gradient(135deg, #FF9933, #FF7700)" }}>
            {svc?.fee > 0 ? L(lang, `Submit & Pay ₹${svc.fee}`, `जमा करें और ₹${svc.fee} भुगतान करें`) : L(lang, "Submit Application", "आवेदन जमा करें")}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Track Page ───
function TrackPage({ lang, applications }) {
  const [refNum, setRefNum] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const handleSearch = () => { setResult(applications.find(a => a.id.toLowerCase() === refNum.trim().toLowerCase()) || null); setSearched(true); };
  const svc = result ? ALL_SERVICES.find(s => s.key === result.service) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{L(lang, "Track Your Application", "अपना आवेदन ट्रैक करें")}</h2>
      <div className="flex gap-2 mb-6">
        <input value={refNum} onChange={e => setRefNum(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder={L(lang, "Enter Reference Number (e.g., GBN-2026-0001)", "संदर्भ संख्या दर्ज करें")} className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        <button onClick={handleSearch} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5"><Search size={14} /> {L(lang, "Search", "खोजें")}</button>
      </div>
      {searched && !result && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="mx-auto text-red-400 mb-2" size={32} />
          <p className="text-sm text-red-700">{L(lang, "No application found. Check reference number.", "कोई आवेदन नहीं मिला। संदर्भ संख्या जांचें।")}</p>
        </div>
      )}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">{result.id}</span>
              <StatusBadge status={result.status} lang={lang} />
            </div>
            <h3 className="font-bold text-lg text-gray-900">{svc?.[lang] || result.service}</h3>
            <p className="text-xs text-gray-400">{DEPARTMENTS[result.dept]?.[lang]}</p>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {result.ekyc && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Fingerprint size={10} /> e-KYC</span>}
              {result.paid && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><IndianRupee size={10} /> {L(lang, "Paid", "भुगतान")}</span>}
              {result.digilocker && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Link2 size={10} /> DigiLocker</span>}
              {result.esathiRef && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">e-Sathi: {result.esathiRef}</span>}
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">{L(lang, "Applicant", "आवेदक")}</span><p className="font-medium text-gray-900">{lang === "hi" && result.nameHi ? result.nameHi : result.name}</p></div>
            <div><span className="text-gray-400">{L(lang, "Date Applied", "आवेदन तिथि")}</span><p className="font-medium text-gray-900">{result.dateApplied}</p></div>
            <div><span className="text-gray-400">{L(lang, "Last Updated", "अंतिम अपडेट")}</span><p className="font-medium text-gray-900">{result.lastUpdated}</p></div>
            <div><span className="text-gray-400">{L(lang, "Mobile", "मोबाइल")}</span><p className="font-medium text-gray-900">{result.mobile}</p></div>
            {result.remarks && <div className="col-span-2"><span className="text-gray-400">{L(lang, "Remarks", "टिप्पणी")}</span><p className="font-medium text-gray-700">{lang === "hi" && result.remarksHi ? result.remarksHi : result.remarks}</p></div>}
          </div>
          <div className="p-5 bg-gray-50 border-t">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">{L(lang, "Timeline", "समयरेखा")}</h4>
            <div className="space-y-3">
              {result.timeline.map((ev, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === result.timeline.length - 1 ? "bg-blue-500" : ev.status === "ekyc" ? "bg-orange-400" : ev.status === "paid" ? "bg-green-400" : "bg-gray-300"}`} />
                    {i < result.timeline.length - 1 && <div className="w-0.5 h-6 bg-gray-200" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lang === "hi" && ev.noteHi ? ev.noteHi : ev.note}</p>
                    <p className="text-xs text-gray-400">{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!searched && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-2">{L(lang, "Demo reference numbers:", "डेमो संदर्भ संख्याएं:")}</p>
          <div className="flex flex-wrap gap-2">
            {applications.slice(0, 7).map(a => (
              <button key={a.id} onClick={() => setRefNum(a.id)} className="text-xs bg-white px-2.5 py-1 rounded border border-blue-200 text-blue-700 hover:bg-blue-100">{a.id}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DigiLocker Page ───
function DigiLockerPage({ lang, applications }) {
  const [linked, setLinked] = useState(false);
  const approved = applications.filter(a => a.digilocker && (a.status === "approved" || a.status === "ready"));
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{L(lang, "DigiLocker Integration", "डिजिलॉकर इंटीग्रेशन")}</h2>
      <p className="text-gray-500 text-sm mb-6">{L(lang, "Access your government certificates digitally — verified and tamper-proof.", "अपने सरकारी प्रमाण पत्र डिजिटल रूप में प्राप्त करें — सत्यापित और सुरक्षित।")}</p>

      {!linked ? (
        <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center">
          <Link2 size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">{L(lang, "Link Your DigiLocker Account", "अपना डिजिलॉकर खाता जोड़ें")}</h3>
          <p className="text-sm text-gray-600 mb-6">{L(lang, "Connect your DigiLocker to automatically receive approved certificates.", "स्वीकृत प्रमाण पत्र स्वचालित रूप से प्राप्त करने के लिए डिजिलॉकर जोड़ें।")}</p>
          <button onClick={() => setLinked(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 inline-flex items-center gap-2">
            <Fingerprint size={16} /> {L(lang, "Link with Aadhaar", "आधार से जोड़ें")}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <CheckCircle className="text-green-500" size={20} />
            <div className="flex-1">
              <p className="font-medium text-green-800 text-sm">{L(lang, "DigiLocker Linked Successfully", "डिजिलॉकर सफलतापूर्वक जुड़ गया")}</p>
              <p className="text-xs text-green-600">Aadhaar: XXXX-XXXX-7890</p>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">{L(lang, "Your Digital Certificates", "आपके डिजिटल प्रमाण पत्र")} ({approved.length})</h3>
          {approved.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400 text-sm">{L(lang, "No certificates available yet. They will appear here once approved.", "अभी कोई प्रमाण पत्र उपलब्ध नहीं। स्वीकृति के बाद यहां दिखेंगे।")}</div>
          ) : (
            <div className="space-y-3">
              {approved.map(app => {
                const svc = ALL_SERVICES.find(s => s.key === app.service);
                return (
                  <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="text-2xl">{svc?.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{svc?.[lang]}</h4>
                      <p className="text-xs text-gray-400">{app.id} • {app.lastUpdated}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100">{L(lang, "View", "देखें")}</button>
                      <button className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100">{L(lang, "Download", "डाउनलोड")}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Feedback Page ───
function FeedbackPage({ lang }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
        <ThumbsUp size={48} className="mx-auto text-green-500 mb-4" />
        <p className="text-gray-700">{L(lang, "Thank you for your feedback!", "आपकी प्रतिक्रिया के लिए धन्यवाद!")}</p>
      </div>
    </div>
  );
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{L(lang, "Citizen Feedback", "नागरिक प्रतिक्रिया")}</h2>
      <p className="text-gray-500 mb-6">{L(lang, "Help us improve. Your feedback matters.", "सुधार में मदद करें। आपकी प्रतिक्रिया महत्वपूर्ण है।")}</p>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Reference Number (optional)", "संदर्भ संख्या (वैकल्पिक)")}</label>
          <input type="text" placeholder="GBN-2026-XXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{L(lang, "Rate Your Experience", "अनुभव रेट करें")}</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(v => (
              <button key={v} type="button" onClick={() => setRating(v)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${rating === v ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}>
                <Star size={20} className={rating >= v ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Category", "श्रेणी")}</label>
          <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">—</option>
            {(lang === "en" ? ["Service Quality","Processing Speed","Staff Behavior","UPI Payment","Portal Usability","Other"] : ["सेवा गुणवत्ता","प्रसंस्करण गति","कर्मचारी व्यवहार","UPI भुगतान","पोर्टल उपयोगिता","अन्य"]).map((c,i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{L(lang, "Your Feedback", "आपकी प्रतिक्रिया")}</label>
          <textarea required rows={4} placeholder={L(lang, "Share your experience or suggestions...", "अपना अनुभव या सुझाव साझा करें...")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-white text-sm" style={{ background: "linear-gradient(135deg, #138808, #0d6b06)" }}>
          {L(lang, "Submit Feedback", "प्रतिक्रिया जमा करें")}
        </button>
      </form>
    </div>
  );
}

// ─── Admin Dashboard ───
function AdminDashboard({ lang, applications, setApplications }) {
  const [filter, setFilter] = useState("all");
  const [actionModal, setActionModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const counts = { total: applications.length, pending: applications.filter(a => a.status === "pending" || a.status === "processing").length, approved: applications.filter(a => a.status === "approved" || a.status === "ready").length, rejected: applications.filter(a => a.status === "rejected").length };
  const filtered = filter === "all" ? applications : applications.filter(a => {
    if (filter === "pending") return a.status === "pending" || a.status === "processing";
    if (filter === "approved") return a.status === "approved" || a.status === "ready";
    return a.status === filter;
  });
  const handleAction = () => {
    if (!actionModal) return;
    const now = new Date().toISOString().split("T")[0];
    setApplications(prev => prev.map(a => {
      if (a.id !== actionModal.id) return a;
      const ns = actionModal.action === "approve" ? "approved" : "rejected";
      return { ...a, status: ns, lastUpdated: now, remarks: remarks || a.remarks, digilocker: ns === "approved",
        timeline: [...a.timeline, { date: now, status: ns, note: ns === "approved" ? "Approved — certificate sent to DigiLocker" : "Rejected — " + (remarks || "No remarks"), noteHi: ns === "approved" ? "स्वीकृत — प्रमाण पत्र डिजिलॉकर पर भेजा गया" : "अस्वीकृत — " + (remarks || "कोई टिप्पणी नहीं") }] };
    }));
    setActionModal(null); setRemarks("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900">{L(lang, "Admin Dashboard", "प्रशासन डैशबोर्ड")}</h2>
      <p className="text-gray-500 text-sm mb-6">{L(lang, "Application Management — All Departments", "आवेदन प्रबंधन — सभी विभाग")}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { key: "total", val: counts.total, color: "#000080", icon: ClipboardList },
          { key: "pending", val: counts.pending, color: "#FF9933", icon: Clock },
          { key: "approved", val: counts.approved, color: "#138808", icon: CheckCircle },
          { key: "rejected", val: counts.rejected, color: "#CC0000", icon: XCircle },
        ].map(({ key, val, color, icon: Icon }) => (
          <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: color + "15" }}><Icon size={22} style={{ color }} /></div>
            <div><div className="text-2xl font-bold" style={{ color }}>{val}</div><div className="text-xs text-gray-500">{L(lang, key.charAt(0).toUpperCase() + key.slice(1), key === "total" ? "कुल" : key === "pending" ? "लंबित" : key === "approved" ? "स्वीकृत" : "अस्वीकृत")}</div></div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={14} className="text-gray-400" />
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
            {f === "all" ? L(lang, "All", "सभी") : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        {filtered.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">{L(lang, "No applications match filter.", "कोई आवेदन नहीं।")}</div> : (
          <div className="divide-y divide-gray-100">
            {filtered.map(app => {
              const svc = ALL_SERVICES.find(s => s.key === app.service);
              return (
                <div key={app.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-400">{app.id}</span>
                      <StatusBadge status={app.status} lang={lang} />
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{DEPARTMENTS[app.dept]?.[lang]}</span>
                      {app.ekyc && <span className="text-xs text-orange-600"><Fingerprint size={10} className="inline" /> eKYC</span>}
                      {app.paid && <span className="text-xs text-green-600">₹ Paid</span>}
                      {app.esathiRef && <span className="text-xs text-orange-500">{app.esathiRef}</span>}
                    </div>
                    <p className="font-medium text-gray-900 mt-0.5">{lang === "hi" && app.nameHi ? app.nameHi : app.name}</p>
                    <p className="text-xs text-gray-500">{svc?.[lang]} • {app.dateApplied}</p>
                  </div>
                  {(app.status === "pending" || app.status === "processing") && (
                    <div className="flex gap-2">
                      <button onClick={() => setActionModal({ id: app.id, action: "approve" })} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100"><CheckCircle size={12} className="inline mr-1" />{L(lang, "Approve", "स्वीकृत")}</button>
                      <button onClick={() => setActionModal({ id: app.id, action: "reject" })} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100"><XCircle size={12} className="inline mr-1" />{L(lang, "Reject", "अस्वीकृत")}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b font-semibold text-gray-900">{L(lang, "Recent Feedback", "हाल की प्रतिक्रिया")}</div>
        {mockFeedbacks.map(fb => (
          <div key={fb.id} className="p-4 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex">{[1,2,3,4,5].map(v => <Star key={v} size={12} className={fb.rating >= v ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />)}</div>
              <span className="text-xs text-gray-400">{fb.date}</span>
              {fb.ref && <span className="text-xs text-blue-600">{fb.ref}</span>}
            </div>
            <p className="text-sm text-gray-700">{fb.message}</p>
          </div>
        ))}
      </div>

      {actionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h4 className="font-bold text-gray-900 mb-3">{actionModal.action === "approve" ? L(lang, "Confirm Approve", "स्वीकृति पुष्टि") : L(lang, "Confirm Reject", "अस्वीकृति पुष्टि")}: {actionModal.id}</h4>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder={L(lang, "Enter remarks...", "टिप्पणी दर्ज करें...")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setActionModal(null); setRemarks(""); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">{L(lang, "Cancel", "रद्द")}</button>
              <button onClick={handleAction} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${actionModal.action === "approve" ? "bg-green-600" : "bg-red-600"}`}>
                {actionModal.action === "approve" ? L(lang, "Approve", "स्वीकृत") : L(lang, "Reject", "अस्वीकृत")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NLP Intent Engine (Simulated LLM Layer) ───
// Keyword-based NLU supporting English, Hindi (Devanagari), and Hinglish (transliterated)
const NLP_INTENTS = {
  apply: {
    patterns: [
      // English
      /\b(apply|application|new|create|get|need|want|make|request|obtain|issue)\b.*\b(certificate|cert|praman|patra|document|paper)\b/i,
      /\b(certificate|cert|praman|patra)\b.*\b(apply|chahiye|banana|banao|banwa|mil|dilwa|issue)\b/i,
      /\b(i want|i need|mujhe|mujhko|chahiye|chahie|chaiye|banana hai|banwana|karwana|banwa do|apply karna)\b/i,
      // Hindi
      /\b(आवेदन|प्रमाण पत्र|सर्टिफिकेट|बनवाना|बनाना|चाहिए|दिलवा|करवाना)\b/i,
      /\b(नया|नई|आवेदन करना|apply)\b/i,
    ],
    services: {
      income: [/\b(income|aay|aaya|आय|इनकम|salary|kamai|कमाई|vetan|वेतन)\b/i],
      caste: [/\b(caste|jati|jaati|जाति|जात|sc|st|obc|अनुसूचित|पिछड़ा)\b/i],
      domicile: [/\b(domicile|niwas|nivas|निवास|residence|rehne|रहने|mool niwas|मूल निवास|sthaniya|स्थानीय)\b/i],
      character: [/\b(character|charitra|चरित्र|charittra|acharan|आचरण)\b/i],
      birth: [/\b(birth|janam|janm|जन्म|paidaish|पैदाइश)\b/i],
      death: [/\b(death|mrityu|मृत्यु|maut|मौत)\b/i],
      marriage: [/\b(marriage|vivah|विवाह|shaadi|shadi|शादी)\b/i],
      police_verify: [/\b(police|verification|pulice|पुलिस|सत्यापन|satyapan|verify|clearance)\b/i],
      land_record: [/\b(land|bhulekh|khatauni|bhumi|भूलेख|खतौनी|भूमि|jameen|ज़मीन|zameen)\b/i],
      mutation: [/\b(mutation|dakhil kharij|dakhil|kharij|दाखिल|खारिज|intqal|intkal)\b/i],
      rent_agreement: [/\b(rent|kiraya|किराया|agreement|anubandh|अनुबंध|lease)\b/i],
      passport_noc: [/\b(passport|noc|पासपोर्ट|अनापत्ति)\b/i],
      solvency: [/\b(solvency|shodhan|शोधन|solvent)\b/i],
      obc_ncl: [/\b(obc|non.?creamy|noncreamy|ncl|नॉन क्रीमी|ओबीसी)\b/i],
      property_tax: [/\b(property.?tax|sampatti|संपत्ति|कर|ghar.?tax|house.?tax)\b/i],
      trade_license: [/\b(trade|license|vyapar|व्यापार|लाइसेंस|dukan|दुकान|shop)\b/i],
      fir_status: [/\b(fir|एफआईआर|complaint|shikayat|शिकायत)\b/i],
    }
  },
  track: {
    patterns: [
      /\b(track|status|check|kahan|kidhar|pata|where|update|progress|kya hua|kab milega|kitna time)\b/i,
      /\b(मेरा|मेरी|स्थिति|ट्रैक|जांच|कहां|कब|पता|अपडेट)\b/i,
      /\bGBN-\d{4}-\d{4}\b/i,
      /\b(mera application|meri application|application ka status|aavedan ki sthiti)\b/i,
    ],
  },
  feedback: {
    patterns: [
      /\b(feedback|review|complaint|suggest|rating|shikayat|samiksha|sujhav|tareef)\b/i,
      /\b(प्रतिक्रिया|शिकायत|समीक्षा|सुझाव|तारीफ|राय)\b/i,
    ],
  },
  digilocker: {
    patterns: [
      /\b(digilocker|digi|digital|locker|download|certificate.?download|praman.?download)\b/i,
      /\b(डिजिलॉकर|डिजी|डिजिटल|लॉकर|डाउनलोड)\b/i,
    ],
  },
  sms: {
    patterns: [
      /\b(sms|message|phone|without.?internet|bina.?internet|feature.?phone|basic.?phone)\b/i,
      /\b(एसएमएस|संदेश|बिना इंटरनेट|साधारण फोन)\b/i,
    ],
  },
  greeting: {
    patterns: [
      /^(hi|hello|hey|namaste|namaskar|namasté|pranam|jai hind|ram ram|radhe radhe)\b/i,
      /^(नमस्ते|नमस्कार|प्रणाम|जय हिंद|राम राम|राधे राधे|हेलो|हाय)\b/i,
    ],
  },
  thanks: {
    patterns: [
      /\b(thank|thanks|dhanyavad|shukriya|bahut accha)\b/i,
      /\b(धन्यवाद|शुक्रिया|बहुत अच्छा|आभार)\b/i,
    ],
  },
  help: {
    patterns: [
      /\b(help|madad|sahayata|kya kar sakte|kya hota|how|kaise|batao|samjhao)\b/i,
      /\b(मदद|सहायता|कैसे|बताओ|समझाओ|क्या कर सकते)\b/i,
    ],
  },
  fees: {
    patterns: [
      /\b(fee|fees|charge|cost|kitna|paisa|rupees|amount|payment|bhugtan|shulk)\b/i,
      /\b(शुल्क|फीस|कितना|पैसा|रुपये|भुगतान|खर्च)\b/i,
    ],
  },
  time: {
    patterns: [
      /\b(how long|kitna time|kitne din|kab tak|duration|days|samay|time lagna)\b/i,
      /\b(कितना समय|कितने दिन|कब तक|समय)\b/i,
    ],
  },
};

function detectIntent(msg) {
  const clean = msg.trim();
  // Check for reference number anywhere in message
  const refMatch = clean.match(/GBN-\d{4}-\d{4}/i);
  if (refMatch) return { intent: "track", refNum: refMatch[0].toUpperCase() };
  // Check numbered responses
  if (/^[1-7]$/.test(clean)) return { intent: "number", num: clean };
  // NLP intent matching
  for (const [intent, cfg] of Object.entries(NLP_INTENTS)) {
    for (const pat of cfg.patterns) {
      if (pat.test(clean)) {
        // For apply intent, also detect which service
        if (intent === "apply" && cfg.services) {
          for (const [svcKey, svcPats] of Object.entries(cfg.services)) {
            for (const sp of svcPats) {
              if (sp.test(clean)) return { intent: "apply", service: svcKey };
            }
          }
          return { intent: "apply", service: null };
        }
        return { intent };
      }
    }
  }
  return { intent: "unknown" };
}

// ─── Simulated Backend API Layer ───
const API = {
  // Simulates e-District/e-Sathi API call
  submitApplication: (data, allApps) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const id = `GBN-2026-${String(allApps.length + 1).padStart(4, "0")}`;
        const esRef = (data.dept === "esathi" || data.dept === "dm") ? `ES-2026-${String(Math.floor(Math.random() * 90000) + 10000)}` : "";
        resolve({ success: true, refId: id, esathiRef: esRef, timestamp: new Date().toISOString() });
      }, 300);
    });
  },
  // Simulates status lookup from e-District DB
  fetchStatus: (refId, allApps) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const app = allApps.find(a => a.id.toLowerCase() === refId.toLowerCase());
        resolve(app ? { found: true, data: app } : { found: false });
      }, 200);
    });
  },
  // Simulates e-KYC UIDAI verification
  verifyAadhaar: (aadhaar) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ verified: true, maskedNumber: `XXXX-XXXX-${aadhaar.slice(-4)}` }), 400);
    });
  },
  // Simulates fee info from e-Sathi
  getFeeInfo: (serviceKey) => {
    const svc = ALL_SERVICES.find(s => s.key === serviceKey);
    return svc ? { fee: svc.fee, upiId: "gbnagar-dm@gov.upi", days: svc.days } : null;
  }
};

// ─── WhatsApp Chatbot (NLP + Voice + Backend API) ───
function WhatsAppChatbot({ lang, applications, setApplications }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botState, setBotState] = useState("welcome");
  const [chatForm, setChatForm] = useState({});
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef(null);

  const welcome = lang === "en"
    ? "🙏 Namaste! Welcome to GB Nagar e-Seva.\n\n🤖 I understand natural language — just tell me what you need!\n\nFor example:\n• \"I need an income certificate\"\n• \"mujhe jaati praman patra chahiye\"\n• \"Track GBN-2026-0003\"\n• \"What are the fees?\"\n\nOr pick a number:\n1️⃣ Apply  2️⃣ Track  3️⃣ Feedback\n4️⃣ DigiLocker  5️⃣ SMS Help"
    : "🙏 नमस्ते! GB नगर ई-सेवा में स्वागत है।\n\n🤖 मैं आपकी भाषा समझता हूं — बस बताइए क्या चाहिए!\n\nउदाहरण:\n• \"मुझे आय प्रमाण पत्र चाहिए\"\n• \"mera application ka status batao\"\n• \"Track GBN-2026-0003\"\n• \"फीस कितनी है?\"\n\nया नंबर चुनें:\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ प्रतिक्रिया\n4️⃣ डिजिलॉकर  5️⃣ SMS सहायता";

  useEffect(() => { if (open && messages.length === 0) setMessages([{ from: "bot", text: welcome }]); }, [open]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addBot = (text, meta) => setMessages(prev => [...prev, { from: "bot", text, meta }]);
  const addUser = (text, voice = false) => setMessages(prev => [...prev, { from: "user", text, voice }]);

  const selectSvc = lang === "en"
    ? "Which certificate? You can type the name or a number:\n\n1️⃣ Income  2️⃣ Caste  3️⃣ Domicile\n4️⃣ Character  5️⃣ Birth  6️⃣ Police Verification\n7️⃣ Land Record\n\nOr just say, e.g., \"income certificate\" or \"jaati praman patra\""
    : "कौन सा प्रमाण पत्र? नाम या नंबर टाइप करें:\n\n1️⃣ आय  2️⃣ जाति  3️⃣ निवास\n4️⃣ चरित्र  5️⃣ जन्म  6️⃣ पुलिस सत्यापन\n7️⃣ भूलेख\n\nया बस बोलें, जैसे \"आय प्रमाण पत्र\" या \"income certificate\"";

  const svcMap = { "1": "income", "2": "caste", "3": "domicile", "4": "character", "5": "birth", "6": "police_verify", "7": "land_record" };

  const getSvcName = (key) => { const s = ALL_SERVICES.find(sv => sv.key === key); return s ? s[lang] : key; };

  const processWithNLP = async (msg, isVoice) => {
    setThinking(true);
    const detected = detectIntent(msg);
    const lmsg = msg.toLowerCase();

    // Navigation shortcuts
    if (lmsg === "menu" || lmsg === "home" || lmsg === "वापस" || lmsg === "wapas") {
      setBotState("welcome"); setTimeout(() => { setThinking(false); addBot(welcome); }, 600); return;
    }

    // ─── State-aware processing ───
    if (botState === "askName" || botState === "askFather" || botState === "askMobile" || botState === "askAadhaar") {
      // In form-filling states, accept free text as data
      setThinking(false);
      switch (botState) {
        case "askName": setChatForm(p => ({ ...p, name: msg })); setBotState("askFather"); setTimeout(() => addBot(L(lang, "👤 Father's / Husband's name:", "👤 पिता / पति का नाम:")), 400); break;
        case "askFather": setChatForm(p => ({ ...p, fatherName: msg })); setBotState("askMobile"); setTimeout(() => addBot(L(lang, "📱 Mobile number:", "📱 मोबाइल नंबर:")), 400); break;
        case "askMobile": setChatForm(p => ({ ...p, mobile: msg })); setBotState("askAadhaar"); setTimeout(() => addBot(L(lang, "🔐 Aadhaar number (for e-KYC verification):", "🔐 आधार संख्या (ई-केवाईसी सत्यापन हेतु):")), 400); break;
        case "askAadhaar": {
          // Use backend API to submit
          const svc = ALL_SERVICES.find(s => s.key === chatForm.service);
          const apiResult = await API.submitApplication({ ...chatForm, aadhaar: msg, dept: svc?.dept }, applications);
          const now = new Date().toISOString().split("T")[0];
          const tl = [
            { date: now, status: "submitted", note: "Application via WhatsApp (NLP)", noteHi: "WhatsApp (NLP) द्वारा आवेदन" },
            { date: now, status: "ekyc", note: "Aadhaar e-KYC verified via UIDAI", noteHi: "UIDAI द्वारा आधार ई-केवाईसी सत्यापित" },
          ];
          if (svc?.fee > 0) tl.push({ date: now, status: "paid", note: `Fee ₹${svc.fee} — UPI payment link sent`, noteHi: `शुल्क ₹${svc.fee} — UPI भुगतान लिंक भेजा` });
          setApplications(prev => [...prev, {
            id: apiResult.refId, name: chatForm.name, nameHi: chatForm.name, fatherName: chatForm.fatherName, fatherNameHi: chatForm.fatherName,
            service: chatForm.service, dept: svc?.dept || "dm", mobile: chatForm.mobile, aadhaar: msg,
            address: "Via WhatsApp", addressHi: "WhatsApp द्वारा", tehsil: "-", tehsilHi: "-", village: "-", villageHi: "-",
            purpose: "Via WhatsApp", purposeHi: "WhatsApp द्वारा", status: "pending", dateApplied: now, lastUpdated: now,
            remarks: "", remarksHi: "", paid: svc?.fee > 0, ekyc: true, digilocker: false, esathiRef: apiResult.esathiRef, timeline: tl
          }]);
          setBotState("postAction");
          const payNote = svc?.fee > 0 ? L(lang, `\n💰 Fee ₹${svc.fee} — UPI payment link sent to ${chatForm.mobile}`, `\n💰 शुल्क ₹${svc.fee} — UPI लिंक ${chatForm.mobile} पर भेजा`) : "";
          addBot(L(lang,
            `✅ Application submitted successfully!\n\n📋 Ref: ${apiResult.refId}\n🔗 e-Sathi: ${apiResult.esathiRef}${payNote}\n📲 SMS updates → ${chatForm.mobile}\n📱 Certificate → DigiLocker\n\nWhat next?\n1️⃣ Apply again  2️⃣ Track  3️⃣ Exit`,
            `✅ आवेदन सफलतापूर्वक जमा!\n\n📋 संदर्भ: ${apiResult.refId}\n🔗 ई-साथी: ${apiResult.esathiRef}${payNote}\n📲 SMS अपडेट → ${chatForm.mobile}\n📱 प्रमाण पत्र → डिजिलॉकर\n\nआगे?\n1️⃣ और आवेदन  2️⃣ ट्रैक  3️⃣ बाहर`
          ), { intent: "applicationComplete", ref: apiResult.refId });
          break;
        }
      }
      return;
    }

    // ─── NLP-driven routing ───

    // Direct service apply with NLP (e.g. "mujhe income certificate chahiye")
    if (detected.intent === "apply" && detected.service) {
      const svc = ALL_SERVICES.find(s => s.key === detected.service);
      const feeInfo = API.getFeeInfo(detected.service);
      setChatForm({ service: detected.service });
      setBotState("askName");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        `🤖 I understood — you want to apply for **${svc?.en}**.\n${feeInfo?.fee > 0 ? `💰 Fee: ₹${feeInfo.fee} (UPI)\n` : "🆓 No fee required\n"}⏱️ Processing: ${feeInfo?.days || "—"} days\n\nLet's start! Please enter your full name (as per Aadhaar):`,
        `🤖 समझ गया — आप **${svc?.hi}** के लिए आवेदन करना चाहते हैं।\n${feeInfo?.fee > 0 ? `💰 शुल्क: ₹${feeInfo.fee} (UPI)\n` : "🆓 निःशुल्क\n"}⏱️ प्रसंस्करण: ${feeInfo?.days || "—"} दिन\n\nशुरू करते हैं! कृपया पूरा नाम दर्ज करें (आधार अनुसार):`
      ), { intent: "applyDirect", service: detected.service }); }, 600);
      return;
    }

    // Apply without specific service
    if (detected.intent === "apply") {
      setBotState("selectService");
      setTimeout(() => { setThinking(false); addBot(selectSvc); }, 500);
      return;
    }

    // Track — with ref number detected
    if (detected.intent === "track" && detected.refNum) {
      const apiResult = await API.fetchStatus(detected.refNum, applications);
      setThinking(false);
      if (apiResult.found) {
        const f = apiResult.data;
        const svc = ALL_SERVICES.find(s => s.key === f.service);
        const st = { pending: L(lang, "⏳ Pending", "⏳ लंबित"), processing: L(lang, "🔄 Processing", "🔄 प्रसंस्करण"), approved: L(lang, "✅ Approved", "✅ स्वीकृत"), rejected: L(lang, "❌ Rejected", "❌ अस्वीकृत"), ready: L(lang, "📦 Ready", "📦 तैयार") };
        setBotState("postAction");
        addBot(L(lang,
          `📋 **Application Found!**\n\nRef: ${f.id}\nService: ${svc?.en}\nApplicant: ${f.name}\nStatus: ${st[f.status] || f.status}\nApplied: ${f.dateApplied}\nUpdated: ${f.lastUpdated}${f.esathiRef ? `\ne-Sathi: ${f.esathiRef}` : ""}${f.digilocker ? "\n📱 Available on DigiLocker" : ""}${f.remarks ? `\n📝 ${f.remarks}` : ""}\n\nWhat next?\n1️⃣ Apply  2️⃣ Track another  3️⃣ Exit`,
          `📋 **आवेदन मिला!**\n\nसंदर्भ: ${f.id}\nसेवा: ${svc?.hi}\nआवेदक: ${f.nameHi || f.name}\nस्थिति: ${st[f.status] || f.status}\nआवेदन: ${f.dateApplied}\nअपडेट: ${f.lastUpdated}${f.esathiRef ? `\nई-साथी: ${f.esathiRef}` : ""}${f.digilocker ? "\n📱 डिजिलॉकर पर उपलब्ध" : ""}${f.remarksHi ? `\n📝 ${f.remarksHi}` : ""}\n\nआगे?\n1️⃣ आवेदन  2️⃣ और ट्रैक  3️⃣ बाहर`
        ), { intent: "trackResult", ref: f.id });
      } else {
        addBot(L(lang,
          `❌ No application found for **${detected.refNum}**.\n\nPlease check the number and try again, or type a different reference number.`,
          `❌ **${detected.refNum}** से कोई आवेदन नहीं मिला।\n\nकृपया संख्या जांचें और पुनः प्रयास करें।`
        ));
      }
      return;
    }

    // Track — without ref number
    if (detected.intent === "track") {
      setBotState("trackRef");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "📋 Sure, I'll look up your application.\n\nPlease enter your reference number (e.g., GBN-2026-0001):",
        "📋 ज़रूर, मैं आपका आवेदन खोजता हूं।\n\nकृपया संदर्भ संख्या दर्ज करें (जैसे GBN-2026-0001):"
      )); }, 500);
      return;
    }

    // Feedback
    if (detected.intent === "feedback") {
      setBotState("feedback");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "📝 I'd love to hear your feedback!\n\nPlease share your experience, suggestion, or complaint:",
        "📝 आपकी प्रतिक्रिया सुनना चाहूंगा!\n\nकृपया अपना अनुभव, सुझाव या शिकायत साझा करें:"
      )); }, 500);
      return;
    }

    // DigiLocker info
    if (detected.intent === "digilocker") {
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "📱 **DigiLocker Integration**\n\nYour approved certificates are automatically delivered to DigiLocker — verified, tamper-proof, and legally valid.\n\n🔗 Link your account: digilocker.gov.in\n🔐 Use your Aadhaar to authenticate\n📄 Download anytime, show anywhere\n\nWhat else can I help with?\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit",
        "📱 **डिजिलॉकर इंटीग्रेशन**\n\nस्वीकृत प्रमाण पत्र स्वतः डिजिलॉकर पर मिलते हैं — सत्यापित, सुरक्षित और कानूनी रूप से मान्य।\n\n🔗 जोड़ें: digilocker.gov.in\n🔐 आधार से प्रमाणित करें\n📄 कभी भी डाउनलोड करें\n\nऔर क्या मदद?\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर"
      )); }, 500);
      return;
    }

    // SMS help
    if (detected.intent === "sms") {
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "📲 **SMS Services — No Internet Needed!**\n\nSend to 1800-XXX-XXXX:\n• APPLY INCOME → Apply for Income Certificate\n• APPLY CASTE → Apply for Caste Certificate\n• STATUS GBN-2026-0001 → Check status\n• HELP → Get help\n\n✅ Works on any basic phone\n✅ Critical for Jewar, Dankaur, Bisrakh areas\n\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit",
        "📲 **SMS सेवाएं — इंटरनेट नहीं चाहिए!**\n\n1800-XXX-XXXX पर भेजें:\n• APPLY INCOME → आय प्रमाण पत्र\n• APPLY CASTE → जाति प्रमाण पत्र\n• STATUS GBN-2026-0001 → स्थिति जांचें\n• HELP → सहायता\n\n✅ किसी भी साधारण फोन से\n✅ जेवर, दनकौर, बिसरख के लिए\n\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर"
      )); }, 500);
      return;
    }

    // Greeting
    if (detected.intent === "greeting") {
      setTimeout(() => { setThinking(false); addBot(welcome); }, 400);
      return;
    }

    // Thanks
    if (detected.intent === "thanks") {
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "🙏 You're welcome! Happy to help.\n\nAnything else?\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit",
        "🙏 आपका स्वागत है! मदद करके खुशी हुई।\n\nकुछ और?\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर"
      )); }, 400);
      return;
    }

    // Fees inquiry
    if (detected.intent === "fees") {
      const feeList = ALL_SERVICES.filter(s => s.fee > 0).map(s => `• ${s[lang]}: ₹${s.fee}`).join("\n");
      const freeList = ALL_SERVICES.filter(s => s.fee === 0).map(s => `• ${s[lang]}`).join("\n");
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        `💰 **Fee Schedule:**\n\n**Paid Services (UPI):**\n${feeList}\n\n**Free Services:**\n${freeList}\n\n💳 Pay via UPI QR or UPI ID: gbnagar-dm@gov.upi\n\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit`,
        `💰 **शुल्क सूची:**\n\n**सशुल्क सेवाएं (UPI):**\n${feeList}\n\n**निःशुल्क सेवाएं:**\n${freeList}\n\n💳 UPI QR या UPI ID से भुगतान: gbnagar-dm@gov.upi\n\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर`
      )); }, 600);
      return;
    }

    // Processing time inquiry
    if (detected.intent === "time") {
      const timeList = ALL_SERVICES.map(s => `• ${s[lang]}: ${s.days} ${L(lang, "days", "दिन")}`).join("\n");
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        `⏱️ **Processing Times:**\n\n${timeList}\n\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit`,
        `⏱️ **प्रसंस्करण समय:**\n\n${timeList}\n\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर`
      )); }, 600);
      return;
    }

    // Help
    if (detected.intent === "help") {
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "🤖 **I'm your GB Nagar e-Seva assistant!**\n\nI understand Hindi, English, and Hinglish. Just tell me what you need:\n\n📝 \"I need a caste certificate\" → starts application\n📋 \"Track GBN-2026-0003\" → shows status\n💰 \"What are the fees?\" → shows fee list\n⏱️ \"How long does it take?\" → processing times\n📱 \"Tell me about DigiLocker\" → certificate delivery\n📲 \"SMS help\" → for non-smartphone users\n\nOr type 'menu' anytime to see all options.",
        "🤖 **मैं आपका GB नगर ई-सेवा सहायक हूं!**\n\nमैं हिंदी, अंग्रेजी और हिंग्लिश समझता हूं। बस बताइए क्या चाहिए:\n\n📝 \"मुझे जाति प्रमाण पत्र चाहिए\" → आवेदन शुरू\n📋 \"GBN-2026-0003 ट्रैक करो\" → स्थिति दिखाता है\n💰 \"फीस कितनी है?\" → शुल्क सूची\n⏱️ \"कितना समय लगता है?\" → प्रसंस्करण समय\n📱 \"डिजिलॉकर बताओ\" → प्रमाण पत्र वितरण\n📲 \"SMS मदद\" → बिना स्मार्टफोन के लिए\n\nकभी भी 'menu' टाइप करें।"
      )); }, 500);
      return;
    }

    // ─── Number-based fallback (for postAction, selectService, trackRef, feedback states) ───
    if (detected.intent === "number") {
      const n = detected.num;
      switch (botState) {
        case "welcome":
          if (n === "1") { setBotState("selectService"); setTimeout(() => { setThinking(false); addBot(selectSvc); }, 400); return; }
          if (n === "2") { setBotState("trackRef"); setTimeout(() => { setThinking(false); addBot(L(lang, "Enter reference number:", "संदर्भ संख्या दर्ज करें:")); }, 400); return; }
          if (n === "3") { setBotState("feedback"); setTimeout(() => { setThinking(false); addBot(L(lang, "Share your feedback:", "प्रतिक्रिया साझा करें:")); }, 400); return; }
          if (n === "4") { detected.intent = "digilocker"; processWithNLP("digilocker", false); return; }
          if (n === "5") { detected.intent = "sms"; processWithNLP("sms", false); return; }
          break;
        case "selectService":
          if (svcMap[n]) {
            const svc = ALL_SERVICES.find(s => s.key === svcMap[n]);
            setChatForm({ service: svcMap[n] }); setBotState("askName");
            setTimeout(() => { setThinking(false); addBot(L(lang,
              `✅ ${svc?.en} selected.\n\nPlease enter your full name (as per Aadhaar):`,
              `✅ ${svc?.hi} चुना गया।\n\nकृपया पूरा नाम दर्ज करें (आधार अनुसार):`
            )); }, 400);
            return;
          }
          break;
        case "postAction":
          if (n === "1") { setBotState("selectService"); setTimeout(() => { setThinking(false); addBot(selectSvc); }, 400); return; }
          if (n === "2") { setBotState("trackRef"); setTimeout(() => { setThinking(false); addBot(L(lang, "Enter reference number:", "संदर्भ संख्या दर्ज करें:")); }, 400); return; }
          if (n === "3") { setBotState("done"); setTimeout(() => { setThinking(false); addBot(L(lang, "🙏 Thank you for using GB Nagar e-Seva! Have a great day.", "🙏 GB नगर ई-सेवा का उपयोग करने के लिए धन्यवाद! शुभ दिन!")); }, 400); return; }
          break;
      }
    }

    // trackRef state — treat any input as a ref number attempt
    if (botState === "trackRef") {
      const apiResult = await API.fetchStatus(msg, applications);
      setThinking(false);
      if (apiResult.found) {
        const f = apiResult.data;
        const svc = ALL_SERVICES.find(s => s.key === f.service);
        const st = { pending: L(lang, "⏳ Pending", "⏳ लंबित"), processing: L(lang, "🔄 Processing", "🔄 प्रसंस्करण"), approved: L(lang, "✅ Approved", "✅ स्वीकृत"), rejected: L(lang, "❌ Rejected", "❌ अस्वीकृत"), ready: L(lang, "📦 Ready", "📦 तैयार") };
        setBotState("postAction");
        addBot(L(lang,
          `📋 **Found!**\n\nRef: ${f.id} | ${svc?.en}\nApplicant: ${f.name}\nStatus: ${st[f.status]}\n${f.esathiRef ? `e-Sathi: ${f.esathiRef}\n` : ""}${f.digilocker ? "📱 On DigiLocker\n" : ""}\n1️⃣ Apply  2️⃣ Track another  3️⃣ Exit`,
          `📋 **मिला!**\n\nसंदर्भ: ${f.id} | ${svc?.hi}\nआवेदक: ${f.nameHi || f.name}\nस्थिति: ${st[f.status]}\n${f.esathiRef ? `ई-साथी: ${f.esathiRef}\n` : ""}${f.digilocker ? "📱 डिजिलॉकर पर\n" : ""}\n1️⃣ आवेदन  2️⃣ और ट्रैक  3️⃣ बाहर`
        ));
      } else {
        addBot(L(lang, `❌ "${msg}" not found. Try again or type 'menu'.`, `❌ "${msg}" नहीं मिला। पुनः प्रयास करें या 'menu' टाइप करें।`));
      }
      return;
    }

    // feedback state
    if (botState === "feedback") {
      setBotState("postAction");
      setTimeout(() => { setThinking(false); addBot(L(lang,
        "🙏 Thank you for your valuable feedback! It has been recorded and forwarded to the concerned department.\n\n1️⃣ Apply  2️⃣ Track  3️⃣ Exit",
        "🙏 आपकी बहुमूल्य प्रतिक्रिया के लिए धन्यवाद! इसे संबंधित विभाग को भेज दिया गया है।\n\n1️⃣ आवेदन  2️⃣ ट्रैक  3️⃣ बाहर"
      )); }, 500);
      return;
    }

    // done state
    if (botState === "done") { setBotState("welcome"); setTimeout(() => { setThinking(false); addBot(welcome); }, 400); return; }

    // Catch-all with helpful suggestions
    setThinking(false);
    addBot(L(lang,
      `🤔 I'm not sure what you mean by "${msg}".\n\nTry saying things like:\n• "Apply for income certificate"\n• "mujhe nivas praman patra chahiye"\n• "Track GBN-2026-0001"\n• "fees kitni hai"\n\nOr type 'help' for more options.`,
      `🤔 "${msg}" से मैं समझ नहीं पाया।\n\nऐसे बोलें:\n• "आय प्रमाण पत्र के लिए आवेदन"\n• "mujhe income certificate chahiye"\n• "GBN-2026-0001 ट्रैक करो"\n• "fees kitni hai"\n\nया 'help' टाइप करें।`
    ));
  };

  const handleSend = (voiceText) => {
    const msg = (voiceText || input).trim();
    if (!msg) return;
    addUser(msg, !!voiceText);
    setInput("");
    processWithNLP(msg, !!voiceText);
  };

  const handleVoice = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      const voiceTexts = lang === "en"
        ? ["I want to apply for income certificate", "mujhe jaati praman patra chahiye", "Track GBN-2026-0003", "What are the fees?", "How long does domicile certificate take?"]
        : ["मुझे आय प्रमाण पत्र चाहिए", "police verification karwana hai", "GBN-2026-0005 ka status batao", "फीस कितनी है?", "कितने दिन लगते हैं?"];
      handleSend(voiceTexts[Math.floor(Math.random() * voiceTexts.length)]);
    }, 1500);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition-transform hover:scale-110" style={{ background: "#25D366" }}>
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col" style={{ height: "min(580px, calc(100vh - 8rem))" }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#075E54" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} className="text-white" /></div>
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm">{L(lang, "GB Nagar e-Seva", "GB नगर ई-सेवा")}</h4>
              <p className="text-green-200 text-xs">{L(lang, "AI-Powered • Hindi • English • Hinglish", "AI संचालित • हिंदी • अंग्रेजी • हिंग्लिश")}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: "#ECE5DD" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-line ${m.from === "user" ? "bg-green-200 text-gray-900 rounded-br-sm" : "bg-white text-gray-900 rounded-bl-sm shadow-sm"}`}>
                  {m.voice && <span className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Mic size={10} /> {L(lang, "Voice message", "वॉइस संदेश")}</span>}
                  {m.meta?.intent && <span className="text-xs text-blue-500 flex items-center gap-1 mb-1">🤖 {L(lang, "AI understood", "AI ने समझा")}: {m.meta.intent}</span>}
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-xl rounded-bl-sm shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 bg-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder={L(lang, "Type a message...", "संदेश लिखें...")} className="flex-1 rounded-full px-4 py-2 text-sm border border-gray-300 focus:border-green-500 outline-none" />
            <button onClick={handleVoice} className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${recording ? "bg-red-500 animate-pulse" : "bg-gray-500 hover:bg-gray-600"}`}>
              {recording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button onClick={() => handleSend()} className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "#075E54" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main App ───
export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [applications, setApplications] = useState(initialApplications);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Header lang={lang} setLang={setLang} page={page} setPage={setPage} />
      <main>
        {page === "home" && <HomePage lang={lang} setPage={setPage} />}
        {page === "apply" && <ApplyPage lang={lang} applications={applications} setApplications={setApplications} setPage={setPage} />}
        {page === "track" && <TrackPage lang={lang} applications={applications} />}
        {page === "digilocker" && <DigiLockerPage lang={lang} applications={applications} />}
        {page === "feedback" && <FeedbackPage lang={lang} />}
        {page === "admin" && <AdminDashboard lang={lang} applications={applications} setApplications={setApplications} />}
      </main>
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 mt-8">
        <p>&copy; 2026 {L(lang, "District Magistrate Office, Gautam Budh Nagar", "जिला मजिस्ट्रेट कार्यालय, गौतम बुद्ध नगर")}</p>
        <p className="mt-1">{L(lang, "Prototype — Not an official government portal | Inspired by Mana Mitra, AP", "प्रोटोटाइप — आधिकारिक पोर्टल नहीं | मना मित्र, आं.प्र. से प्रेरित")}</p>
      </footer>
      <WhatsAppChatbot lang={lang} applications={applications} setApplications={setApplications} />
    </div>
  );
}
