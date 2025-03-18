import * as React from "react";
import Svg, { Path, Polygon } from "react-native-svg";

interface MapArrowProps {
  color?: string;
  size?: number;
}

export function MapArrow({ color = "#000000", size = 24 }: MapArrowProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polygon
        points="6 12 20 6 14 20 12 14 6 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
} 