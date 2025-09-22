"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "يناير", buy: 186, sell: 80 },
    { month: "فبراير", buy: 305, sell: 200 },
    { month: "مارس", buy: 237, sell: 120 },
    { month: "أبريل", buy: 73, sell: 190 },
    { month: "مايو", buy: 209, sell: 130 },
    { month: "يونيو", buy: 214, sell: 140 },
  ]
  

const chartConfig = {
  buy: {
    label: "شراء",
    color: "hsl(var(--chart-1))",
  },
  sell: {
    label: "بيع",
    color: "hsl(var(--chart-2))",
  },
}

export function DashboardChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>نظرة عامة على المعاملات</CardTitle>
        <CardDescription>يناير - يونيو 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
            <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                reversed
            />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="buy" fill="var(--color-buy)" radius={4} />
            <Bar dataKey="sell" fill="var(--color-sell)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
