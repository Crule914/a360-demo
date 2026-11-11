import { TrendingUp, DollarSign, Calendar, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const insights = [
  {
    id: 1,
    icon: DollarSign,
    title: "Large Cash Deposit",
    status: "Money in Motion",
    statusColor: "bg-primary/20 text-primary border-primary/30",
    borderColor: "border-l-primary",
    description: "Large cash deposit detected in Rick's Schwab brokerage account.",
    metrics: [
      { label: "Amount:", value: "$75,000", highlight: true, highlightColor: "text-foreground" },
      { label: "Date:", value: "Jun 12, 2026" },
    ],
    actions: [
      { label: "Review Details", variant: "default" as const, color: "bg-primary hover:bg-primary/90" },
      { label: "View Transaction Activity Report", variant: "outline" as const, color: "" },
    ],
  },
  {
    id: 2,
    icon: GraduationCap,
    title: "529 Top-Up Opportunity",
    status: "Product",
    statusColor: "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]",
    borderColor: "border-l-[hsl(var(--warning))]",
    description: "Grandchild 529 (Schwab) is under-funded vs. annual gift target.",
    metrics: [
      { label: "Current balance:", value: "$18,400" },
      { label: "Gift remaining:", value: "$15,600 of $34,000", highlight: true, highlightColor: "text-[hsl(var(--warning))]" },
    ],
    actions: [
      { label: "Schedule Contribution", variant: "default" as const, color: "bg-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/0.9)] text-white" },
      { label: "Run Projections", variant: "outline" as const, color: "" },
    ],
  },
  {
    id: 3,
    icon: Calendar,
    title: "RMD Reminder",
    status: "Action Needed",
    statusColor: "bg-destructive/20 text-destructive border-destructive/30",
    borderColor: "border-l-destructive",
    description: "Karen's Schwab Traditional IRA RMD must be taken before year-end.",
    metrics: [
      { label: "RMD amount:", value: "$42,180", highlight: true, highlightColor: "text-destructive" },
    ],
    actions: [
      { label: "Process RMD", variant: "default" as const, color: "bg-destructive hover:bg-destructive/90" },
      { label: "Tax Withholding", variant: "outline" as const, color: "" },
    ],
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "IRA Contribution",
    status: "Product",
    statusColor: "bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]",
    borderColor: "border-l-[hsl(var(--warning))]",
    description:
      "Neither Rick nor Karen has funded their Schwab IRA this year. $16,000 catch-up opportunity before tax deadline.",
    metrics: [
      { label: "Karen's contribution:", value: "$0 of $8,000" },
      { label: "Rick's contribution:", value: "$0 of $8,000", highlight: true, highlightColor: "text-foreground" },
    ],
    actions: [
      { label: "Process Contribution", variant: "default" as const, color: "bg-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/0.9)] text-white" },
      { label: "Tax Impact", variant: "outline" as const, color: "" },
    ],
  },
  {
    id: 5,
    icon: DollarSign,
    title: "Tax-Smart Harvesting",
    status: "Tax",
    statusColor: "bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]",
    borderColor: "border-l-[hsl(var(--success))]",
    description: "3 Schwab positions eligible for tax-loss harvesting in Rick & Karen's joint account.",
    metrics: [
      { label: "Positions identified:", value: "3", highlight: true, highlightColor: "text-foreground" },
      { label: "Est. loss to harvest:", value: "$12,840" },
    ],
    actions: [
      { label: "View Positions", variant: "default" as const, color: "bg-[hsl(var(--success))] hover:bg-[hsl(var(--success)/0.9)] text-white" },
      { label: "View Realized Gain/Loss Report", variant: "outline" as const, color: "" },
    ],
  },
];

export const AIInsightsPanel = () => {
  return (
    <div className="bg-card border-b">
      <div className="px-6 py-4">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <CarouselItem key={insight.id} className="md:basis-1/2 lg:basis-1/3">
                  <div
                    className={`border-l-4 ${insight.borderColor} bg-background rounded-lg p-3 shadow-sm h-full`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm">{insight.title}</h3>
                          <Badge className={`${insight.statusColor} text-xs`}>{insight.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                          {insight.description}
                        </p>
                        <div className="space-y-1">
                          {insight.metrics.slice(0, 2).map((metric, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{metric.label}</span>
                              <span
                                className={`font-semibold ${
                                  metric.highlight
                                    ? metric.highlightColor || "text-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1.5 pt-1 flex-wrap">
                          {insight.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              variant={action.variant}
                              size="sm"
                              className={`${action.color} h-7 text-xs px-2`}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </div>
    </div>
  );
};
