/**
 * @file This file contains helper functions that for the Devvit scheduler.
 */

import {Data, Scheduler} from "@devvit/public-api";

/**
 * This function lets you start a job that should only have one instance running at a time. It will cancel any existing instances of the job before starting a new one.
 * @param scheduler An instance of the Scheduler object, such as context.scheduler from inside most Devvit event handlers.
 * @param jobName The name of the job to start.
 * @param cronSchedule The cron schedule to use for the job. Use https://crontab.guru/ to generate/validate a cron schedule if you're not familiar with cron.
 * @param data The data to pass to the job, it can be any object.
 * @returns The ID of the job that was started.
 */
export async function startSingletonJob (scheduler: Scheduler, jobName: string, cronSchedule: string, data?: Data): Promise<string> {
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
