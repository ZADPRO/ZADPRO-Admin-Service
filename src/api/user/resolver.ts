import { UserRepository } from "./user-Repository";

export class UserResolver {
  public UserRepository: any;
  constructor() {
    this.UserRepository = new UserRepository();
  }

   public async listBlogsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.UserRepository.listBlogsV1(user_data, token_data, domain_code);
  }
   public async listReviewsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.UserRepository.listReviewsV1(user_data, token_data, domain_code);
  }
   public async listAchievementsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.UserRepository.listAchievementsV1(user_data, token_data, domain_code);
  }
   public async listReleaseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.UserRepository.listReleaseV1(user_data, token_data, domain_code);
  }
   public async ourProductsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.UserRepository.ourProductsV1(user_data, token_data, domain_code);
  }
 
}