import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
  sidebar,
}: PropsWithChildren<{
  query?: string;
  sidebar?: {
    categorySlug?: string;
    tagSlug?: string;
    selectedYear?: string;
    selectedMonth?: string;
  };
}>) {
  return (
    <div className="flex min-h-screen">
      <LeftMenu
        selectedCategorySlug={sidebar?.categorySlug}
        selectedTagSlug={sidebar?.tagSlug}
        selectedYear={sidebar?.selectedYear}
        selectedMonth={sidebar?.selectedMonth}
      />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </div>
  );
}
