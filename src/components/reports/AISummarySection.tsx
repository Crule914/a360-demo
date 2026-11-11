import { useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface AISummarySectionProps {
  onOpenChat?: (question: string) => void;
  onClose?: () => void;
  title?: string;
  summary?: React.ReactNode;
}

export const AISummarySection = ({
  onOpenChat: _onOpenChat,
  onClose,
  title: _title = "Portfolio Summary",
  summary,
}: AISummarySectionProps) => {
  const [question, setQuestion] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsFeedbackModalOpen(true);
    setQuestion("");
  };

  return (
    <>
      <Card className="p-0 mb-6 bg-[hsl(var(--purple-3)/0.08)] border-0 border-l-[4px] border-l-[hsl(var(--purple-4))] shadow-none mx-[5%] rounded-md overflow-hidden relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
            aria-label="Close AI Summary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="px-5 py-3 space-y-3">
          <div className="flex items-center gap-[5px]">
            <Sparkles className="h-[14px] w-[14px] text-[hsl(var(--purple-4))]" fill="currentColor" />
            <h2 className="font-semibold text-xs leading-[15px] text-[hsl(var(--purple-4))]">
              AI Report Summary
            </h2>
          </div>

          {summary ? (
            <div className="text-xs leading-tight text-foreground">{summary}</div>
          ) : (
            <ul className="text-xs leading-relaxed text-foreground list-disc list-inside space-y-1">
              <li>
                The Sweets household portfolio shows strong overall performance with a well-diversified
                Schwab asset allocation.
              </li>
              <li>
                The portfolio is currently valued at <span className="font-bold">$3.4M</span> with a
                year-to-date return of <span className="font-bold">8.6%</span>, slightly outperforming
                the Schwab 60/40 benchmark.
              </li>
              <li>
                Domestic equity allocation at <span className="font-bold">62.4%</span> (SCHB/SCHX)
                provides solid growth potential while maintaining moderate risk exposure.
              </li>
            </ul>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 mx-[10%]">
            <Input
              type="text"
              placeholder="Coming Soon... but tell us what you'd ask"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 text-sm bg-white/60 border-none focus:ring-1 focus:ring-[hsl(var(--purple-4)/0.3)] placeholder:text-[hsl(var(--purple-4)/0.5)]"
            />
            <Button type="submit" size="sm" variant="purple">
              <Send className="h-4 w-4 mr-1" />
              Ask
            </Button>
          </form>
        </div>
      </Card>

      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[hsl(var(--purple-4))]" />
              Got It – Thanks!
            </DialogTitle>
            <DialogDescription className="text-left pt-2">
              Questions like yours help us build smarter AI insights. Stay tuned – this feature is coming
              soon.
              <br />
              <br />
              Feel free to submit as many suggestions as you'd like.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 flex items-start justify-center">
            <Button onClick={() => setIsFeedbackModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
