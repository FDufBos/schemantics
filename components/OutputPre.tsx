// The rendered json output

interface Field {
  type: string;
  label: {
    en: string;
  };
  fields?: Record<string, unknown>;
}

interface OutputProps {
  output: {
    type: string;
    slug: string;
    name: string;
    path: string;
    config: {
      fields: Map<string, Field>;
    };
  };
}

export const OutputPre = ({ output }: OutputProps) => (
  <pre>
    {JSON.stringify(
      {
        ...output,
        config: {
          ...output.config,
          fields: Object.fromEntries(output.config.fields),
        },
      },
      null,
      2
    )}
  </pre>
);
