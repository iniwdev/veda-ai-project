import { DifficultyBadge } from "./difficulty-badge";

interface QuestionItemProps {
  index: number;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
}

export function QuestionItem({ index, question, difficulty, marks }: QuestionItemProps) {
  return (
    <div className="flex items-start gap-4 py-3 group hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors">
      <div className="flex-shrink-0 w-6 text-right font-medium text-gray-900 mt-0.5">
        Q{index}.
      </div>
      <div className="flex-1">
        <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
          {question}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <DifficultyBadge difficulty={difficulty} />
        </div>
      </div>
      <div className="flex-shrink-0 text-[12px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
        [{marks} {marks === 1 ? "Mark" : "Marks"}]
      </div>
    </div>
  );
}
