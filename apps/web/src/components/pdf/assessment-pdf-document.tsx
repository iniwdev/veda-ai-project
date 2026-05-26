import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#111827",
    paddingBottom: 6,
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 2,
    color: "#111827",
  },
  subjectText: {
    fontSize: 11,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 2,
    color: "#1F2937",
  },
  classText: {
    fontSize: 10,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 6,
    color: "#374151",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 9,
    fontWeight: 700,
    color: "#111827",
  },
  instructionsBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
  },
  instructionTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 5,
    color: "#111827",
  },
  instructionItem: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 3,
  },
  studentInfoArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  studentInfoField: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  studentInfoLabel: {
    fontSize: 10,
    fontWeight: 700,
    marginRight: 5,
    color: "#1F2937",
  },
  studentInfoLineLg: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 100,
  },
  studentInfoLineSm: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 50,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
    textTransform: "uppercase",
  },
  sectionInstruction: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#4B5563",
    marginTop: 4,
  },
  questionRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  questionNumber: {
    width: 18,
    fontSize: 9,
    fontWeight: 700,
    color: "#111827",
  },
  questionContent: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  questionText: {
    fontSize: 9,
    color: "#111827",
    lineHeight: 1.2,
  },
  difficultyText: {
    fontSize: 7,
    color: "#4B5563",
    marginLeft: 4,
  },
  marksText: {
    fontSize: 8,
    fontWeight: 700,
    color: "#111827",
    marginLeft: 6,
  },
  footer: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 7,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Answer Key Styles
  answerKeyTitle: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 20,
    color: "#111827",
    letterSpacing: 1,
  },
  answerBox: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  answerQNum: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
    color: "#111827",
  },
  answerTextLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#065F46", // Dark green
    marginBottom: 2,
  },
  answerText: {
    fontSize: 10,
    color: "#111827",
    marginBottom: 8,
  },
  solutionTextLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#4B5563",
    marginBottom: 2,
  },
  solutionText: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.4,
  },
});

interface AssessmentPDFDocumentProps {
  assignment: any;
  paper: any;
}

export function AssessmentPDFDocument({ assignment, paper }: AssessmentPDFDocumentProps) {
  let currentQuestionIndex = 1;
  let calculatedMarks = 0;
  const flatQuestions: Array<{ qNum: number; answer: string; solution: string }> = [];

  paper?.sections?.forEach((section: any) => {
    section.questions?.forEach((q: any) => {
      calculatedMarks += q.marks || 0;
      flatQuestions.push({
        qNum: currentQuestionIndex++,
        answer: q.answer || "",
        solution: q.solution || "",
      });
    });
  });

  // Use AI-inferred metadata & dynamically calculated total marks
  const meta = paper?.metadata || {};
  const schoolName = meta.schoolName || "DELHI PUBLIC SCHOOL";
  const subjectName = meta.subject || "General";
  const className = meta.className || "Class 10";
  const examTitle = meta.examTitle || "HALF YEARLY EXAMINATION";
  const timeAllowed = meta.timeAllowed || "2 Hours";
  const totalMarks = calculatedMarks > 0 ? calculatedMarks : (meta.totalMarks || assignment?.totalMarks || 100);

  // Reset for actual rendering
  currentQuestionIndex = 1;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Area */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>{schoolName}</Text>
          <Text style={styles.subjectText}>{examTitle}</Text>
          <Text style={styles.classText}>Subject: {subjectName} | {className.startsWith("Class") ? className : `Class ${className}`}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Time Allowed: {timeAllowed}</Text>
            <Text style={styles.metaText}>Maximum Marks: {totalMarks}</Text>
          </View>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionTitle}>General Instructions:</Text>
            <Text style={styles.instructionItem}>• All questions are compulsory.</Text>
            <Text style={styles.instructionItem}>• Read all questions carefully before answering.</Text>
            <Text style={styles.instructionItem}>• Write neatly and legibly.</Text>
            {assignment?.instructions && (
              <Text style={styles.instructionItem}>• {assignment.instructions}</Text>
            )}
          </View>

          <View style={styles.studentInfoArea}>
            <View style={styles.studentInfoField}>
              <Text style={styles.studentInfoLabel}>Name:</Text>
              <View style={styles.studentInfoLineLg} />
            </View>
            <View style={styles.studentInfoField}>
              <Text style={styles.studentInfoLabel}>Roll No:</Text>
              <View style={styles.studentInfoLineSm} />
            </View>
            <View style={styles.studentInfoField}>
              <Text style={styles.studentInfoLabel}>Section:</Text>
              <View style={styles.studentInfoLineSm} />
            </View>
          </View>
        </View>

        {/* Sections Area */}
        {paper?.sections.map((section: any, idx: number) => {
          return (
            <View key={idx} style={styles.section} wrap={false}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {section.title}
                </Text>
                {section.instruction && (
                  <Text style={styles.sectionInstruction}>
                    Instruction: {section.instruction}
                  </Text>
                )}
              </View>

              {section.questions.map((q: any, qIdx: number) => {
                return (
                  <View key={qIdx} style={styles.questionRow} wrap={false}>
                    <Text style={styles.questionNumber}>Q{currentQuestionIndex++}.</Text>
                    <View style={styles.questionContent}>
                      <Text style={styles.questionText}>
                        {q.question}
                        <Text style={styles.difficultyText}> ({q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)})</Text>
                      </Text>
                    </View>
                    <Text style={styles.marksText}>
                      [{q.marks}]
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          — End of Paper —
        </Text>
      </Page>

      {/* Answer Key Page(s) */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.answerKeyTitle}>ANSWER KEY & SOLUTIONS</Text>
        
        {flatQuestions.map((fq) => (
          <View key={fq.qNum} style={styles.answerBox} wrap={false}>
            <Text style={styles.answerQNum}>Question {fq.qNum}</Text>
            
            <Text style={styles.answerTextLabel}>Correct Answer:</Text>
            <Text style={styles.answerText}>{fq.answer}</Text>
            
            <Text style={styles.solutionTextLabel}>Solution / Explanation:</Text>
            <Text style={styles.solutionText}>{fq.solution}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
