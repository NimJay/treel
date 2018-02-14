class School {
    constructor({ _id, name, country }) {
        this._id = _id;
        this.name = name;
        this.country = country;
    }

    searchScore(searchString) {
        let ss = searchString.toLowerCase().trim().split(/\s+/);
        let score = 2 - (ss.length * 1);
        for (var i in ss) {
            let s = ss[i]; // Current word of searchString.
            score += this.name.toLowerCase().includes(s) * 2;
            score += this.country.toLowerCase().includes(s);
        }
        return score;
    }
}

function searchSchools(schools, searchString) {
    let s = searchString;
    if (/^\s*$/.test(s)) return [];
    return schools
        .filter(a => a.searchScore(s) >= 2) // Only keep matches.
        .sort((a, b) => a.searchScore(s) < b.searchScore(s)); // Sort.
}

export { School, searchSchools };
