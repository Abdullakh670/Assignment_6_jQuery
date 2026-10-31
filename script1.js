/* ===== 1. DATA: the party from the picture (rooms left to right, guests left to right) ===== */
const party = [
    { room: 'balcony', name: 'Balcony', floor: 2, guests: [
        { name: 'Aigerim', color: 'green', time: '20:45', aitu: true,  items: ['cup', 'crumbs'] },
        { name: 'Aliya',   color: 'black', time: '21:15', aitu: false, items: ['phone', 'cup'] },
        { name: 'Madina',  color: 'green', time: '22:10', aitu: false, items: ['phone', 'bag', 'crumbs'] },
        { name: 'Ivan',    color: 'black', time: '20:10', aitu: true,  items: ['cup'] }
    ]},
    { room: 'hall', name: 'Hall', floor: 2, guests: [
        { name: 'Arman',   color: 'yellow', time: '20:35', aitu: false, items: ['bag', 'glasses'] },
        { name: 'Sophia',  color: 'purple', time: '21:20', aitu: true,  items: ['phone'] },
        { name: 'Dias',    color: 'green',  time: '19:45', aitu: true,  items: [] },
        { name: 'Bekzat',  color: 'purple', time: '20:55', aitu: false, items: ['bag', 'cup', 'crumbs'] },
        { name: 'Aruzhan', color: 'black',  time: '21:50', aitu: true,  items: ['phone'] },
        { name: 'Saule',   color: 'green',  time: '21:25', aitu: false, items: ['glasses'] }
    ]},
    { room: 'kitchen', name: 'Kitchen', floor: 1, guests: [
        { name: 'Nurlan', color: 'red',    time: '19:40', aitu: true,  items: ['phone', 'cup'] },
        { name: 'Emma',   color: 'black',  time: '20:15', aitu: false, items: ['bag'] },
        { name: 'Timur',  color: 'green',  time: '21:05', aitu: true,  items: ['phone', 'bag', 'crumbs'] },
        { name: 'Sergey', color: 'yellow', time: '20:50', aitu: false, items: [] },
        { name: 'Yerlan', color: 'red',    time: '21:40', aitu: true,  items: ['glasses', 'phone'] },
        { name: 'Kamila', color: 'black',  time: '20:05', aitu: false, items: ['cup'] }
    ]},
    { room: 'living-room', name: 'Living room', floor: 1, guests: [
        { name: 'Daniel',  color: 'blue',   time: '19:55', aitu: false, items: ['glasses'] },
        { name: 'Zarina',  color: 'green',  time: '21:10', aitu: false, items: ['bag', 'phone', 'crumbs'] },
        { name: 'Natasha', color: 'yellow', time: '20:30', aitu: true,  items: [] },
        { name: 'Askar',   color: 'black',  time: '21:00', aitu: true,  items: ['phone'] },
        { name: 'Inkar',   color: 'purple', time: '20:20', aitu: false, items: ['bag'] }
    ]}
];

const AVATAR = 'https://api.dicebear.com/9.x/open-peeps/svg?seed=';
const S = 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
    phone:   `<svg viewBox="0 0 16 16"><rect x="4" y="1.5" width="8" height="13" rx="1.8" ${S}/><circle cx="8" cy="12.2" r=".7" fill="currentColor"/></svg>`,
    glasses: `<svg viewBox="0 0 16 16"><circle cx="4.3" cy="9" r="3" ${S}/><circle cx="11.7" cy="9" r="3" ${S}/><path d="M7.3 8.6h1.4" ${S}/></svg>`,
    bag:     `<svg viewBox="0 0 16 16"><path d="M3 5.5h10l-.8 9H3.8z" ${S}/><path d="M5.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" ${S}/></svg>`,
    cup:     `<svg viewBox="0 0 16 16"><path d="M3 6h8v3.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" ${S}/><path d="M11 7h1.2a1.7 1.7 0 0 1 0 3.4H11" ${S}/><path d="M5.2 2.5v1.5M8 2.5v1.5" ${S}/></svg>`,
    crumbs:  `<svg viewBox="0 0 16 16"><path d="M2 11.5l12-4-2.2-4.5z" ${S}/><circle cx="4" cy="14" r=".8" fill="currentColor"/><circle cx="8" cy="14.2" r=".8" fill="currentColor"/><circle cx="12" cy="13.8" r=".8" fill="currentColor"/></svg>`
};

function minutes(t) {                       // "20:45" -> 1245
    const p = t.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
}

/* ===== 2. BUILD THE PAGE FROM THE ARRAY ===== */
function makeCard(g) {
    const $card = $('<div>').addClass('guest ' + g.color).toggleClass('aitu', g.aitu)
        .attr({ 'data-name': g.name, 'data-time': g.time, 'data-color': g.color, 'data-aitu': g.aitu, 'data-items': g.items.join(',') });
    g.items.forEach(i => $card.addClass('has-' + i));          // has-phone, has-bag ...

    const $img = $('<img class="avatar" alt="">').attr('src', AVATAR + g.name)
        .on('error', function () { $(this).replaceWith($('<span class="avatar fallback">').text(g.name[0])); });
    const $items = $('<div class="items">');
    g.items.forEach(i => $items.append($('<span class="icon">').attr('title', i).html(ICONS[i])));

    $card.append($img, $('<div class="name">').text(g.name), $('<div class="time">').text(g.time), $items);
    if (g.aitu) $card.append('<span class="badge">AITU</span>');
    return $card;
}

function buildPage() {
    $('#house').empty();
    [2, 1].forEach(function (floor) {
        const $rooms = $('<div class="rooms">');
        party.filter(r => r.floor === floor).forEach(function (r) {
            const $room = $('<div class="room">').attr({ id: r.room, 'data-name': r.name, 'data-floor': r.floor });
            $room.append($('<div class="room-head">').append($('<h3>').text(r.name)));
            const $guests = $('<div class="guests">').appendTo($room);
            r.guests.forEach(g => $guests.append(makeCard(g)));
            $rooms.append($room);
        });
        $('<section class="floor">').attr('id', 'floor-' + floor)
            .append($('<div class="floor-label">').text('FLOOR ' + floor), $rooms).appendTo('#house');
    });
}

/* ===== 3. THE 20 CASES: every case is one jQuery chain that searches the page ===== */
const cases = [
    { id: 1,  title: 'Who is in the hall?',
      run: () => $('#hall .guest') },
    { id: 2,  title: 'Who is dressed in yellow or purple?',
      run: () => $('.guest.yellow, .guest.purple') },
    { id: 3,  title: 'Which AITU students are upstairs?',
      run: () => $('#floor-2 .guest.aitu') },
    { id: 4,  title: 'Who has glasses or a bag?',
      run: () => $('.guest.has-glasses, .guest.has-bag') },
    { id: 5,  title: 'Who came with nothing at all?',
      run: () => $('.guest[data-items=""]') },
    { id: 6,  title: 'Who has a phone but no bag?',
      run: () => $('.guest.has-phone').not('.has-bag') },
    { id: 7,  title: 'Who arrived between 20:30 and 21:00, both included?',
      run: () => $('.guest').filter(function () { const t = minutes($(this).data('time')); return t >= minutes('20:30') && t <= minutes('21:00'); }) },
    { id: 8,  title: 'Who arrived after 21:00 and is not an AITU student?',
      run: () => $('.guest').not('.aitu').filter(function () { return minutes($(this).data('time')) > minutes('21:00'); }) },
    { id: 9,  title: 'Who stands right next to Askar?',
      run: () => $('.guest[data-name="Askar"]').prev().add($('.guest[data-name="Askar"]').next()) },
    { id: 10, title: 'Who stands last in each room?',
      run: () => $('.guests .guest:last-child') },
    { id: 11, title: 'Who stands third in each room?',
      run: () => $('.guests .guest:nth-child(3)') },
    { id: 12, title: 'Who stands after Timur in his room?',
      run: () => $('.guest[data-name="Timur"]').nextAll() },
    { id: 13, title: 'Who stands right before someone in black?',
      run: () => $('.guest.black').prev() },
    { id: 14, title: 'In which room is Aruzhan?',
      run: () => $('.guest[data-name="Aruzhan"]').closest('.room') },
    { id: 15, title: 'Which rooms have fewer than 6 guests?',
      run: () => $('.room').filter(function () { return $(this).find('.guest').length < 6; }) },
    { id: 16, title: 'In which rooms does somebody have a cup, but nobody wears glasses?',
      run: () => $('.room:has(.has-cup):not(:has(.has-glasses))') },
    { id: 17, title: 'Who came first to each room?',
      run: () => $('.guests').map(function () { return $(this).children().get().sort((a, b) => minutes($(a).data('time')) - minutes($(b).data('time')))[0]; }) },
    { id: 18, title: 'Miras (AITU, blue, 21:20, phone) joins between Askar and Inkar',
      run: () => makeCard({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, items: ['phone'] }).hide().insertAfter('.guest[data-name="Askar"]').fadeIn(800) },
    { id: 19, title: 'Natasha says goodbye and goes home', jump: false,
      run: () => $('.guest[data-name="Natasha"]').fadeOut(800, function () { $(this).remove(); }) },
    { id: 20, title: 'Who took the cake?',
      run: () => $('#floor-1 .guest.has-crumbs').not('.has-cup').filter(function () {
          const t = minutes($(this).data('time'));
          return t > minutes('21:00') && t < minutes('21:30') && $(this).prev().add($(this).next()).filter('.aitu').length > 0;
      }) }
];

/* ===== 4. SHOW AND HIGHLIGHT WHAT A CASE FINDS ===== */
function showResult(c, $found) {
    const names = $found.map(function () { return $(this).attr('data-name'); }).get();
    $('#result').text('Case ' + c.id + ': ' + c.title + '  ->  found ' + names.length + (names.length ? ': ' + names.join(', ') : ' (nobody)'));
}

function highlight(c, $found) {
    $found.addClass('found');
    if (c.jump !== false) $found.filter('.guest').animate({ top: -14 }, 150).animate({ top: 0 }, 150);   // jump once
}

$(function () {
    cases.forEach(function (c) {
        $('<button>').text('Case ' + c.id).attr('title', c.title).on('click', function () {
            buildPage();                       // always start from a fresh party
            const $found = c.run();
            showResult(c, $found);
            highlight(c, $found);
        }).appendTo('#controls');
    });
    buildPage();
});
