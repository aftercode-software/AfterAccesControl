export interface TabIconProps {
  IconComponent: React.ComponentType<{ color: string }>;
  color: string;
  name: string;
  focused: boolean;
}
