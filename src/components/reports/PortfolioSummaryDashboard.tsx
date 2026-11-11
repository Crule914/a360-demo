import { useState } from "react";
import { DollarSign, GripVertical } from "lucide-react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AISummarySection } from "./AISummarySection";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  onReportUpdated?: () => void;
  [key: string]: any;
}

const activityData = [
  { label: "Beginning Balance (1/1/2026)", value: "$3,179,014.08" },
  { label: "Net Contributions / Withdrawals", value: "$7,000.00" },
  { label: "Net Change", value: "$234,350.72", highlight: true },
  { label: "Ending Balance (5/20/2026)", value: "$3,420,364.80" },
];

const accountsData = [
  { account: "Sweets Joint Brokerage (xxxx6508)", cash: "72,150.00", value: "1,628,750.40" },
  { account: "Rick Sweets — Schwab IRA (xxxx7886)", cash: "28,400.00", value: "894,210.18" },
  { account: "Karen Sweets — Schwab Roth IRA (xxxx7319)", cash: "18,250.00", value: "612,488.92" },
  { account: "Sweets Family Trust (xxxx4902)", cash: "10,000.00", value: "284,915.30" },
];

const assetClassData = [
  { name: "Domestic Equity", value: 62.4, color: "#2563eb" },
  { name: "Fixed Income", value: 18.5, color: "#f59e0b" },
  { name: "International Equity", value: 12.2, color: "#10b981" },
  { name: "Real Estate (SCHH)", value: 4.5, color: "#8b5cf6" },
  { name: "Cash & Equivalents", value: 2.4, color: "#ef4444" },
];

interface SortableWidgetProps {
  id: string;
  children: (p: { attributes: any; listeners: any }) => React.ReactNode;
  isDragEnabled: boolean;
}
const SortableWidget = ({ id, children, isDragEnabled }: SortableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !isDragEnabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
};

export const PortfolioSummaryDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
  onReportUpdated,
}: Props) => {
  const [widgetOrder, setWidgetOrder] = useState([
    "activity-summary",
    "asset-class-allocation",
    "accounts",
    "disclosures",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
      onReportUpdated?.();
    }
  };

  const widgets: Record<string, (p: { attributes: any; listeners: any }) => React.ReactNode> = {
    "activity-summary": ({ attributes, listeners }) => (
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-lg">Activity Summary</span>
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {activityData.map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p
                className={`text-lg font-semibold ${
                  item.highlight ? "text-[hsl(var(--success))]" : ""
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    ),
    "asset-class-allocation": ({ attributes, listeners }) => (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <span>Asset Class Allocation</span>
          </h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetClassData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {assetClassData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    ),
    accounts: ({ attributes, listeners }) => (
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <DollarSign className="h-5 w-5" />
          <span className="text-lg">Schwab Accounts</span>
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cash ($)</TableHead>
              <TableHead className="text-right">Value ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountsData.map((account, index) => (
              <TableRow key={index}>
                <TableCell>{account.account}</TableCell>
                <TableCell className="text-right">{account.cash}</TableCell>
                <TableCell className="text-right">{account.value}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-semibold border-t-2">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">$128,800.00</TableCell>
              <TableCell className="text-right">$3,420,364.80</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    ),
    disclosures: ({ attributes, listeners }) => (
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-lg">Disclosures</span>
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Account valuations are provided by Charles Schwab & Co., Inc. ("Schwab"), Member FINRA/SIPC.
            Past performance is not indicative of future results.
          </p>
          <p className="text-xs">This report is incomplete without the accompanying disclosure page.</p>
        </div>
      </Card>
    ),
  };

  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection onOpenChat={onOpenChat} onClose={onToggleAISummary} />
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-6">
              {widgetOrder.map((widgetId) => {
                const isFullWidth =
                  widgetId === "activity-summary" ||
                  widgetId === "accounts" ||
                  widgetId === "disclosures";
                return (
                  <div key={widgetId} className={isFullWidth ? "col-span-2" : "col-span-1"}>
                    <SortableWidget id={widgetId} isDragEnabled={true}>
                      {widgets[widgetId]}
                    </SortableWidget>
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
