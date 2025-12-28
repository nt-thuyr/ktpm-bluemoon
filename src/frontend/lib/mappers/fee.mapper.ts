import { FeeApi } from "../types/api/fee.api";
import { Fee } from "../types/models/fee";
//api to model
export const mapFeeApiToModel = (dto: FeeApi): Fee => ({
  id: dto.Id,
  tenKhoanThu: dto.TenKhoanThu,
  soTien: dto.SoTien,
  isBatBuoc: dto.BatBuoc,
  ghiChu: dto.GhiChu ?? undefined,
  hanNop: dto.HanNop ? new Date(dto.HanNop) : undefined,
});

// model to api
export const mapModelToFeeApi = (model: Fee): FeeApi => ({
  Id: model.id,
  TenKhoanThu: model.tenKhoanThu,
  SoTien: model.soTien,
  BatBuoc: model.isBatBuoc,
  GhiChu: model.ghiChu ?? undefined,
  HanNop: model.hanNop ? new Date(model.hanNop).toISOString() : null,
});

// create khoản thu mới để BE tự sinh Id
// model to api
export type CreateFeePayload = Omit<FeeApi, "Id">;
export const mapFeeModelToCreatePayload = (
  model: Omit<Fee, "id">
): CreateFeePayload => ({
  TenKhoanThu: model.tenKhoanThu,
  SoTien: model.soTien,
  BatBuoc: model.isBatBuoc,
  GhiChu: model.ghiChu ?? null,
  HanNop: model.hanNop ? new Date(model.hanNop).toISOString() : null,
});
