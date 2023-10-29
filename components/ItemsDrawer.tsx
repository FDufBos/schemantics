// The drawer at the bottom of the screen.
// When a user clicks a button here it gets added to the list

interface FooterSectionProps {
  onItemAdd: (item: string) => void;
}

export const FooterSection = ({ onItemAdd }: FooterSectionProps) => (
  <section className="fixed bottom-0 left-0 flex items-center justify-center w-full h-24 gap-8 text-gray-500 border-t rounded-t-xl border-slate-100 bg-gray-400/20 backdrop-blur-lg">
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("string")}
    >
      STRING
    </div>
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("text")}
    >
      TEXT
    </div>
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("wysiwyg")}
    >
      WYSIWYG
    </div>
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("url")}
    >
      URL
    </div>
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("image")}
    >
      IMAGE
    </div>
    <div
      className="cursor-pointer select-none"
      onClick={() => onItemAdd("list")}
    >
      LIST
    </div>
  </section>
);
