import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../styles";
import  MaskedTabBar  from "@/components/organisms/masked-tab-bar"
import { useEffect, useState } from "react";
import { Href, usePathname, router } from "expo-router";

const TABS = [
  { value: "/", label: "Início", icon: "home" },
  { value: "/agenda", label : "Agenda",icon: "calendar" },
  { value: "/profile", label: "Perfil", icon: "person" },
  { value: "/settings", label: "Definições", icon: "settings" },
] as const;

export default function Footer() {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();
    const height = 100 + insets.bottom;
    const [tab, setTab] = useState<string>("/");
    useEffect(() => {
        setTab(pathname);
      }, [pathname]);
  return (
    <View style={[styles.wrapper, { height }]} pointerEvents="box-none">
      {/* <MaskedView
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        maskElement={ */}
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[0, 0.7]}
            style={StyleSheet.absoluteFill}
          />
        {/* }
      >
      </MaskedView> */}
      <View>
      <MaskedTabBar
        value={tab}
        onValueChange={(path) => {
          setTab(path);
          router.navigate(path as Href);
        }}
        radius={99}
        style={styles.bar}
        palette={{ pill: "cyan", active: "#000000", inactive: "#f7f7f7ff" }}
      >
        <MaskedTabBar.List>
          {TABS.map(({ value, label, icon }) => (
            <MaskedTabBar.Trigger key={value} style = {{flexDirection: 'column', gap: 3}} value={value}>
              <MaskedTabBar.Icon>
                {({ color, size, active }) => (
                  <Ionicons
                    name={active ? icon : `${icon}-outline`}
                    size={size}
                    color={color}
                  />
                )}
              </MaskedTabBar.Icon>
              <MaskedTabBar.Label style = {{fontSize:  10}}>{label}</MaskedTabBar.Label>
            </MaskedTabBar.Trigger>
          ))}
        </MaskedTabBar.List>
      </MaskedTabBar>
    </View>
    </View>
  );
}
