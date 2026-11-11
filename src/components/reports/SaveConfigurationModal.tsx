import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SaveConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  defaultTitle: string;
  defaultDescription: string;
  mode?: "create" | "edit";
}

export const SaveConfigurationModal = ({
  isOpen,
  onClose,
  onSave,
  defaultTitle,
  defaultDescription,
  mode = "create",
}: SaveConfigurationModalProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), description.trim());
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleOpen = () => {
    setTitle(defaultTitle);
    setDescription(defaultDescription);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Report" : "Save Template"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the name and description of this custom report."
              : "Save your current report configuration as a new custom report."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Report Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter report name"
              maxLength={100}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              maxLength={200}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {mode === "edit" ? "Update Report" : "Save Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
