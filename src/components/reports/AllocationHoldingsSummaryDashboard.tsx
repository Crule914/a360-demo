import { useState } from "react";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AISummarySection } from "./AISummarySection";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
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

interface AllocationHoldingsSummaryDashboardProps {
  isFiltersPanelOpen?: boolean;
  onToggleFiltersPanel?: () => void;
  onOpenChat?: (question: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  onReportUpdated?: () => void;
  // Other props from ReportsHeader/wrapper are accepted but unused here.
  [key: string]: any;
}

// Sweets household — Schwab-themed asset categories
const assetCategoryData = [
  { name: "Large-Cap Blend (SCHB / SCHX)", value: 962145.5, percentage: 28.45, color: "#1e3a8a" },
  { name: "US Total Stock Market (SWTSX)", value: 528900.3, percentage: 15.64, color: "#3b82f6" },
  { name: "US Aggregate Bond (SCHZ)", value: 481250.0, percentage: 14.23, color: "#60a5fa" },
  { name: "International Equity (SCHF / SWISX)", value: 412678.2, percentage: 12.2, color: "#86cc8e" },
  { name: "Schwab Money Market", value: 186420.18, percentage: 5.51, color: "#a3d9a5" },
  { name: "Municipal Bonds (SCMB)", value: 162844.6, percentage: 4.82, color: "#fbbf24" },
  { name: "Real Estate (SCHH)", value: 152780.9, percentage: 4.52, color: "#fcd34d" },
  { name: "Emerging Markets (SCHE)", value: 138290.7, percentage: 4.09, color: "#fb923c" },
  { name: "Dividend Equity (SCHD)", value: 124918.45, percentage: 3.69, color: "#f97316" },
  { name: "Short-Term Treasury (SCHO)", value: 110256.12, percentage: 3.26, color: "#be123c" },
  { name: "Mid-Cap (SCHM)", value: 79430.4, percentage: 2.35, color: "#e11d48" },
  { name: "Remaining", value: 41884.65, percentage: 1.24, color: "#6b21a8" },
];


const chartConfig = { value: { label: "Value" } };

interface SortableWidgetProps {
  id: string;
  children: (dragHandleProps: { attributes: any; listeners: any }) => React.ReactNode;
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

export const AllocationHoldingsSummaryDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
  onReportUpdated,
}: AllocationHoldingsSummaryDashboardProps) => {
  const [chartType, setChartType] = useState("donut");
  const [widgetOrder, setWidgetOrder] = useState(["asset-category"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleChartTypeChange = (value: string) => {
    setChartType(value);
    onReportUpdated?.();
  };

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

  const totalValue = assetCategoryData.reduce((sum, item) => sum + item.value, 0);


  const widgets: Record<string, (p: { attributes: any; listeners: any }) => React.ReactNode> = {
    "asset-category": ({ attributes, listeners }) => (
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <span>Asset Category Allocation</span>
          </h2>
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="pie">Pie</SelectItem>
              <SelectItem value="donut">Donut</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="horizontal-bar">Horizontal Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-[300px_1fr] gap-6">
          {(chartType === "pie" || chartType === "donut") && (
            <>
              <div className="flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[240px] w-[240px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={assetCategoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={chartType === "donut" ? 60 : 0}
                      outerRadius={100}
                      strokeWidth={2}
                    >
                      {assetCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-sm">Asset Category</TableHead>
                      <TableHead className="text-right font-semibold text-sm">Value ($)</TableHead>
                      <TableHead className="text-right font-semibold text-sm">(%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetCategoryData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center gap-2 py-1.5 text-sm">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </TableCell>
                        <TableCell className="text-right py-1.5 text-sm">
                          {item.value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right py-1.5 text-sm">
                          {item.percentage.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold py-1.5 text-sm">Total</TableCell>
                      <TableCell className="text-right font-bold py-1.5 text-sm">
                        $
                        {totalValue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold py-1.5 text-sm">100%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          )}
          {chartType === "bar" && (
            <div className="col-span-2">
              <div className="h-80 mb-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={assetCategoryData}>
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {assetCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          )}
          {chartType === "horizontal-bar" && (
            <div className="col-span-2">
              <div className="h-80 mb-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={assetCategoryData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={180} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {assetCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          )}
        </div>
      </Card>
    ),
  };


  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Allocation and Holdings Summary"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>

                  <strong>Investment Types:</strong> 10 Schwab ETFs/mutual funds plus a Schwab money
                  market position
                </li>
                <li>
                  <strong>Notable Allocations:</strong> Fixed income{" "}
                  <span className="font-bold">19.05%</span>, international exposure{" "}
                  <span className="font-bold">16.29%</span>, REIT exposure{" "}
                  <span className="font-bold">4.52%</span>
                </li>
              </ul>
            }
          />
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
            <div>
              {widgetOrder.map((widgetId) => (
                <SortableWidget key={widgetId} id={widgetId} isDragEnabled={true}>
                  {widgets[widgetId]}
                </SortableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
