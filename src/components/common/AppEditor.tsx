import type { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

interface Props {
  props: Block[];
  setContent: (content: Block[]) => void;
}

const AppEditor = ({ props, setContent }: Props) => {
  const locale = ko;
  const editor = useCreateBlockNote({
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        emptyDocument: "텍스트를 입력하거나 '/'를 눌러 명령어를 입력하세요.",
      },
    },
  });

  useEffect(() => {
    if (props && props.length > 0) {
      const current = JSON.stringify(editor.document);
      const next = JSON.stringify(props);

      if (current !== next) {
        editor.replaceBlocks(editor.document, props);
      }
    }
  }, [props, editor]);

  return <BlockNoteView editor={editor} onChange={() => setContent(editor.document)} />;
};

export { AppEditor };
