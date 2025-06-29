import * as fs from 'fs';
import * as path from 'path';

/**
 * Parses VTT content into a single-line transcript string.
 * Format: "HH:MM:SS Dialogue... HH:MM:SS More dialogue..."
 */
const parseVttContent = (vttContent: string): string => {
  const lines = vttContent.split(/\r?\n/);
  const segments: string[] = [];
  let currentText = '';
  let currentTime = '';

  for (const line of lines) {
    if (line.includes('-->')) {
      // When we find a new timestamp, save the previous segment
      if (currentTime && currentText) {
        segments.push(`${currentTime} ${currentText.trim()}`);
      }
      // Start a new segment
      currentTime = line.split(' ')[0].substring(0, 8); // Format to HH:MM:SS
      currentText = '';
    } else if (line.trim() && !line.startsWith('WEBVTT')) {
      // Append dialogue to the current segment
      currentText += ` ${line.trim()}`;
    }
  }
  // Add the final segment
  if (currentTime && currentText) {
    segments.push(`${currentTime} ${currentText.trim()}`);
  }

  return segments.join(' ');
};


/**
 * Reads a transcript file (.vtt or .txt) and returns its content as a single string.
 * VTT files are parsed to include timestamps in the string.
 * @param filePath The absolute path to the transcript file.
 * @returns A promise that resolves to the formatted transcript string.
 */
export const readTranscriptFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(new Error(`Failed to read file at ${filePath}: ${err.message}`));
      }

      const extension = path.extname(filePath).toLowerCase();

      if (extension === '.vtt') {
        resolve(parseVttContent(data));
      } else if (extension === '.txt') {
        // Note: .txt files from Whisper often lack timestamps, which may reduce the quality of the clips.
        resolve(data);
      } else {
        reject(new Error('Unsupported file type. Please use .vtt or .txt files.'));
      }
    });
  });
}; 