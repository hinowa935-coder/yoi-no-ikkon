import { publicSpecText } from "./publicDisplay.js";

// Display helpers do not convert missing source values into numeric ranges.
export function displaySpec(value, unit = "") {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(v => displaySpec(v, unit)).filter(Boolean).join("、");
  if (typeof value === "object") {
    if ("minC" in value || "maxC" in value) {
      const range = value.minC != null && value.maxC != null ? `${value.minC}〜${value.maxC}℃`
        : value.minC != null ? `${value.minC}℃以上` : value.maxC != null ? `${value.maxC}℃以下` : "";
      return [value.label ? publicSpecText(value.label) : "", range].filter(Boolean).join("：");
    }
    return Object.entries(value).filter(([, v]) => v != null).map(([key, val]) => {
      const label = publicSpecText(({ koji: "麹米", kake: "掛米", overall: "全体" })[key] || key);
      const text = displaySpec(val, unit);
      return label && text ? `${label}: ${text}` : "";
    }).filter(Boolean).join(" / ");
  }
  return typeof value === "number" ? `${value}${unit}` : publicSpecText(value);
}
