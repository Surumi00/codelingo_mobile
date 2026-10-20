import type {
  DiagnosticAnswer,
  DiagnosticQuestion,
  SubmitDiagnosticRequest,
} from "@/api";

export type DiagnosticAnswers = (number | null)[];

export function createDiagnosticAnswers(
  questionCount: number,
): DiagnosticAnswers {
  return Array.from({ length: questionCount }, () => null);
}

export function getSelectedOption(
  answers: DiagnosticAnswers,
  questionIndex: number,
): number | null {
  const selectedOption = answers[questionIndex];

  return Number.isInteger(selectedOption) ? (selectedOption as number) : null;
}

export function setAnswerAt(
  answers: DiagnosticAnswers,
  questionIndex: number,
  selectedOptionIndex: number,
): DiagnosticAnswers {
  if (questionIndex < 0 || questionIndex >= answers.length) {
    return answers;
  }

  const nextAnswers = [...answers];
  nextAnswers[questionIndex] = selectedOptionIndex;

  return nextAnswers;
}

export function areAllQuestionsAnswered(answers: DiagnosticAnswers): boolean {
  return (
    answers.length > 0 && answers.every((answer) => Number.isInteger(answer))
  );
}

export function getProgressPercentage(
  questionIndex: number,
  totalQuestions: number,
): number {
  if (totalQuestions <= 0) {
    return 0;
  }

  const clampedIndex = Math.min(Math.max(questionIndex, 0), totalQuestions - 1);

  return ((clampedIndex + 1) / totalQuestions) * 100;
}

export function toSubmitDiagnosticRequest(
  questions: DiagnosticQuestion[],
  answers: DiagnosticAnswers,
): SubmitDiagnosticRequest | null {
  if (questions.length === 0 || answers.length !== questions.length) {
    return null;
  }

  const payloadAnswers: DiagnosticAnswer[] = [];

  for (let index = 0; index < questions.length; index += 1) {
    const selectedOptionIndex = getSelectedOption(answers, index);

    if (
      selectedOptionIndex === null ||
      selectedOptionIndex < 0 ||
      selectedOptionIndex >= questions[index].options.length
    ) {
      return null;
    }

    payloadAnswers.push({
      questionId: questions[index].id,
      selectedOptionIndex,
    });
  }

  return { answers: payloadAnswers };
}
