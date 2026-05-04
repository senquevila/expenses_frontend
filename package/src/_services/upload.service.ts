import apiClient from "@/_libs/api/client";
import {
  Upload,
  CreateUploadRequest,
  UploadSchema,
} from "@/_models/upload.model";

export interface UploadPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Upload[];
}

export const uploadService = {
  async getPage(page = 1): Promise<UploadPage> {
    const response = await apiClient.get("uploads/", { params: { page } });
    const raw = response.data;
    return {
      count: raw.count ?? 0,
      next: raw.next ?? null,
      previous: raw.previous ?? null,
      results: raw.results ?? [],
    };
  },

  async create(data: CreateUploadRequest): Promise<Upload> {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.account_id) formData.append("account_id", String(data.account_id));
    if (data.row_start) formData.append("row_start", String(data.row_start));
    if (data.row_end) formData.append("row_end", String(data.row_end));
    if (data.start_date) formData.append("start_date", data.start_date);
    if (data.end_date) formData.append("end_date", data.end_date);

    const response = await apiClient.post("uploads/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return UploadSchema.parse(response.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`uploads/${id}/`);
  },
};
