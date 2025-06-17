export interface Meaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    synonyms?: string[];
  }[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: Meaning[];
}

export const fetchDictionaryData = async (word: string): Promise<DictionaryEntry[] | null> => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data as DictionaryEntry[];
    }
    return null;
  } catch (error) {
    console.error("Fetch dictionary error:", error);
    return null;
  }
};
