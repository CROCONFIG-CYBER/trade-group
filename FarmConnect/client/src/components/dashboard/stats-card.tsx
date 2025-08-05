import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconBgColor = "bg-primary bg-opacity-10",
  iconColor = "text-primary"
}: StatsCardProps) {
  return (
    <Card data-testid={`stats-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm" data-testid={`stats-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900" data-testid={`stats-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
          </div>
          <div className={`${iconBgColor} p-3 rounded-lg`}>
            <Icon className={`${iconColor} text-xl h-6 w-6`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-3">
            <span 
              className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              data-testid={`stats-trend-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
            <span className="text-gray-600 text-sm ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
