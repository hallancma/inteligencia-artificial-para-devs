/// <reference types="vite/client" />

declare module '@/components/ui/alert' {
  import type { ComponentType, HTMLAttributes } from 'react'

  export const Alert: ComponentType<HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }>
  export const AlertTitle: ComponentType<HTMLAttributes<HTMLHeadingElement>>
  export const AlertDescription: ComponentType<HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/card' {
  import type { ComponentType, HTMLAttributes } from 'react'

  export const Card: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardHeader: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardTitle: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardDescription: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardContent: ComponentType<HTMLAttributes<HTMLDivElement>>
  export const CardFooter: ComponentType<HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/chart' {
  import type { ComponentType, ReactElement, ReactNode } from 'react'
  import type { TooltipProps } from 'recharts'

  export const ChartContainer: ComponentType<{
    className?: string
    children: ReactNode
    config: Record<string, { label: string; color?: string; theme?: Record<string, string> }>
  }>

  export const ChartTooltip: ComponentType<TooltipProps<number, string>>
  export const ChartTooltipContent: ComponentType<{
    className?: string
    formatter?: (...args: unknown[]) => ReactNode
    labelFormatter?: (label: string | number, payload: Array<{ payload?: Record<string, unknown> }>) => ReactNode
  }>
  export const ChartLegend: ComponentType<Record<string, unknown>>
  export const ChartLegendContent: ComponentType<Record<string, unknown>>
  export const ChartStyle: ComponentType<Record<string, unknown>>
}

declare module '@/components/ui/input' {
  import type { ComponentType, InputHTMLAttributes } from 'react'

  export const Input: ComponentType<InputHTMLAttributes<HTMLInputElement>>
}

declare module '@/components/ui/skeleton' {
  import type { ComponentType, HTMLAttributes } from 'react'

  export const Skeleton: ComponentType<HTMLAttributes<HTMLDivElement>>
}
