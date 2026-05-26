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
    padding: 50,
    fontFamily: "Inter",
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
    color: "#111827",
    letterSpacing: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 10,
    color: "#4B5563",
  },
  studentInfoArea: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  studentInfoField: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  studentInfoLabel: {
    fontSize: 10,
    fontWeight: 600,
    marginRight: 5,
    color: "#1F2937",
  },
  studentInfoLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 150,
  },
  studentInfoLineSmall: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
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
    marginBottom: 12,
    alignItems: "flex-start",
  },
  questionNumber: {
    width: 25,
    fontSize: 10,
    fontWeight: 600,
    color: "#111827",
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 10,
    color: "#1F2937",
    lineHeight: 1.4,
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    borderWidth: 1,
  },
  badgeEasy: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    borderColor: "#BBF7D0",
  },
  badgeMedium: {
    backgroundColor: "#FEF3C7",
    color: "#B45309",
    borderColor: "#FDE68A",
  },
  badgeHard: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    borderColor: "#FECACA",
  },
  marksBadge: {
    fontSize: 8,
    fontWeight: 600,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 8,
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

interface AssessmentPDFDocumentProps {
  assignment: any;
  paper: any;
}

export function AssessmentPDFDocument({ assignment, paper }: AssessmentPDFDocumentProps) {
  let currentQuestionIndex = 1;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Area */}
        <View style={styles.header}>
          <Text style={styles.title}>{assignment?.title || "Assessment"}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Total Marks: ________</Text>
            <Text style={styles.metaText}>Time Allowed: ________</Text>
          </View>

          <View style={styles.studentInfoArea}>
            <View style={styles.studentInfoField}>
              <Text style={styles.studentInfoLabel}>Student Name:</Text>
              <View style={styles.studentInfoLine} />
            </View>
            <View style={styles.studentInfoField}>
              <Text style={styles.studentInfoLabel}>Date:</Text>
              <View style={styles.studentInfoLineSmall} />
            </View>
          </View>
        </View>

        {/* Sections Area */}
        {paper?.sections.map((section: any, idx: number) => {
          const sectionLabel = String.fromCharCode(65 + idx);
          
          return (
            <View key={idx} style={styles.section} wrap={false}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Section {sectionLabel}: {section.title}
                </Text>
                {section.instruction && (
                  <Text style={styles.sectionInstruction}>
                    Instruction: {section.instruction}
                  </Text>
                )}
              </View>

              {section.questions.map((q: any, qIdx: number) => {
                const badgeStyle =
                  q.difficulty === "easy"
                    ? styles.badgeEasy
                    : q.difficulty === "medium"
                    ? styles.badgeMedium
                    : styles.badgeHard;

                return (
                  <View key={qIdx} style={styles.questionRow} wrap={false}>
                    <Text style={styles.questionNumber}>Q{currentQuestionIndex++}.</Text>
                    <View style={styles.questionContent}>
                      <Text style={styles.questionText}>{q.question}</Text>
                      <View style={styles.badgesRow}>
                        <Text style={[styles.badge, badgeStyle]}>
                          {q.difficulty}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.marksBadge}>
                      [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
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
    </Document>
  );
}
