import { ArrowDown, ArrowUp, UserPen } from "lucide-react-native";

const width = 24;
const height = 24;

const IncomeIcon = ({ color }: { color: string }) => (
  <ArrowDown width={width} height={height} />
);

const EgressIcon = ({ color }: { color: string }) => (
  <ArrowUp width={width} height={height} />
);

const ConfigIcon = ({ color }: { color: string }) => (
  <UserPen width={width} height={height} />
);

export default {
  IncomeIcon,
  EgressIcon,
  ConfigIcon,
};
