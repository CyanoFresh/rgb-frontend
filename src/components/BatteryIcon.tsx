import {
  Battery0BarOutlined,
  Battery1BarOutlined,
  Battery2BarOutlined,
  Battery3BarOutlined,
  Battery4BarOutlined,
  Battery5BarOutlined,
  Battery6BarOutlined,
} from '@mui/icons-material';

const icons = [
  Battery0BarOutlined,
  Battery1BarOutlined,
  Battery2BarOutlined,
  Battery3BarOutlined,
  Battery4BarOutlined,
  Battery5BarOutlined,
  Battery6BarOutlined,
];

export function getIconByLevel(level: number) {
  const index = Math.round(level / (100 / icons.length));

  return icons[Math.min(Math.max(index, 0), icons.length - 1)];
}

export function BatteryIcon({ level }: { level: number }) {
  const Icon = getIconByLevel(level);

  return <Icon />;
}
