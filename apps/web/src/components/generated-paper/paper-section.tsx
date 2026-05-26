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
    <div className="mb-10 last:mb-0">
      <div className="border-b-2 border-gray-900 pb-3 mb-5">
        <h2 className="text-[16px] font-bold text-gray-900 uppercase tracking-wide">
          Section {sectionLabel}: {title}
        </h2>
        {instruction && (
          <p className="text-[13px] text-gray-600 mt-2 font-medium italic">
            Instruction: {instruction}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
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
