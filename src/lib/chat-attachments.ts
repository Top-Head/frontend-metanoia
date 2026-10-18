export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

export const ACCEPTED_TYPES = [
  "application/pdf",
  "application/zip",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
  "image/png",
  "image/jpeg",
  "image/webp",
];

// O Windows às vezes não preenche file.type (ex.: .csv, .zip).
const ACCEPTED_EXTENSIONS = [
  ".pdf", ".zip", ".doc", ".xls", ".ppt", ".docx", ".xlsx", ".pptx",
  ".txt", ".csv", ".json", ".png", ".jpg", ".jpeg", ".webp",
];

export const ACCEPT_ATTRIBUTE = [...ACCEPTED_TYPES, ...ACCEPTED_EXTENSIONS].join(",");

function isAccepted(file: File) {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

/** Junta os ficheiros novos aos atuais e devolve o primeiro erro de validação. */
export function addFiles(current: File[], incoming: File[]) {
  const files = [...current];
  for (const file of incoming) {
    if (!isAccepted(file)) {
      return { files: current, error: `"${file.name}" não é um tipo de ficheiro aceite.` };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { files: current, error: `"${file.name}" ultrapassa 25 MB.` };
    }
    files.push(file);
  }
  if (files.length > MAX_FILES) {
    return { files: current, error: `Pode anexar no máximo ${MAX_FILES} ficheiros.` };
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return { files: current, error: "Os anexos ultrapassam 50 MB no total." };
  }
  return { files, error: null };
}

export function isImageType(contentType: string) {
  return ["image/png", "image/jpeg", "image/webp"].includes(contentType);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
