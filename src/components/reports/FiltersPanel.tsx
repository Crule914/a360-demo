import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  reportId?: string;
  onUpdateReport?: () => void;
}

export const FiltersPanel = ({
  isOpen,
  onClose,
  className,
  reportId,
  onUpdateReport,
}: FiltersPanelProps) => {
  const [date, setDate] = useState<Date>();
  const [dateOption, setDateOption] = useState("yesterday");

  const handleChange = () => {};

  if (!isOpen) return null;
  const isAllocationReport = reportId === "allocation-holdings-summary";

  return (
    <div
      className={`h-full bg-card border-l border-t border-border flex flex-col w-[360px] rounded-tl-lg overflow-hidden ${
        className || ""
      }`}
    >
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold">Configure Report</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Mask Account Number</Label>
              <RadioGroup defaultValue="yes" className="flex gap-4" onValueChange={handleChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {isAllocationReport && (
            <>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">View</Label>
                <RadioGroup
                  defaultValue="consolidated"
                  className="space-y-2"
                  onValueChange={handleChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consolidated" id="consolidated" />
                    <Label htmlFor="consolidated" className="text-sm">
                      Consolidated
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="account-by-account" id="account-by-account" />
                    <Label htmlFor="account-by-account" className="text-sm">
                      Account by Account
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Date</Label>
                <Select
                  value={dateOption}
                  onValueChange={(v) => {
                    setDateOption(v);
                    handleChange();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="prior-month-end">Prior month end</SelectItem>
                    <SelectItem value="prior-quarter-end">Prior quarter end</SelectItem>
                    <SelectItem value="prior-year-end">Prior year end</SelectItem>
                    <SelectItem value="custom">Custom date</SelectItem>
                  </SelectContent>
                </Select>
                {dateOption === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          handleChange();
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Group by</Label>
                <Select defaultValue="asset-category" onValueChange={handleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="asset-category">Asset Category</SelectItem>
                    <SelectItem value="asset-sector">Asset Sector</SelectItem>
                    <SelectItem value="super-sector">Super Sector</SelectItem>
                    <SelectItem value="asset-type">Asset Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {!isAllocationReport && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold uppercase tracking-wide text-sm text-foreground">
                  Filters
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Date</Label>
                    <Select defaultValue="yesterday" onValueChange={handleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="closed-accounts" defaultChecked onCheckedChange={handleChange} />
                    <Label htmlFor="closed-accounts" className="text-sm">
                      Include Closed Accounts
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  onUpdateReport?.();
                  onClose();
                }}
              >
                Run Report
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="ghost" className="flex-1 text-muted-foreground">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
