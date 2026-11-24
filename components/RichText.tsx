import { TinaMarkdown } from "tinacms/dist/rich-text";

/* Texto rico do Tina: links externos abrem em nova aba. */
const components = {
  a: (props: any) => {
    const externo = /^https?:\/\//.test(props?.url || "");
    return (
      <a href={props?.url} {...(externo ? { target: "_blank", rel: "noopener" } : {})}>
        {props?.children}
      </a>
    );
  },
};

export default function RichText({ content }: { content: any }) {
  if (!content) return null;
  return <TinaMarkdown content={content} components={components} />;
}
