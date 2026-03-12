const fs = require("fs");

function timeToSeconds(timeString) {
    const [time, period] = timeString.split(" ");
    const [h, m, s] = time.split(":");

    let hours = parseInt(h);
    if (period === "pm" && hours !== 12) {
        hours += 12;
    } else if (period === "am" && hours === 12) {
        hours = 0;
    }
    return (hours * 3600) + (parseInt(m) * 60) + parseInt(s);
}

function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours + ":" + minutes.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
}

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    const [start_time, start_period] = startTime.split(" ");
    const [end_time, end_period] = endTime.split(" ");

    const [start_h, start_m, start_s] = start_time.split(":");
    const [end_h, end_m, end_s] = end_time.split(":");

    let start_hours = parseInt(start_h);
    let end_hours = parseInt(end_h);

    if (start_period === "pm" && start_hours !== 12)
        start_hours += 12;
    if (start_period === "am" && start_hours === 12)
        start_hours = 0;
    if (end_period === "pm" && end_hours !== 12)
        end_hours += 12;
    if (end_period === "am" && end_hours === 12)
        end_hours = 0;

    const start_seconds = (start_hours * 3600) + (parseInt(start_m) * 60) + parseInt(start_s);
    const end_seconds = (end_hours * 3600) + (parseInt(end_m) * 60) + parseInt(end_s);

    let duration_seconds;
    if (end_seconds >= start_seconds) {
        duration_seconds = end_seconds - start_seconds;
    }
    else {
        duration_seconds = (86400 - start_seconds) + end_seconds;
    }

    const hours = Math.floor(duration_seconds / 3600);
    const minutes = Math.floor((duration_seconds % 3600) / 60);
    const seconds = duration_seconds % 60;

    return hours + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    const [start_time, start_period] = startTime.split(" ");
    const [end_time, end_period] = endTime.split(" ");
    const [start_h, start_m, start_s] = start_time.split(":");
    const [end_h, end_m, end_s] = end_time.split(":");

    let start_hours = parseInt(start_h);
    let end_hours = parseInt(end_h);
    if (start_period === "pm" && start_hours !== 12) start_hours += 12;
    if (start_period === "am" && start_hours === 12) start_hours = 0;
    if (end_period === "pm" && end_hours !== 12) end_hours += 12;
    if (end_period === "am" && end_hours === 12) end_hours = 0;

    const start_seconds = (start_hours * 3600) + (parseInt(start_m) * 60) + parseInt(start_s);
    const end_seconds = (end_hours * 3600) + (parseInt(end_m) * 60) + parseInt(end_s);

    const delivery_start = 8 * 3600;  // 28800 seconds
    const delivery_end = 22 * 3600;   // 79200 seconds

    let idle_seconds = 0;

    if (start_seconds < delivery_start) {
        idle_seconds += Math.min(delivery_start, end_seconds) - start_seconds;
    }

    if (end_seconds > delivery_end) {
        idle_seconds += end_seconds - Math.max(delivery_end, start_seconds);
    }

    if (end_seconds < start_seconds) {
        if (start_seconds < delivery_start) {
            idle_seconds += delivery_start - start_seconds;
        }
        if (end_seconds > delivery_end) {
            idle_seconds += end_seconds - delivery_end;
        }
    }

    const hours = Math.floor(idle_seconds / 3600);
    const minutes = Math.floor((idle_seconds % 3600) / 60);
    const seconds = idle_seconds % 60;

    return hours + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {

}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {

}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {

}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {

}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {

}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {

}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {

}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {

}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
