import { useState, useEffect } from "react";
import { Mic, X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ParsedBill, voiceParserService } from "../services/voiceParser.service";
import { Button } from "@/components/ui/button";

interface AIVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: ParsedBill) => void;
}

export default function AIVoiceModal({ isOpen, onClose, onParsed }: AIVoiceModalProps) {
  const [phase, setPhase] = useState<"idle" | "listening" | "processing" | "success">("idle");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPhase("idle");
      setTranscript("");
    }
  }, [isOpen]);

  const handleStartListening = () => {
    setPhase("listening");
    // Simulate Speech Recognition
    setTimeout(() => {
      setTranscript("I spent 1200 on pizza with Rahul and Amit");
    }, 1500);

    setTimeout(() => {
      handleProcess("I spent 1200 on pizza with Rahul and Amit");
    }, 3000);
  };

  const handleProcess = async (text: string) => {
    setPhase("processing");
    try {
      const parsedData = await voiceParserService.parseVoiceInput(text);
      setPhase("success");
      setTimeout(() => {
        onParsed(parsedData);
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      setPhase("idle");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
              
              <div className="relative">
                {phase === "listening" && (
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                  />
                )}
                
                <button 
                  onClick={phase === "idle" ? handleStartListening : undefined}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
                    phase === "idle" 
                      ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105" 
                      : phase === "listening"
                      ? "bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary),0.6)]"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {phase === "processing" ? (
                    <Loader2 size={40} className="animate-spin" />
                  ) : phase === "success" ? (
                    <Sparkles size={40} />
                  ) : (
                    <Mic size={40} />
                  )}
                </button>
              </div>

              <div className="space-y-2 h-16">
                {phase === "idle" && (
                  <>
                    <h3 className="text-xl font-bold">Tap to speak</h3>
                    <p className="text-sm text-muted-foreground">"I spent ₹800 on dinner with Amit"</p>
                  </>
                )}
                {phase === "listening" && (
                  <>
                    <h3 className="text-xl font-bold text-primary animate-pulse">Listening...</h3>
                    <p className="text-sm text-foreground font-medium italic">{transcript || "Speak now..."}</p>
                  </>
                )}
                {phase === "processing" && (
                  <>
                    <h3 className="text-xl font-bold">Extracting magic...</h3>
                    <p className="text-sm text-muted-foreground">Parsing amounts and friends</p>
                  </>
                )}
                {phase === "success" && (
                  <>
                    <h3 className="text-xl font-bold text-green-500">Got it!</h3>
                    <p className="text-sm text-muted-foreground">Auto-filling form...</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
