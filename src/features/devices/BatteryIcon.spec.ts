import { getIconByLevel } from './BatteryIcon';
import {
  Battery0BarOutlined,
  Battery1BarOutlined,
  Battery2BarOutlined,
  Battery3BarOutlined,
  Battery4BarOutlined,
  Battery5BarOutlined,
  Battery6BarOutlined,
} from '@mui/icons-material';

describe('BatteryIcon', () => {
  it('Should return correct icon depending on battery level', () => {
    expect(getIconByLevel(0)).toStrictEqual(Battery0BarOutlined);
    expect(getIconByLevel(20)).toStrictEqual(Battery1BarOutlined);
    expect(getIconByLevel(30)).toStrictEqual(Battery2BarOutlined);
    expect(getIconByLevel(40)).toStrictEqual(Battery3BarOutlined);
    expect(getIconByLevel(60)).toStrictEqual(Battery4BarOutlined);
    expect(getIconByLevel(70)).toStrictEqual(Battery5BarOutlined);
    expect(getIconByLevel(90)).toStrictEqual(Battery6BarOutlined);
    expect(getIconByLevel(100)).toStrictEqual(Battery6BarOutlined);
  });
});
