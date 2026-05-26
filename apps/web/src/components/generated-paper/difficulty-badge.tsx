export function DifficultyBadge({ difficulty }: { difficulty: "easy" | "medium" | "hard" }) {
  const colors = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${colors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
