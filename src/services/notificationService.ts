import { NotificationRepository } from '../repositories/notificationRepository';
const notificationRepo = new NotificationRepository();

export class NotificationService {
  getUserNotifications(userId: string) {
    return notificationRepo.getUserNotifications(userId);
  }

  saveOrUpdatePreference(pref: any) {
    return notificationRepo.saveOrUpdateCategory(pref);
  }

  getUserKeywords(userId: string) {
    return notificationRepo.getUserKeywords(userId);
  }

  addKeyword(userId: string, keyword: string) {
    return notificationRepo.addKeyword(userId, keyword);
  }

  async updateKeywordStatus(userId: string, keyword: string, isEnabled: boolean): Promise<boolean> {
    try {
      return await notificationRepo.updateKeywordStatus(userId, keyword, isEnabled);
    } catch (error) {
      console.error('Error updating keyword status in service:', error);
      return false;
    }
  }

}