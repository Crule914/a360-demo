import { Star } from "lucide-react";
import { Card } from "./ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  starred?: boolean;
  onToggleStar?: () => void;
}

export const DashboardCard = ({
  title,
  subtitle,
  children,
  starred = false,
  onToggleStar,
}: DashboardCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-card-foreground text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {onToggleStar && (
          <button
            onClick={onToggleStar}
            className="text-warning hover:scale-110 transition-transform"
          >
            <Star className={`h-5 w-5 ${starred ? "fill-warning" : ""}`} />
          </button>
        )}
      </div>
      {children}
    </Card>
  );
};
