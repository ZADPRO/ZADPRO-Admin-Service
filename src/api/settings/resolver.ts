import { settingRepository } from "./settings-repository";

export class SettingsResolver {
  public settingRepository: any;
  constructor() {
    this.settingRepository = new settingRepository();
  }

  public async addBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.addBlogsV1(user_data, token_data, domain_code);
  }
  public async uploadBlogImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.uploadBlogImageV1(user_data, token_data, domain_code);
  }
  public async deleteBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.deleteBlogsV1(user_data, token_data, domain_code);
  }
  public async updateBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.updateBlogsV1(user_data, token_data, domain_code);
  }
  public async listBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.listBlogsV1(user_data, token_data, domain_code);
  }
  public async addAchievementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.addAchievementsV1(user_data, token_data, domain_code);
  }
  public async updateAchievementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.updateAchievementsV1(user_data, token_data, domain_code);
  }
  public async deleteAchievementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.deleteAchievementsV1(user_data, token_data, domain_code);
  }
  public async listAchievementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.listAchievementsV1(user_data, token_data, domain_code);
  }
  public async addReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.addReleaseV1(user_data, token_data, domain_code);
  }
  public async updateReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.updateReleaseV1(user_data, token_data, domain_code);
  }
  public async deleteReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.deleteReleaseV1(user_data, token_data, domain_code);
  }
  public async listReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.listReleaseV1(user_data, token_data, domain_code);
  }
  public async addReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.addReviewsV1(user_data, token_data, domain_code);
  }
  public async updateReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.updateReviewsV1(user_data, token_data, domain_code);
  }
  public async deleteReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.deleteReviewsV1(user_data, token_data, domain_code);
  }
  public async listReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.listReviewsV1(user_data, token_data, domain_code);
  }
  public async getBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.getBlogsV1(user_data, token_data, domain_code);
  }
  public async getReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.getReviewsV1(user_data, token_data, domain_code);
  }
  public async getReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.getReleaseV1(user_data, token_data, domain_code);
  }
  public async getAchivementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingRepository.getAchivementsV1(user_data, token_data, domain_code);
  }
}