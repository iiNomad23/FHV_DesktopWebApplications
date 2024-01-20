function convertMinutesIntoTimeFormat(minutes = "0") {
    minutes = parseInt(minutes);

    let hours = Math.floor(minutes / 60);
    if (hours < 10) {
        hours += "0";
    }

    let currentMinutes = minutes % 60;
    if (currentMinutes < 10) {
        currentMinutes += "0";
    }

    return hours + ":" + currentMinutes;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();

    // Add leading zero to day and month if needed
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return `${formattedDay}.${formattedMonth}.${year}`;
}

function convertTime(time) {
    if (time == null) {
        return null;
    }
    let timeArray = time.split(":");
    if (timeArray.length <= 1) {
        return null;
    }

    time = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    if (isNaN(time)) {
        return null;
    }
    return time;
}