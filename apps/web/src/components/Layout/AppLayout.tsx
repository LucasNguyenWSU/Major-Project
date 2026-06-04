import type { PropsWithChildren } from "react";
import { getCurrentCommenter } from "@/utils/auth";
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
  const currentCommenter = await getCurrentCommenter();

  return (
    <div className="flex min-h-screen">
      <LeftMenu
        selectedCategorySlug={sidebar?.categorySlug}
        selectedTagSlug={sidebar?.tagSlug}
        selectedYear={sidebar?.selectedYear}
        selectedMonth={sidebar?.selectedMonth}
      />
      <Content>
        <TopMenu query={query} currentCommenter={currentCommenter} />
        {children}
      </Content>
    </div>
  );
}
