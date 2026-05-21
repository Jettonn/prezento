<script setup lang="ts">
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";

type CursorInfo = {
  line: number;
  col: number;
  words: number;
};

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "cursor", info: CursorInfo): void;
}>();

const container = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

const highlight = HighlightStyle.define([
  { tag: tags.heading1, color: "var(--color-primary)", fontWeight: "600" },
  { tag: tags.heading2, color: "var(--color-primary)", fontWeight: "600" },
  { tag: tags.heading3, color: "var(--color-text)", fontWeight: "600" },
  { tag: tags.heading4, color: "var(--color-text)", fontWeight: "600" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "600" },
  { tag: tags.quote, color: "var(--color-text-secondary)" },
  { tag: tags.link, color: "var(--color-primary)", textDecoration: "underline" },
  { tag: tags.url, color: "var(--color-primary)" },
  { tag: tags.monospace, color: "var(--color-text-secondary)" },
  { tag: tags.processingInstruction, color: "var(--color-text-secondary)" },
  { tag: tags.list, color: "var(--color-primary)" },
]);

const theme = EditorView.theme({
  "&": {
    fontSize: "13px",
    height: "100%",
    color: "var(--color-text)",
    background: "var(--color-surface)",
  },
  ".cm-content": {
    fontFamily: "var(--font-mono)",
    padding: "12px 16px",
    caretColor: "var(--color-primary)",
  },
  ".cm-line": { padding: "0 4px" },
  ".cm-cursor": { borderLeftColor: "var(--color-primary)", borderLeftWidth: "2px" },
  ".cm-gutters": {
    background: "transparent",
    border: "none",
    color: "var(--color-text-secondary)",
    paddingRight: "8px",
  },
  ".cm-activeLine": { background: "transparent" },
  ".cm-activeLineGutter": { background: "transparent", color: "var(--color-text)" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground, ::selection": {
    background: "rgba(109, 74, 255, 0.15) !important",
  },
});

const WHITESPACE_RE = /\s+/;

function countWords(s: string): number {
  return s.split(WHITESPACE_RE).filter(Boolean).length;
}

function emitCursor(): void {
  if (!view)
    return;
  const sel = view.state.selection.main;
  const line = view.state.doc.lineAt(sel.head);
  emit("cursor", {
    line: line.number,
    col: sel.head - line.from + 1,
    words: countWords(view.state.doc.toString()),
  });
}

onMounted(() => {
  if (!container.value)
    return;

  view = new EditorView({
    parent: container.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        syntaxHighlighting(highlight),
        theme,
        EditorView.lineWrapping,
        EditorView.updateListener.of((upd) => {
          if (upd.docChanged) {
            emit("update:modelValue", upd.state.doc.toString());
          }
          if (upd.docChanged || upd.selectionSet) {
            emitCursor();
          }
        }),
      ],
    }),
  });

  emitCursor();
});

watch(() => props.modelValue, (value) => {
  if (!view)
    return;
  const current = view.state.doc.toString();
  if (current !== value) {
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    });
  }
});

onUnmounted(() => {
  view?.destroy();
  view = null;
});
</script>

<template>
  <div ref="container" class="h-full w-full overflow-hidden" />
</template>
