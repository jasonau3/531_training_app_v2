export const PRIMARY_COLOR = '#FF0000';
export const BACKGROUND_APP_COLOR = '#FCFCFC';

export const sortByName = (array) => {
    return array.slice().sort((a, b) => a.name.localeCompare(b.name));
};

export const calculateHorizontalPadding = (screenWidth) => {
    if (screenWidth > 1024) {
        return screenWidth * 0.3;
    } else if (screenWidth > 768) {
        return screenWidth * 0.2;
    } else {
        return 0;
    }
};

// returns the most recent workout
export const getRecentWorkoutWeek = (week, day) => {
    if (week === 4 && day === 4) {
        return 1;
    } else if (day === 4) {
        return week + 1;
    } else {
        return week;
    }
};
