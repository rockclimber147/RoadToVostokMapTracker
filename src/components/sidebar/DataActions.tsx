interface DataActionsProps {
  onExport: () => void;
  onImport: () => void;
  onAppend: () => void;
}

export default function DataActions({ onExport, onImport, onAppend }: DataActionsProps) {
  return (
    <footer className="mt-auto space-y-2">
      <button 
        onClick={onExport} 
        className="w-full text-[9px] font-bold tracking-[0.2em] border border-[#1A1A1A] py-3 hover:bg-blue-900/20 hover:border-blue-500/50 transition-all uppercase"
      >
        Copy to Clipboard
      </button>
      
      <div className="flex gap-2">
        <button 
          onClick={onImport} 
          className="flex-1 text-[9px] font-bold tracking-[0.1em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase opacity-40 hover:opacity-100"
          title="Overwrite current data"
        >
          Overwrite
        </button>
        <button 
          onClick={onAppend} 
          className="flex-1 text-[9px] font-bold tracking-[0.1em] border border-[#1A1A1A] py-3 hover:bg-[#E0E0E0] hover:text-black transition-all uppercase opacity-40 hover:opacity-100"
          title="Merge from clipboard"
        >
          Append
        </button>
      </div>
    </footer>
  );
}