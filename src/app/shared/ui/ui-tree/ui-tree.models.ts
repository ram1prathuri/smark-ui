export interface UiTreeNode {
  id: string | number;
  label: string;
  children?: UiTreeNode[];
  expanded?: boolean;
  color?: string; // Hex, rgb, or css variable
  icon?: string;
  data?: any; // Additional custom data payload
}
