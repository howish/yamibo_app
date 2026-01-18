const os = require('os');

// Polyfill for os.availableParallelism (Added in Node.js 18.14.0)
if (!os.availableParallelism) {
    os.availableParallelism = () => {
        const cpus = os.cpus();
        return cpus ? cpus.length : 1;
    };
}

// Polyfill for Array.prototype.toReversed (Added in Node.js 20.0.0)
if (!Array.prototype.toReversed) {
    Array.prototype.toReversed = function () {
        return [...this].reverse();
    };
}

// Polyfill for Array.prototype.toSorted (Added in Node.js 20.0.0)
if (!Array.prototype.toSorted) {
    Array.prototype.toSorted = function (compareFn) {
        return [...this].sort(compareFn);
    };
}

// Polyfill for Array.prototype.toSpliced (Added in Node.js 20.0.0)
if (!Array.prototype.toSpliced) {
    Array.prototype.toSpliced = function (start, deleteCount, ...items) {
        const copy = [...this];
        copy.splice(start, deleteCount, ...items);
        return copy;
    };
}

// Polyfill for Array.prototype.with (Added in Node.js 20.0.0)
if (!Array.prototype.with) {
    Array.prototype.with = function (index, value) {
        const copy = [...this];
        copy[index] = value;
    };
}

// Polyfill for URL.canParse (Added in Node.js 19.0.0)
if (!URL.canParse) {
    URL.canParse = function (url, base) {
        try {
            new URL(url, base);
            return true;
        } catch (e) {
            return false;
        }
    };
}
