import { ActivityType } from "../../generated/prisma/enums.ts";
import ActivityRepository from "./activities.repository.ts";

/**
 * Thin wrapper the issue/comment services call into to record a timeline
 * entry. Kept as its own module (rather than baked into issues.service)
 * so the activity feed stays a single source of truth as more resources
 * start emitting events into it.
 */
class ActivityService {
  private activityRepository: ActivityRepository;

  constructor(activityRepository: ActivityRepository = new ActivityRepository()) {
    this.activityRepository = activityRepository;
  }

  async log(
    issueId: string,
    userId: string,
    type: ActivityType,
    metadata?: Record<string, unknown> | null,
  ) {
    // Activity logging is best-effort context, not critical business data:
    // never let a logging failure fail the request that triggered it.
    try {
      await this.activityRepository.create({ issueId, userId, type, metadata });
    } catch (err) {
      console.error("Failed to record activity", { issueId, type, err });
    }
  }

  async getForIssue(issueId: string) {
    return await this.activityRepository.findByIssue(issueId);
  }
}

export default ActivityService;
