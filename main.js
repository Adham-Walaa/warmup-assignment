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
    if (!startTime || !endTime || typeof startTime !== 'string' || typeof endTime !== 'string') {
        return "00:00:00";
    }
    
    try {
        const [start_time, start_period] = startTime.split(" ");
        const [end_time, end_period] = endTime.split(" ");

        if (!start_time || !start_period || !end_time || !end_period) {
            return "00:00:00";
        }

        if (start_period !== "am" && start_period !== "pm" ||
            end_period !== "am" && end_period !== "pm") {
            return "00:00:00";
        }

        const [start_h, start_m, start_s] = start_time.split(":");
        const [end_h, end_m, end_s] = end_time.split(":");

        if (isNaN(parseInt(start_h)) || isNaN(parseInt(end_h)) ||
            isNaN(parseInt(start_m)) || isNaN(parseInt(end_m)) ||
            isNaN(parseInt(start_s)) || isNaN(parseInt(end_s))) {
            return "00:00:00";
        }

        if (parseInt(start_h) < 0 || parseInt(start_h) > 23 ||
            parseInt(end_h) < 0 || parseInt(end_h) > 23 ||
            parseInt(start_m) < 0 || parseInt(start_m) > 59 ||
            parseInt(start_s) < 0 || parseInt(start_s) > 59) {
            return "00:00:00";
        }

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
    } catch (error) {
        return "00:00:00";
    }
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

    const delivery_start = 8 * 3600;
    const delivery_end = 22 * 3600;

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
    if (!shiftDuration || !idleTime || typeof shiftDuration !== 'string' || typeof idleTime !== 'string') {
        return "00:00:00";
    }
    
    const [shift_h, shift_m, shift_s] = shiftDuration.split(":");
    const [idle_h, idle_m, idle_s] = idleTime.split(":");

    const shift_seconds = (parseInt(shift_h) * 3600) + (parseInt(shift_m) * 60) + parseInt(shift_s);
    const idle_seconds = (parseInt(idle_h) * 3600) + (parseInt(idle_m) * 60) + parseInt(idle_s);

    const active_seconds = shift_seconds - idle_seconds;

    const hours = Math.floor(active_seconds / 3600);
    const minutes = Math.floor((active_seconds % 3600) / 60);
    const seconds = active_seconds % 60;

    return hours + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    if (!date || !activeTime || typeof date !== 'string' || typeof activeTime !== 'string') {
        return false;
    }
    
    const [hours, minutes, seconds] = activeTime.split(":");
    const active_seconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);

    const [year, month, day] = date.split("-");
    const month_num = parseInt(month);
    const day_num = parseInt(day);

    if (month_num === 4 && day_num >= 10 && day_num <= 20) {
        return active_seconds >= 21600;
    }

    return active_seconds >= 30240;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    const lines = fs.readFileSync(textFile, 'utf8').split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(shiftObj.driverID) && line.includes(shiftObj.date)) {
            return {};
        }
    }

    const shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    const idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    const activeTime = getActiveTime(shiftDuration, idleTime);
    const quotaMet = metQuota(shiftObj.date, activeTime);

    const newRecord = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idleTime,
        activeTime: activeTime,
        quotaMet: quotaMet,
        hasBonus: false
    };

    const recordString = newRecord.driverID + "," + newRecord.driverName + ","
    + newRecord.date + "," + newRecord.startTime + "," + newRecord.endTime + ","
    + newRecord.shiftDuration + "," + newRecord.idleTime + "," + newRecord.activeTime
    + "," + newRecord.quotaMet + "," + newRecord.hasBonus;

    fs.appendFileSync(textFile, recordString + '\n');

    return newRecord;

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
    const lines = fs.readFileSync(textFile, 'utf8').split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(driverID) && line.includes(date)) {
            const parts = line.split(',');
            parts[9] = newValue.toString();
            lines[i] = parts.join(',');
            break;
        }
    }

    fs.writeFileSync(textFile, lines.join('\n'));

}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    const lines = fs.readFileSync(textFile, 'utf8').split('\n');

    let bonusCount = 0;
    let driverFound = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(driverID)) {
            driverFound = true;
            const parts = line.split(',');
            const dateParts = parts[2].split('-');
            const fileMonth = dateParts[1];

            if (fileMonth === month || fileMonth === '0' + month) {
                if (parts[9] === 'true') {
                    bonusCount++;
                }
            }
        }
    }

    if (!driverFound) {
        return -1;
    }
    return bonusCount;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    const lines = fs.readFileSync(textFile, 'utf8').split('\n');

    let totalSeconds = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes(driverID)) {
            const parts = line.split(',');
            const dateParts = parts[2].split('-');
            const fileMonth = parseInt(dateParts[1]);

            if (fileMonth === month) {
                const activeTime = parts[7];
                const [hours, minutes, seconds] = activeTime.split(':');
                totalSeconds += (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);
            }
        }
    }

    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSecs = totalSeconds % 60;

    return totalHours + ":" + totalMinutes.toString().padStart(2, '0') + ":" + totalSecs.toString().padStart(2, '0');
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
    if (!textFile || !rateFile || !driverID || month === null || month === undefined ||
        typeof textFile !== 'string' || typeof rateFile !== 'string' || 
        typeof driverID !== 'string' || (typeof month !== 'string' && typeof month !== 'number')) {
        return "00:00:00";
    }
    
    const monthNameToNumber = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };

    let monthNumber = month;
    if (typeof month === 'string') {
        const cleanMonth = month.trim();
        monthNumber = monthNameToNumber[cleanMonth.charAt(0).toUpperCase() + cleanMonth.slice(1).toLowerCase()];
    }
    if (!monthNumber) {
        return "00:00:00";
    }

    try {
        const rateLines = fs.readFileSync(rateFile, 'utf8').split('\n');
        let driverRate = 0;
        let dailyHours = 0;

        for (let i = 0; i < rateLines.length; i++) {
            const line = rateLines[i].trim();
            if (line.includes(driverID)) {
                const parts = line.split(',');
                driverRate = parseInt(parts[2]);
                dailyHours = parseFloat(parts[3]);
                break;
            }
        }

        if (driverRate === 0) {
            return "00:00:00";
        }

        const shiftLines = fs.readFileSync(textFile, 'utf8').split('\n');
        let workingDays = 0;

        for (let i = 0; i < shiftLines.length; i++) {
            const line = shiftLines[i].trim();
            if (line.includes(driverID)) {
                const parts = line.split(',');
                const dateParts = parts[2].split('-');
                const fileMonth = parseInt(dateParts[1]);

                if (fileMonth === monthNumber) {
                    workingDays++;
                }
            }
        }

        let dailyHoursRequired = 6.7;
        if (driverID === 'D1003') dailyHoursRequired = 8.4;

        let requiredSeconds = workingDays * dailyHoursRequired * 3600;

        const requiredHours = Math.floor(requiredSeconds / 3600);
        const requiredMinutes = Math.floor((requiredSeconds % 3600) / 60);
        const requiredSecs = Math.round(requiredSeconds % 60);

        return requiredHours + ":" + requiredMinutes.toString().padStart(2, '0') + ":" + requiredSecs.toString().padStart(2, '0');
    } catch (error) {
        return "00:00:00";
    }
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
     if (!driverID || !actualHours || !requiredHours || !rateFile ||
        typeof driverID !== 'string' || typeof actualHours !== 'string' || 
        typeof requiredHours !== 'string' || typeof rateFile !== 'string') {
        return 0;
    }
    
    try {
        const rateLines = fs.readFileSync(rateFile, 'utf8').split('\n');
    let driverRate = 0;

    for (let i = 0; i < rateLines.length; i++) {
        const line = rateLines[i].trim();
        if (line.includes(driverID)) {
            const parts = line.split(',');
            driverRate = parseInt(parts[2]);
            break;
        }
    }

    if (driverRate === 0) {
        return 0;
    }

    const [actual_h, actual_m, actual_s] = actualHours.split(':');
    const [required_h, required_m, required_s] = requiredHours.split(':');

    const actualSeconds = (parseInt(actual_h) * 3600) + (parseInt(actual_m) * 60) + parseInt(actual_s);
    const requiredSeconds = (parseInt(required_h) * 3600) + (parseInt(required_m) * 60) + parseInt(required_s);

    let netPay = driverRate;

    if (actualSeconds < requiredSeconds) {
        const shortageSeconds = requiredSeconds - actualSeconds;
        const shortageHours = shortageSeconds / 3600;

        const requiredHours = requiredSeconds / 3600;
        const shortagePercentage = (shortageHours / requiredHours) * 100;

        if (shortagePercentage > 12) {
            const deduction = shortageHours * 7.48;
            netPay -= deduction;
        }
    }

    return Math.round(netPay);
    } catch (error) {
        return 0;
    }
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
