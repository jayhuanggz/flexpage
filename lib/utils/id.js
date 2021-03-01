
const PREFIX = 'w';

let currentTime;
let counter = 0;

export default {
    random() {
        let now = Date.now();
        if (!currentTime) {
            currentTime = now;
        }

        if (currentTime === now) {
            counter++;
        } else {
            currentTime = now;
            counter = 1;
        }


        return PREFIX + currentTime + String(counter)
    }
}