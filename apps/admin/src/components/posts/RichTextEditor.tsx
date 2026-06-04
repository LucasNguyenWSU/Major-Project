"use client";

import { marked } from "marked";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type Quill from "quill";
import type { EmitterSource, Range } from "quill";

export type RichTextSelection = {
  index: number;
  length: number;
};

export type RichTextEditorHandle = {
  focus: () => void;
  getSelection: () => RichTextSelection | null;
  setSelection: (selection: RichTextSelection | null) => void;
};

type Props = {
  id: string;
  labelledBy: string;
  value: string;
  onChange: (value: string) => void;
};

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function toEditorHtml(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (looksLikeHtml(trimmed)) {
    return value;
  }

  return marked.parse(value) as string;
}

function getEditorValue(editor: Quill) {
  const hasText = editor.getText().trim().length > 0;
  const hasEmbed = Boolean(editor.root.querySelector("img, video, iframe"));

  if (!hasText && !hasEmbed) {
    return "";
  }

  return editor.getSemanticHTML().trim();
}

function toSelection(range: Range | null): RichTextSelection | null {
  return range ? { index: range.index, length: range.length } : null;
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(
  function RichTextEditor({ id, labelledBy, value, onChange }, ref) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const selectionRef = useRef<RichTextSelection | null>(null);
    const lockedSelectionRef = useRef<RichTextSelection | null>(null);
    const initialValueRef = useRef(value);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      focus() {
        quillRef.current?.focus();
      },
      getSelection() {
        return (
          selectionRef.current ??
          toSelection(quillRef.current?.getSelection() ?? null)
        );
      },
      setSelection(selection) {
        if (!selection) {
          return;
        }

        selectionRef.current = selection;
        lockedSelectionRef.current = selection;

        if (!quillRef.current) {
          return;
        }

        quillRef.current.focus();
        quillRef.current.setSelection(selection.index, selection.length, "api");
      },
    }));

    useEffect(() => {
      let disposed = false;
      let removeListeners: (() => void) | null = null;
      let toolbarElement: Element | null = null;
      let editorElement: HTMLDivElement | null = null;

      async function loadEditor() {
        const { default: QuillEditor } = await import("quill");
        editorElement = editorRef.current;

        if (disposed || !editorElement) {
          return;
        }

        editorElement.innerHTML = toEditorHtml(initialValueRef.current);

        const editor = new QuillEditor(editorElement, {
          theme: "snow",
        });

        quillRef.current = editor;
        toolbarElement =
          editor.container.previousElementSibling?.classList.contains(
            "ql-toolbar",
          )
            ? editor.container.previousElementSibling
            : null;
        toolbarElement?.setAttribute("aria-label", "Formatting toolbar");

        const root = editor.root;
        root.classList.add("formatted-content-body");
        root.id = id;
        root.setAttribute("aria-labelledby", labelledBy);
        root.setAttribute("aria-multiline", "true");
        root.setAttribute("data-test-id", "rich-content-editor");
        root.setAttribute("role", "textbox");

        Object.defineProperties(root, {
          selectionEnd: {
            configurable: true,
            get() {
              const selection = toSelection(
                quillRef.current?.getSelection() ?? null,
              );
              const fallback = selectionRef.current;

              return fallback
                ? fallback.index + fallback.length
                : selection
                  ? selection.index + selection.length
                  : 0;
            },
          },
          selectionStart: {
            configurable: true,
            get() {
              return (
                selectionRef.current?.index ??
                toSelection(quillRef.current?.getSelection() ?? null)?.index ??
                0
              );
            },
          },
          setSelectionRange: {
            configurable: true,
            value(start: number, end: number) {
              const nextSelection = {
                index: start,
                length: Math.max(end - start, 0),
              };
              selectionRef.current = nextSelection;
              lockedSelectionRef.current = nextSelection;
              quillRef.current?.focus();
              quillRef.current?.setSelection(
                nextSelection.index,
                nextSelection.length,
                "api",
              );
            },
          },
        });

        const handleTextChange = (
          _delta: unknown,
          _oldContent: unknown,
          source: EmitterSource,
        ) => {
          if (source === "api") {
            return;
          }

          onChangeRef.current(getEditorValue(editor));
        };

        const handleSelectionChange = (range: Range | null) => {
          const selection = toSelection(range);

          if (selection) {
            const lockedSelection = lockedSelectionRef.current;

            if (lockedSelection) {
              if (
                selection.index === lockedSelection.index &&
                selection.length === lockedSelection.length
              ) {
                lockedSelectionRef.current = null;
              } else if (selection.index === 0 && selection.length === 0) {
                return;
              } else {
                lockedSelectionRef.current = null;
              }
            }

            selectionRef.current = selection;
          }
        };

        editor.on("text-change", handleTextChange);
        editor.on("selection-change", handleSelectionChange);
        removeListeners = () => {
          editor.off("text-change", handleTextChange);
          editor.off("selection-change", handleSelectionChange);
        };

        if (selectionRef.current) {
          editor.focus();
          editor.setSelection(
            selectionRef.current.index,
            selectionRef.current.length,
            "api",
          );
        }

        setReady(true);
      }

      void loadEditor();

      return () => {
        disposed = true;
        removeListeners?.();
        quillRef.current = null;
        toolbarElement?.remove();
        if (editorElement) {
          editorElement.innerHTML = "";
          editorElement.className = "";
        }
      };
    }, [id, labelledBy]);

    return (
      <div data-test-id="rich-text-editor" className="formatted-content">
        <div ref={editorRef} data-loading={ready ? undefined : "true"} />
      </div>
    );
  },
);
