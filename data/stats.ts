export type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 90, suffix: "%", label: "YOLO detection accuracy" },
  { value: 1, suffix: " yr", label: "Robotics engineering" },
  { value: 5, suffix: "+", label: "Projects shipped" },
  { value: 98.96, decimals: 2, label: "MHTCET percentile" },
];
