const F = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
const K = "C D E F G A B C".split(" ");
let ctx;
const on = {};
const row = document.getElementById('row');
const b = F.map((note, i) => {
    const cloud = document.createElement('div');
    cloud.textContent = K[i];
    row.append(cloud);
    return cloud;
});

function start(i) {
    ctx = ctx || new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    if (on[i]) return;

    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = F[i];
    g.gain.value = 0.2;

    o.connect(g).connect(ctx.destination);
    o.start();

    on[i] = o;
    b[i].classList.add('on');
}

function stop(i) {
    if (!on[i]) return;
    on[i].stop();
    on[i] = 0;
    b[i].classList.remove('on');
}

function playWhereverPointeris(event) {
    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
    const index = b.indexOf(hoveredElement);

    b.forEach((cloud, i) => {
        if (i == index) {
            start(i); 
        } else {
            stop(i);
        }
    });
}

    row.onpointerdown = playWhereverPointeris;

    row.onpointermove = event => {
        if (event.buttons) {
            playWhereverPointeris(event);
        }
};

    row.onpointerup = row.onpointercancel = () => {
        b.forEach((cloud, i) => stop(i));
};