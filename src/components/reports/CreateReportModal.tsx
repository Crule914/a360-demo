import { useState } from "react";
import { Sparkles, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Checkbox } from "../ui/checkbox";
import { REPORTS } from "@/constants/reports";

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateReportModal = ({ isOpen, onClose }: CreateReportModalProps) => {
  const [aiDescription, setAiDescription] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId],
    );
  };

  const handleAICreate = () => {
    /* placeholder */
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <div className="p-8 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-8">
            <div>
              <h2 className="text-4xl font-light mb-2">
                <span className="text-primary font-medium">Hello,</span>
                <span className="text-muted-foreground"> Let's start creating</span>
              </h2>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Create custom report from 1 or multiple templates
              </h3>
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-4">
                  {REPORTS.map((report) => {
                    const Icon = report.icon;
                    const isSelected = selectedTemplates.includes(report.id);
                    return (
                      <CarouselItem key={report.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <Card
                          className={`cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 ${
                            isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                          }`}
                          onClick={() => handleTemplateToggle(report.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center">
                                <Icon className="h-16 w-16 text-primary" />
                              </div>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleTemplateToggle(report.id)}
                                className="ml-2 mt-2"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <h4 className="font-semibold mb-2">{report.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Or let VIDA AI help you create
              </h3>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Describe the report you want to create or upload a file for analysis
                    </p>
                    <div className="flex gap-3">
                      <Input
                        placeholder='Describe the report you want to create. Type "@" to include content from your files.'
                        value={aiDescription}
                        onChange={(e) => setAiDescription(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAICreate}
                        disabled={!aiDescription.trim()}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Create
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              AI can make mistakes, so double-check important details.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
