"use client";

import { Button } from "@repo/ui/button";

import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button type="button" onClick={toggleTheme} className="hover:text-primaryHover cursor-pointer">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
