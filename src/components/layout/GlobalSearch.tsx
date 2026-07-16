import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Users, Command } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { billService } from "@/features/bills/services/bill.service";
import { groupService } from "@/features/groups/services/group.service";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: "bill" | "group";
  title: string;
  subtitle: string;
  path: string;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all searchable data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [bills, groups] = await Promise.all([
            billService.getBills(),
            groupService.getGroups(),
          ]);

          const searchableData: SearchResult[] = [
            ...(bills as any[]).map((b) => ({
              id: b.id,
              type: "bill" as const,
              title: b.title,
              subtitle: `₹${b.amount} • ${b.category || "General"}`,
              path: `/bills/${b.id}`,
            })),
            ...(groups as any[]).map((g) => ({
              id: g.id,
              type: "group" as const,
              title: g.name,
              subtitle: `${g.group_members?.length || 0} members`,
              path: `/groups/${g.id}`,
            })),
          ];

          setAllData(searchableData);
          setResults(searchableData);
        } catch (error) {
          console.error("Search data fetch error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
      setQuery("");
      
      // Auto focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter data on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults(allData);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query, allData]);

  // Handle keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[10%] z-[101] w-full max-w-xl -translate-x-1/2 px-4 sm:px-0"
          >
            <div className="overflow-hidden rounded-xl border bg-card shadow-2xl">
              {/* Header / Input */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bills, groups, categories..."
                  className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="mr-2 p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                )}
                <div className="hidden items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
                  <Command size={10} /> Esc
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                ) : results.length === 0 ? (
                  <div className="p-12 text-center">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-medium text-foreground">No results found.</p>
                    <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {/* Groups */}
                    {results.some(r => r.type === 'group') && (
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Groups
                      </div>
                    )}
                    {results.filter(r => r.type === 'group').map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result.path)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Users size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{result.title}</span>
                          <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                        </div>
                      </button>
                    ))}

                    {/* Bills */}
                    {results.some(r => r.type === 'bill') && (
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                        Bills
                      </div>
                    )}
                    {results.filter(r => r.type === 'bill').map(result => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result.path)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <FileText size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{result.title}</span>
                          <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="border-t bg-muted/50 p-2 text-center text-xs text-muted-foreground">
                Search powered by AI
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
