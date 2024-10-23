/**
 * @file This file contains helper functions that for the Devvit Redis client.
 */

import {RedisFieldValue} from "@devvit/protos";
import {RedisClient, ZMember} from "@devvit/public-api";

/**
 * Scans a sorted set in Redis and returns all members that match a given pattern. This function handles partial results and does multiple zScan calls if needed.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The key of the sorted set.
 * @param pattern The pattern to match.
 * @returns {ZMember[]} An array of members that match the pattern.
 */
export async function zScanAll (redis: RedisClient, key: string, pattern: string): Promise<ZMember[]> {
    let cursor = 0;
    const members: Record<string, ZMember> = {};
    while (true) {
        const zScanResult = await redis.zScan(key, cursor, pattern, 1000);
        // Redis scans may return the same member multiple times, so we need to deduplicate them.
        for (const member of zScanResult.members) {
            members[member.member] = member;
        }
        // Return if we reached the end of the scan or if we're stuck in a loop.
        if (zScanResult.cursor === 0 || cursor === zScanResult.cursor) {
            break;
        }
        cursor = zScanResult.cursor;
    }
    return Object.values(members);
}

/**
 * Scans a hash in Redis and returns all fields that match a given pattern. This function handles partial results and does multiple hScan calls if needed.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The key of the hash.
 * @param pattern The pattern to match.
 * @returns {Record<string, string>} An object with fields that match the pattern.
 */
export async function hScanAll (redis: RedisClient, key: string, pattern: string): Promise<RedisFieldValue[]> {
    let cursor = 0;
    const fields: Record<string, RedisFieldValue> = {};
    while (true) {
        const hScanResult = await redis.hScan(key, cursor, pattern, 1000);
        // Redis scans may return the same field multiple times, so we need to deduplicate them.
        for (const field of hScanResult.fieldValues) {
            fields[field.field] = field;
        }
        // Return if we reached the end of the scan or if we're stuck in a loop.
        if (hScanResult.cursor === 0 || cursor === hScanResult.cursor) {
            break;
        }
        cursor = hScanResult.cursor;
    }
    return Object.values(fields);
}
