/**
 * @file This file contains helper functions that for the Devvit Redis client.
 */

import {RedisFieldValue} from "@devvit/protos";
import {RedisClient, ZMember, ZRangeOptions} from "@devvit/public-api";
import { differenceInSeconds } from "date-fns";
import { chunk } from "lodash";

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

/**
 * Retrieves multiple fields from a Redis hash and returns them as a record/object.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The key of the hash.
 * @param fields The fields to retrieve values for
 * @returns  {Record<string, string>} An object with field-value pairs for the specified fields.
 */
export async function hMGetAsRecord (redis: RedisClient, key: string, fields: string[]): Promise<Record<string, string>> {
    if (fields.length === 0) {
        return {};
    }

    const results: Record<string, string> = {};

    const values = await redis.hMGet(key, fields);

    fields.forEach((field, index) => {
        if (values[index] !== null) {
            results[field] = values[index];
        }
    });

    return results;
}

/**
 * Get all entries from a hash in Redis, chunking the requests if necessary to avoid exceeding Devvit's limitations on response size.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The key of the hash.
 * @param chunkSize The size of each chunk.
 * @returns {Record<string, string>} An object with field-value pairs for the specified fields.
 */
export async function hMGetAllChunked (redis: RedisClient, key: string, chunkSize = 5000): Promise<Record<string, string>> {
    const fields = await redis.hKeys(key);
    if (fields.length === 0) {
        return {};
    }

    const results = await Promise.all(chunk(fields, chunkSize).map(c => hMGetAsRecord(redis, key, c)));

    return Object.assign({}, ...results) as Record<string, string>;
}

/**
 * Returns a range of members from a sorted set in Redis as a record/object, where the keys are the members and the values are their scores.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The key of the sorted set.
 * @param start The starting index (inclusive) of the range.
 * @param stop The ending index (exclusive) of the range.
 * @param options Optional parameters for the zRange command.
 * @returns {Record<string, number>} A record/object with members and their scores.
 */
export async function zRangeAsRecord (redis: RedisClient, key: string, start: number | string, stop: number | string, options?: ZRangeOptions): Promise<Record<string, number>> {
    const results: Record<string, number> = {};
    const items = await redis.zRange(key, start, stop, options);

    items.forEach((item) => {
        results[item.member] = item.score;
    });

    return results;
}

/**
 * Sets an expiration time on a Redis key based on a Date object.
 * @param {RedisClient} redis An instance of Devvit's Redis client.
 * @param key The redis key.
 * @param expireAt The expiration date.
 */
export async function expireKeyAt (redis: RedisClient, key: string, expireAt: Date) {
    const secondsUntil = differenceInSeconds(expireAt, new Date());
    if (secondsUntil > 0) {
        await redis.expire(key, secondsUntil);
    } else {
        throw new Error(`Expire time ${expireAt.toISOString()} is in the past`);
    }
}
