import { adminRepository } from "./admin-repository";

export class AdminResolver {
  public adminRepository: any;
  constructor() {
    this.adminRepository = new adminRepository();
  }
   public async adminLoginV1(user_data: any, domain_code: any): Promise<any> {
    return await this.adminRepository.adminLoginV1(user_data, domain_code);
  }
   public async addProductsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.addProductsV1(user_data, token_data, domain_code);
  }
  public async addNewAdminV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.addNewAdminV1(user_data, token_data, domain_code);
  }
  public async forgotPasswordV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.forgotPasswordV1(user_data, token_data, domain_code);
  }
  public async resetPasswordV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.resetPasswordV1(user_data, token_data, domain_code);
  }
  public async listProductsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listProductsV1(user_data, token_data, domain_code);
  }
  public async allProductDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.allProductDataV1(user_data, token_data, domain_code);
  }
  public async visibleAccessV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.visibleAccessV1(user_data, token_data, domain_code);
  }
  public async updateProductV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.updateProductV1(user_data, token_data, domain_code);
  }
  public async uploadProductLogoV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.uploadProductLogoV1(user_data, token_data, domain_code);
  }
  public async getProductsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.getProductsV1(user_data, token_data, domain_code);
  }
  public async editAdminV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.editAdminV1(user_data, token_data, domain_code);
  }
  public async listAdminV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listAdminV1(user_data, token_data, domain_code);
  }
  public async deleteAdminV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteAdminV1(user_data, token_data, domain_code);
  }
  public async getAdminV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.getAdminV1(user_data, token_data, domain_code);
  }
  public async productDropdownV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.productDropdownV1(user_data, token_data, domain_code);
  }
}