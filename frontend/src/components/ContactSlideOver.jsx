import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Github, Linkedin, Copy, Check } from "lucide-react";

function classNames(...xs) { return xs.filter(Boolean).join(" "); }

export default function ContactSlideOver({ open, onClose, email, github, linkedin }) {
  const [toast, setToast] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setToast(null); setCopied(false); }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const notify = (text, type = 'success') => {
    setToast({ id: Date.now(), text, type });
    setTimeout(() => setToast(null), 2200);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      notify('Email copied');
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      notify('Copy failed', 'error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl border-l border-black/10 dark:border-white/10 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-label="Contact"
          >
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="h-9 px-3 rounded-full text-sm flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black">Contact</span>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-4 flex-1 overflow-auto">
              <div className="grid grid-cols-1 gap-3">
                <a href={`mailto:${email}`} className="group rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/50 p-4 flex items-center justify-between hover:bg-white/90 dark:hover:bg-neutral-900/70 transition">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full grid place-items-center bg-black text-white dark:bg-white dark:text-black"><Mail className="h-5 w-5" /></span>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs opacity-80">{email}</div>
                    </div>
                  </div>
                  <button type="button" onClick={(e) => { e.preventDefault(); copyEmail(); }} className="h-9 px-3 rounded-full text-sm border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/60 hover:bg-white/90 dark:hover:bg-neutral-900/80 inline-flex items-center gap-2">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </a>

                <a href={github} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/50 p-4 flex items-center justify-between hover:bg-white/90 dark:hover:bg-neutral-900/70 transition">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full grid place-items-center bg-black text-white dark:bg-white dark:text-black"><Github className="h-5 w-5" /></span>
                    <div>
                      <div className="font-medium">GitHub</div>
                      <div className="text-xs opacity-80 truncate max-w-[16rem]">{github}</div>
                    </div>
                  </div>
                  <span className="text-sm opacity-70 group-hover:opacity-100">Open →</span>
                </a>

                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/50 p-4 flex items-center justify-between hover:bg-white/90 dark:hover:bg-neutral-900/70 transition">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full grid place-items-center bg-black text-white dark:bg-white dark:text-black"><Linkedin className="h-5 w-5" /></span>
                    <div>
                      <div className="font-medium">LinkedIn</div>
                      <div className="text-xs opacity-80 truncate max-w-[16rem]">{linkedin}</div>
                    </div>
                  </div>
                  <span className="text-sm opacity-70 group-hover:opacity-100">Open →</span>
                </a>
              </div>
            </div>

            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.id}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  className={classNames('pointer-events-none fixed bottom-4 right-4 z-[60] px-4 py-2 rounded-full text-sm shadow', toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white')}
                >
                  {toast.text}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
