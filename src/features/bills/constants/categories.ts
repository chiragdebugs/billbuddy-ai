import { 
  Utensils, 
  CarFront, 
  Home, 
  ShoppingBag, 
  Film, 
  Plane, 
  Zap, 
  Receipt,
  HeartPulse,
  BookOpen,
  Hotel,
  Palmtree,
  Baby,
  Dog,
  Wrench
} from "lucide-react";

export const BILL_CATEGORIES = [
  { id: "General", label: "General", icon: Receipt, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  { id: "Food", label: "Food & Dining", icon: Utensils, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "Transport", label: "Transportation", icon: CarFront, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "Housing", label: "Housing & Rent", icon: Home, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { id: "Utilities", label: "Utilities", icon: Zap, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { id: "Shopping", label: "Shopping", icon: ShoppingBag, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { id: "Entertainment", label: "Entertainment", icon: Film, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "Travel", label: "Travel", icon: Plane, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
  { id: "Health", label: "Health & Medical", icon: HeartPulse, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  { id: "Education", label: "Education", icon: BookOpen, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  // Mode specific
  { id: "Flights", label: "Flights", icon: Plane, color: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
  { id: "Hotels", label: "Hotels", icon: Hotel, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { id: "Excursions", label: "Excursions", icon: Palmtree, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "Childcare", label: "Childcare", icon: Baby, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  { id: "Pets", label: "Pet Care", icon: Dog, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "Maintenance", label: "Home Maintenance", icon: Wrench, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
];

export const getCategoryDetails = (categoryId?: string) => {
  if (!categoryId) return BILL_CATEGORIES[0];
  return BILL_CATEGORIES.find(c => c.id === categoryId) || BILL_CATEGORIES[0];
};

export const getModeCategories = (mode: string) => {
  if (mode === "Travel") {
    return BILL_CATEGORIES.filter(c => ["Flights", "Hotels", "Excursions", "Food", "Transport"].includes(c.id));
  }
  if (mode === "Family") {
    return BILL_CATEGORIES.filter(c => ["Housing", "Utilities", "Childcare", "Pets", "Maintenance", "Food"].includes(c.id));
  }
  return BILL_CATEGORIES.filter(c => !["Flights", "Hotels", "Excursions", "Childcare", "Pets", "Maintenance"].includes(c.id));
};
