import { QuestionItem } from "./question-item";

interface PaperSectionProps {
  sectionIndex: number;
  title: string;
  instruction: string;
  questions: any[];
  startIndex: number;
}

export function PaperSection({ sectionIndex, title, instruction, questions, startIndex }: PaperSectionProps) {
  const sectionLabel = String.fromCharCode(65 + sectionIndex); // A, B, C...

  return (
    <div className="mb-6 last:mb-0">
      <div className="border-b border-gray-900 pb-1 mb-3">
        <h2 className="text-[15px] font-bold text-gray-900 uppercase">
          Section {sectionLabel}: {title}
        </h2>
        {instruction && (
          <p className="text-[12px] text-gray-700 mt-1 italic font-medium">
            {instruction}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {questions.map((q, idx) => (
          <QuestionItem
            key={idx}
            index={startIndex + idx}
            question={q.question}
            difficulty={q.difficulty}
            marks={q.marks}
          />
        ))}
      </div>
    </div>
  );
}
