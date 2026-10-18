import { client } from "./client";

export type SyllabusConcept = {
  id: string;
  title: string;
  description: string;
  conceptSlug: string;
};

export type SyllabusTopic = {
  id: string;
  title: string;
  blurb: string;
  concepts: SyllabusConcept[];
};

export type SyllabusLevel = {
  id: string;
  title: string;
  description: string;
  topics: SyllabusTopic[];
};

export type GetSyllabusResponse = {
  data: SyllabusLevel[];
};

export async function getSyllabus(): Promise<SyllabusLevel[]> {
  const { data } = await client.get<GetSyllabusResponse>("/api/syllabus");

  return data.data;
}
