import {de, enUS} from "date-fns/locale";
import {getLocaleFromString, getTimeDeltaInSeconds, isValidDate, safeFormatInTimeZone} from "../src/helpers/date.js";

// Date object, timeformat, expected output.
test.each([
    [new Date(""), "", "UTC", enUS, ""], // Invalid date with missing timeformat should return empty string.
    [new Date(""), "yyyy-MM-dd HH-mm-ss", "UTC", enUS, ""], // Invalid date with valid timeformat should return empty string.
    [new Date("2021-01-01T00:00:00.000Z"), "", "UTC", enUS, ""], // Valid date with missing timeformat should return empty string.
    [new Date(1494634269000), "", "UTC", enUS, ""], // Timestamp with missing timeformat should return empty string.
    [new Date(1494634269000), "yyyy-MM-dd HH-mm-ss", "UTC", enUS, "2017-05-13 00-11-09"], // Timestamp with valid timeformat should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "UTC", enUS, "2017-05-13 00-11-09"], // Valid known date with valid timeformat should return known string.
    [new Date("2023-06-09T17:44:13.123Z"), "yyyy/'W'w hh-mm-ssa", "UTC", enUS, "2023/W23 05-44-13PM"], // Valid known date with valid timeformat should return known string.
    [new Date("2023-06-09T17:44:13.123Z"), "yyyy/'Q'Q HH-mm-ss.SSS", "UTC", enUS, "2023/Q2 17-44-13.123"], // Valid known date with valid timeformat should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "+10:00", enUS, "2017-05-13 10-11-09"], // Valid known date with valid timeformat and different timezone should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "-07:00", enUS, "2017-05-12 17-11-09"], // Valid known date with valid timeformat and different timezone should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "+02:00", enUS, "2017-05-13 02-11-09"], // Valid known date with valid timeformat and different timezone should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "UTC", enUS, "2017-05-13 00-11-09"], // Valid known date with valid timeformat and different timezone should return known string.
    [new Date("2017-05-13T00:11:09.000Z"), "yyyy-MM-dd HH-mm-ss", "", enUS, "2017-05-13 00-11-09"], // Valid known date with valid timeformat and no timezone should return known UTC string.
])("safeTimeformat(%s, %s, %s, %s) -> %s", (date, timeformat, timezone, locale, expected) => {
    expect(safeFormatInTimeZone(date, timeformat, timezone, locale)).toEqual(expected);
});

// String, expected output.
test.each([
    ["enUS", enUS],
    ["ENUS", enUS],
    ["EN-US", enUS],
    ["EN_US", enUS],
    [" -EN_US", enUS],
    ["potato", undefined],
    ["DE", de],
])("getLocaleFromString(%s) -> %s", (input, expected) => {
    expect(getLocaleFromString(input)).toEqual(expected);
});

// Date object, Date object, expected output.
test.each([
    [new Date(40000), new Date(20000), 20],
    [new Date(""), new Date(20000), Infinity],
    [new Date(""), new Date(""), Infinity],
    [new Date(20000), new Date(""), Infinity],
    [new Date("2023-06-09T17:44:13.123Z"), new Date("2021-01-01T00:00:00.000Z"), 76873453.123],
])("getTimeDeltaInSeconds(%s, %s) -> %s", (dateA, dateB, expected) => {
    expect(getTimeDeltaInSeconds(dateA, dateB)).toEqual(expected);
});

// Date object, expected output.
test.each([
    [new Date(1494634269000), true],
    [new Date(40000), true],
    [new Date(""), false],
    [new Date("potato"), false],
    [new Date("2023-06-09T17:44:13.123Z"), true],
])("isValidDate(%s) -> %s", (date, expected) => {
    expect(isValidDate(date)).toEqual(expected);
});
