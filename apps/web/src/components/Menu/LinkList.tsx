import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <li>
      <h3 className="text-sm font-semibold text-secondary">{props.title}</h3>
      <ul role="list" className="mt-2 space-y-1">
        {props.children}
      </ul>
    </li>
  );
}
