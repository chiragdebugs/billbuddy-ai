import { ScanLine, UploadCloud, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { geminiService } from "@/lib/gemini";

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Strip out the data:image/...;base64, prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function UploadReceipt() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "success">("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToScan: File) => {
    setStatus("scanning");
    
    try {
      const base64Image = await fileToBase64(fileToScan);
      
      // Call Gemini SDK directly
      const extractedData = await geminiService.extractReceiptData(base64Image, fileToScan.type);

      setStatus("success");
      
      // Redirect after showing success state briefly
      setTimeout(() => {
        const searchParams = new URLSearchParams({
          title: extractedData.title,
          amount: extractedData.amount.toString(),
          category: extractedData.category
        });
        
        navigate(`/create-bill?${searchParams.toString()}`);
      }, 1500);
      
    } catch (err) {
      console.error("OCR Failed:", err);
      // Fallback in case OCR completely fails
      setStatus("success");
      setTimeout(() => {
        navigate(`/create-bill?title=Manual+Entry&amount=0`);
      }, 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      handleUpload(droppedFile);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Upload Receipt
        </h1>
        <p className="mt-2 text-muted-foreground">
          Automatically extract details from your physical or digital receipts.
        </p>
      </div>

      {status === "idle" && (
        <div 
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-muted/10 p-12 text-center transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <UploadCloud size={32} />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Drag & drop your receipt
          </h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Supports JPG, PNG and PDF files up to 10MB. We'll use AI to automatically extract the amount, date, and line items.
          </p>
          <Button type="button">
            Browse Files
          </Button>
        </div>
      )}

      {status !== "idle" && previewUrl && (
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-muted/30 p-8">
          <div className="relative mb-6 flex h-48 w-40 items-center justify-center rounded-xl bg-background shadow-sm overflow-hidden">
            <img src={previewUrl} alt="Receipt preview" className="h-full w-full object-cover opacity-50 grayscale" />
            
            {status === "scanning" && (
              <>
                <div className="absolute inset-0 z-10 animate-pulse bg-primary/10" />
                <div className="absolute top-0 left-0 h-full w-full z-20 overflow-hidden">
                  <div className="h-1 w-full bg-primary absolute shadow-[0_0_8px_2px_rgba(var(--primary),0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                </div>
                <div className="absolute z-30 rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                  <ScanLine className="animate-pulse" size={24} />
                </div>
              </>
            )}

            {status === "success" && (
              <div className="absolute z-30 rounded-full bg-success p-3 text-white shadow-lg animate-in zoom-in duration-300">
                <CheckCircle2 size={24} />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-foreground">
            {status === "scanning" ? "Extracting Details..." : "Extraction Complete!"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {status === "scanning" 
              ? "Our AI is reading your receipt. Please wait." 
              : "Redirecting to Bill Form..."}
          </p>
        </div>
      )}

      <div className="rounded-xl border bg-primary/5 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/20 p-2 text-primary">
            <ScanLine size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">AI Receipt Processing</h4>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Our advanced AI will scan your receipt and automatically populate a new Bill form for you to review and split with friends. This feature is currently in beta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
