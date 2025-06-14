import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  UsersRound,
} from "lucide-react-native";

const width = 26;
const height = 26;

const IncomeIcon = ({ color }: { color: string }) => (
  <ArrowBigDownDash width={width} height={height} color={color} />
);

const EgressIcon = ({ color }: { color: string }) => (
  <ArrowBigUpDash width={width} height={height} color={color} />
);

const ConfigIcon = ({ color }: { color: string }) => (
  <UsersRound width={width} height={height} color={color} />
);
export default {
  IncomeIcon,
  EgressIcon,
  ConfigIcon,
};
