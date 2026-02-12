export const defaultStorage = {
    getItem: (key) => {
        if (typeof localStorage !== "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItem: (key, value) => {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(key, value);
        }
    },
    removeItem: (key) => {
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(key);
        }
    },
};
