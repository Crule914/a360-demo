import { useState } from "react";
import { MoreVertical, Pencil, Check, X, ChevronDown, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check as CheckIcon } from "lucide-react";

interface RelatedReport {
  id: string;
  title: string;
  isCustom?: boolean;
}

interface ReportDescriptionHeaderProps {
  title: string;
  description: string;
  isCustom?: boolean;
  onDescriptionChange?: (newDescription: string) => void;
  relatedReports?: RelatedReport[];
  currentReportId?: string;
  onReportChange?: (reportId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onEditReport?: () => void;
  onDeleteReport?: () => void;
  hasUnsavedChanges?: boolean;
  onSaveExisting?: () => void;
  onSaveConfiguration?: () => void;
}

export const ReportDescriptionHeader = ({
  title,
  description,
  isCustom = false,
  onDescriptionChange,
  relatedReports = [],
  currentReportId,
  onReportChange,
  isFavorite = false,
  onToggleFavorite,
  onEditReport,
  onDeleteReport,
  hasUnsavedChanges = false,
  onSaveExisting,
  onSaveConfiguration,
}: ReportDescriptionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    if (onDescriptionChange) onDescriptionChange(editedDescription.trim());
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedDescription(description);
    setIsEditing(false);
  };

  const hasRelatedReports = relatedReports.length > 1;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {hasRelatedReports && onReportChange ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors focus:outline-none">
              <h1 className="text-lg text-foreground">{title}</h1>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
              {relatedReports.map((report) => (
                <DropdownMenuItem
                  key={report.id}
                  onClick={() => onReportChange(report.id)}
                  className="flex items-center justify-between"
                >
                  <span className="flex-1">
                    {report.title}
                    {!report.isCustom && (
                      <span className="text-muted-foreground ml-2 text-xs">(Default)</span>
                    )}
                  </span>
                  {currentReportId === report.id && <CheckIcon className="h-4 w-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <h1 className="text-lg text-foreground">{title}</h1>
        )}

        <div className="flex items-center gap-3 ml-2">
          {isCustom && (onEditReport || onDeleteReport) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:text-primary transition-colors" title="More options">
                  <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {onEditReport && (
                  <DropdownMenuItem onClick={onEditReport}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit Name & Description
                  </DropdownMenuItem>
                )}
                {onDeleteReport && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onDeleteReport}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete Custom Template
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {onToggleFavorite && (
            <button onClick={onToggleFavorite} className="hover:scale-110 transition-transform">
              <Star
                className={`h-4 w-4 ${
                  isFavorite ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" : "text-muted-foreground"
                }`}
              />
            </button>
          )}

          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                Draft
              </Badge>
              {isCustom && onSaveExisting && (
                <>
                  <button
                    onClick={onSaveExisting}
                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Save
                  </button>
                  <span className="text-muted-foreground">|</span>
                </>
              )}
              {onSaveConfiguration && (
                <button
                  onClick={onSaveConfiguration}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  {isCustom ? "Save as New Template" : "Save Template"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-2 mt-1">
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="resize-none min-h-[60px]"
            maxLength={500}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-3.5 w-3.5 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 mt-0.5">
          <p className="text-muted-foreground text-xs flex-1">{description}</p>
          {isCustom && onDescriptionChange && (
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 shrink-0"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
