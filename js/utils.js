var Utils = {
    access: function (obj, path) {
        let elems = path.split(".");
        let val = obj;
        for (let elem of elems) {
            if (typeof(val) !== "object") {
                throw "Invalid path '" + path + "' in " + obj;
            }
            val = val[elem];
        }
        return val;
    },
    update: function (obj, path, value) {
        let elems = path.split(".");
        let lastElem = elems.splice(elems.length - 1, 1)[0];
        let val = obj;
        for (let elem of elems) {
            if (typeof(val) !== "object") {
                throw "Invalid path '" + path + "' in " + obj;
            }
            val = val[elem];
        }
        val[lastElem] = value;
        return obj;
    },
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    shuffle: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    randInt: function (max) {
        return Math.floor(Math.random() * max);
    },
    choose: function (list) {
        let randomIndex = Utils.randInt(list.length);
        return list[randomIndex];
    },
    chooseMultiple: function (list, count) {
        let indexes = [...Array(list.length).keys()];
        indexes = Utils.shuffle(indexes);
        return indexes.slice(0, count).map(index => list[index]);
    }
};