interface QuestionItemProps {
  index: number;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
}

export function QuestionItem({ index, question, difficulty, marks }: QuestionItemProps) {
  return (
    <div className="flex items-start gap-2 py-1 px-1 -mx-1 group hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 w-6 text-right font-semibold text-gray-900 mt-[1px] text-[13px]">
        Q{index}.
      </div>
      <div className="flex-1">
        <p className="text-[13px] text-gray-900 leading-snug">
          {question}
          <span className="text-[12px] text-gray-500 font-medium ml-2">
            ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
          </span>
        </p>
      </div>
      <div className="flex-shrink-0 text-[12px] font-bold text-gray-800">[{marks}]</div>
    </div>
  );
}
