/**
 * @file This file contains helper functions that for the Devvit scheduler.
 */

import {Scheduler} from "@devvit/public-api";

export async function startSingletonJob (scheduler: Scheduler, jobName: string, cronSchedule: string, data: Record<string, unknown>): Promise<string> {
    // Cancel existing instances of the job.
    const currentJobs = await scheduler.listJobs();
    for (const job of currentJobs) {
        if (job.name === jobName) {
            await scheduler.cancelJob(job.id);
        }
    }

    // Schedule the job.
    return scheduler.runJob({name: jobName, cron: cronSchedule, data});
}
