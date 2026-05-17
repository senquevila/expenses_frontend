import apiClient from "@/_libs/api/client";
import {
  Association,
  AssociationSchema,
  AssociationsListSchema,
  CreateAssociationRequest,
  UpdateAssociationRequest,
} from "@/_models/association.model";

export const associationService = {
  async getAll(params?: {
    account_id?: number;
    token?: string;
  }): Promise<Association[]> {
    const response = await apiClient.get("associations/", {
      params,
    });
    return AssociationsListSchema.parse(response.data).results;
  },

  async create(data: CreateAssociationRequest): Promise<Association> {
    const response = await apiClient.post("associations/", data);
    return AssociationSchema.parse(response.data);
  },

  async update(
    id: number,
    data: UpdateAssociationRequest,
  ): Promise<Association> {
    const response = await apiClient.put(`associations/${id}/`, data);
    return AssociationSchema.parse(response.data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`associations/${id}/`);
  },
};
