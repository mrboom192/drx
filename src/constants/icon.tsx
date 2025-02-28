import GametimeIcons from "../components/icons/GametimeIcons";

type IconRenderProps = { color?: string; size?: number };

export const icon: any = {
  index: (props: IconRenderProps) => (
    <GametimeIcons name="Home" size={24} {...props} />
  ),
  routines: (props: IconRenderProps) => (
    <GametimeIcons name="RoutinesGroup" size={24} {...props} />
  ),
  progress: (props: IconRenderProps) => (
    <GametimeIcons name="BarChartIcon" size={24} {...props} />
  ),
  profile: (props: IconRenderProps) => (
    <GametimeIcons name="UserOutline" size={24} {...props} />
  ),
};
