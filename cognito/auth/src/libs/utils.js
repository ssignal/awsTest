async function sleep(delay) {
    console.log('--- sleep');
    return new Promise((r) => setTimeout(r, delay * 100));
}

module.exports = {
    sleep,
};
