function cloudEntries(data) {
    return Object.entries(data)
        .reduce((curr, [key, value]) => {
            if (value === null || value === undefined || value === '') {
                return curr;
            }
            curr[key] = value;
            return curr;
        }, {});
}

exports.cloudEntries = cloudEntries;