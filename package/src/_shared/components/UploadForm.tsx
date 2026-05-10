"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Step1Upload } from "@/_models/upload.model";
import { uploadService } from "@/_services/upload.service";
import UploadStepUpload from "./upload/UploadStepUpload";
import UploadStepTransform, { ColumnMap } from "./upload/UploadStepTransform";
import UploadStepProcess from "./upload/UploadStepProcess";

const STEPS = ["Upload", "Transform", "Process"] as const;
type Step = 0 | 1 | 2;

interface UploadFormProps {
  onCancel?: () => void;
}

function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (error) => reject(error),
    });
  });
}

export default function UploadForm({ onCancel }: UploadFormProps) {
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [uploadResult, setUploadResult] = useState<Step1Upload | null>(null);
  const [parsedRows, setParsedRows] = useState<string[][]>([]);

  const [rowStart, setRowStart] = useState(0);
  const [rowEnd, setRowEnd] = useState(0);
  const [columnMap, setColumnMap] = useState<ColumnMap>({
    uploadType: "credit_card",
    date: 1,
    description: 2,
    local: 3,
    usd: 4,
  });

  const handleStepOneNext = async () => {
    if (!file) {
      setFileError("Please select a file.");
      return;
    }
    setFileError("");
    setLoading(true);
    try {
      const [upload, rows] = await Promise.all([
        uploadService.step1(file),
        parseCSV(file),
      ]);
      setUploadResult(upload);
      setParsedRows(rows);
      setRowEnd(rows.length - 1);
      setStep(1);
    } catch (e) {
      console.error("Step 1 failed:", e);
      setFileError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepTwoNext = async () => {
    if (!uploadResult) return;
    setLoading(true);
    try {
      const dataRows = parsedRows.slice(rowStart, rowEnd + 1);
      const result =
        columnMap.uploadType === "credit_card"
          ? dataRows.map((row, i) => ({
              row_number: rowStart + i,
              date: row[columnMap.date - 1] ?? "",
              description: row[columnMap.description - 1] ?? "",
              local: {
                amount: row[columnMap.local - 1] ?? "",
                currency: "HNL",
              },
              usd: { amount: row[columnMap.usd - 1] ?? "", currency: "USD" },
            }))
          : dataRows.map((row, i) => ({
              row_number: rowStart + i,
              date: row[columnMap.date - 1] ?? "",
              description: row[columnMap.description - 1] ?? "",
              debit: {
                amount: row[columnMap.debit - 1] ?? "",
                currency: columnMap.currency,
              },
              credit: {
                amount: row[columnMap.credit - 1] ?? "",
                currency: columnMap.currency,
              },
            }));
      await uploadService.step2(uploadResult.id, result);
      setStep(2);
    } catch (e) {
      console.error("Step 2 failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      handleStepOneNext();
      return;
    }
    if (step === 1) {
      handleStepTwoNext();
      return;
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => setStep((s) => (s - 1) as Step);

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <nav className="flex items-center">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-sm font-medium border-2 transition-colors ${
                    done
                      ? "bg-zinc-900 border-zinc-900 text-white"
                      : active
                        ? "border-zinc-900 text-zinc-900"
                        : "border-zinc-300 text-zinc-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    active
                      ? "text-zinc-900"
                      : done
                        ? "text-zinc-600"
                        : "text-zinc-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-3 h-px w-8 ${i < step ? "bg-zinc-900" : "bg-zinc-200"}`}
                />
              )}
            </div>
          );
        })}
      </nav>

      {step === 0 && (
        <UploadStepUpload
          file={file}
          fileError={fileError}
          onFileChange={(f) => {
            setFile(f);
            setFileError("");
          }}
        />
      )}

      {step === 1 && (
        <UploadStepTransform
          rows={parsedRows}
          fileName={file?.name ?? null}
          rowStart={rowStart}
          rowEnd={rowEnd}
          columnMap={columnMap}
          onRowStartChange={setRowStart}
          onRowEndChange={setRowEnd}
          onColumnMapChange={setColumnMap}
        />
      )}

      {step === 2 && uploadResult && (
        <UploadStepProcess uploadId={uploadResult.id} />
      )}

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={step === 0 ? onCancel : handleBack}
          disabled={loading}
          className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md hover:bg-zinc-300 transition-colors disabled:opacity-50"
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Next"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
