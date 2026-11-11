import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { jarak, ukuran, warna } from '@/theme';

import { Teks } from './Teks';

/**
 * Renders no tab button: pass via `options={{ tabBarButton: TanpaTombolTab }}`
 * to keep a route navigable without giving it a tab button. (`href: null`
 * used to do this, but SDK 58 makes such routes unreachable and redirects
 * navigation to the initial tab.)
 */
export const TanpaTombolTab = () => null;

/**
 * Mahasiswa bottom tab bar from the Figma prototype: 76 tall, active tab in
 * red. Pass it to `<Tabs tabBar={(props) => <TabBar {...props} />}>`.
 * Icons come from each screen's `tabBarIcon` option; routes without a tab
 * button (`tabBarButton: TanpaTombolTab`) and internal (`hidden`) routes
 * are skipped.
 */
export function TabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View accessibilityRole="tablist" style={[styles.wadah, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, i) => {
        const { options } = descriptors[route.key];
        if (options.hidden || options.tabBarButton === TanpaTombolTab) return null;

        const aktif = state.index === i;
        const label = options.title ?? route.name;
        const w = aktif ? warna.merah : warna.teksSekunder;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: aktif }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={() => navigateToTab(route.key)}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.6 }]}
          >
            {options.tabBarIcon?.({ focused: aktif, color: w, size: 24 })}
            <Teks gaya="keterangan" style={{ color: w }} numberOfLines={1}>
              {label}
            </Teks>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    backgroundColor: warna.kartu,
    borderTopColor: warna.garis,
    borderTopWidth: ukuran.garis,
  },
  tab: {
    flex: 1,
    height: ukuran.tinggiTabBar,
    alignItems: 'center',
    justifyContent: 'center',
    gap: jarak.xxs,
  },
});
