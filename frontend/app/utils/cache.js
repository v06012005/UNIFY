// cache.js
export const postCache = {
    data: {},
    set(filterKey, posts) {
        this.data[filterKey] = posts;
    },
    get(filterKey) {
        return this.data[filterKey] || null;
    },
};
