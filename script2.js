/* Task 2 = copy of Task 1 + spotlight, guest card, move, sort. The array is changed when a guest moves. */
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
    $('.flyer').stop(true).remove();      // a flying card from an old page must not stay
    closeCardNow();
    $('#house').empty();
    [2, 1].forEach(function (floor) {
        const $rooms = $('<div class="rooms">');
        party.filter(r => r.floor === floor).forEach(function (r) {
            const $room = $('<div class="room">').attr({ id: r.room, 'data-name': r.name, 'data-floor': r.floor });
            $room.append($('<div class="room-head">').append($('<h3>').text(r.name), $('<button class="sort-btn">').text('Sort by time')));
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
      run: () => makeCard({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, items: ['phone'] }).addClass('busy').hide().insertAfter('.guest[data-name="Askar"]').fadeIn(800, function () { $(this).removeClass('busy'); }) },
    { id: 19, title: 'Natasha says goodbye and goes home', jump: false,
      run: () => $('.guest[data-name="Natasha"]').addClass('busy').fadeOut(800, function () { $(this).remove(); }) },
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
            spotlight($found);
            highlight(c, $found);
        }).appendTo('#controls');
    });
    $('<button>').text('Clear').attr('id', 'clear').on('click', function () { $('.guest').fadeTo(300, 1); }).appendTo('#controls');
    buildPage();
});


/* =====================  TASK 2  ===================== */

/* ---- 1. Spotlight: found guests stay bright, all other guests fade to 20% in 0.3 s ---- */
function stopFx($set) {                         // stop old fades, but never touch a card that is appearing or leaving
    $set.not('.busy').stop('fx', true);
    return $set;
}

function spotlight($found) {
    const $bright = $found.is('.room') ? $found.find('.guest') : $found.filter('.guest');   // room cases: guests of the room
    stopFx($('.guest').not($bright)).fadeTo(300, 0.2);
    stopFx($bright).fadeTo(300, 1);
}

/* ---- 2. Guest card: grows out of the photo, shrinks back into the photo ---- */
const $card = $('<div id="card">').appendTo('body');
const WORD = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };
let owner = null;            // name of the guest whose photo the card is attached to (null = no card)
let closing = false;

function joinWords(a) {
    return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
}

function photoRect(name) {
    const $img = $('.guest[data-name="' + name + '"] .avatar');
    if (!$img.length) return null;
    const o = $img.offset();
    return { left: o.left, top: o.top, width: $img.outerWidth(), height: $img.outerHeight() };
}

function fillCard($g) {
    const items = ($g.attr('data-items') || '').split(',').filter(Boolean);
    const here = $g.closest('.room');
    const $moves = $('<div class="moves">');
    party.forEach(function (r) {                // one button for each OTHER room
        if (r.room !== here.attr('id')) $moves.append($('<button>').attr('data-room', r.room).text('Move to the ' + r.name.toLowerCase()));
    });
    $card.empty().append($('<div class="card-inner">').append(
        $('<h3>').text($g.attr('data-name')),
        $('<p>').text('Came at ' + $g.attr('data-time')),
        $('<p>').text($g.hasClass('aitu') ? 'AITU student' : 'Not an AITU student'),
        $('<p>').text('Wears ' + $g.attr('data-color')),
        $('<p>').text(items.length ? 'Has ' + joinWords(items.map(i => WORD[i])) : 'Has nothing with them'),
        $('<p>').text('Now in the ' + here.attr('data-name').toLowerCase()),
        $moves));
}

function growCard(name) {
    const $g = $('.guest[data-name="' + name + '"]');
    if (!$g.length) return;
    owner = name;
    closing = false;
    fillCard($g);
    $card.stop(true).css({ display: 'block', visibility: 'hidden', width: 300, height: 'auto', left: 0, top: 0, opacity: 1 });
    const H = $card.outerHeight();              // full height of the card
    const target = { left: $(window).scrollLeft() + ($(window).width() - 300) / 2, top: $(window).scrollTop() + ($(window).height() - H) / 2, width: 300, height: H };
    const p = photoRect(name);
    $card.css({ visibility: 'visible', left: p.left, top: p.top, width: p.width, height: p.height }).animate(target, 350);
}

function shrinkCard(done) {
    const r = photoRect(owner);
    closing = true;
    const finish = function () { $card.hide(); owner = null; closing = false; if (done) done(); };
    if (r) $card.stop(true).animate(r, 250, finish);
    else $card.stop(true).fadeOut(150, finish);
}

function openCard($g) {                         // only one card: the old one shrinks, then the new one grows
    const name = $g.attr('data-name');
    if (owner === name && !closing) return;
    if (owner && owner !== name) shrinkCard(function () { growCard(name); });
    else growCard(name);
}

function closeCard() { if (owner) shrinkCard(); }
function closeCardNow() { $card.stop(true).hide(); owner = null; closing = false; }

$(document).on('click', '.guest', function () { openCard($(this)); });
$(document).on('keydown', function (e) { if (e.key === 'Escape') closeCard(); });
$(document).on('click', function (e) { if (!$(e.target).closest('.guest, #card').length) closeCard(); });

/* ---- 3. Move: the card flies to the new room, the old place closes, the new place opens ---- */
const GAP_OFF = { width: 0, marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 };

function moveGuest(name, toId) {
    const $src = $('.guest[data-name="' + name + '"]').not('.leaving');
    if (!$src.length || $src.closest('.room').attr('id') === toId) return;
    const g = { name: name, color: $src.attr('data-color'), time: $src.attr('data-time'), aitu: $src.hasClass('aitu'),
                items: ($src.attr('data-items') || '').split(',').filter(Boolean) };

    // the array changes first, so every case and every rebuild sees the guest in the new room
    const fromRoom = party.find(r => r.guests.some(x => x.name === name));
    const toRoom = party.find(r => r.room === toId);
    if (fromRoom) {
        fromRoom.guests.splice(fromRoom.guests.findIndex(x => x.name === name), 1);
        toRoom.guests.push(g);
    }

    const op = $src.css('opacity');
    $src.stop('fx', true);
    const start = $src.offset();

    // new card at the end of the new room: measure its final place, then close its gap
    const $real = makeCard(g).css('visibility', 'hidden').appendTo('#' + toId + ' .guests');
    const end = $real.offset();
    const full = {};
    ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'].forEach(p => full[p] = $real.css(p));
    $real.css($.extend({ overflow: 'hidden', opacity: op }, GAP_OFF))
         .animate(full, { duration: 700, queue: 'gap' }).dequeue('gap');           // the new place opens slowly

    // the old place closes slowly
    $src.addClass('leaving').css({ visibility: 'hidden', overflow: 'hidden' })
        .animate(GAP_OFF, { duration: 700, queue: 'gap', complete: function () { $(this).remove(); } }).dequeue('gap');

    // a copy of the card flies across the house
    const $fly = $src.clone().addClass('flyer').css({ position: 'absolute', left: start.left, top: start.top, margin: 0, width: $src.outerWidth(),
        height: $src.outerHeight(), opacity: op, zIndex: 900, visibility: 'visible' }).appendTo('body');
    $fly.animate({ left: end.left, top: end.top }, 700, function () {
        $real.stop('gap', true, true).removeAttr('style').css('opacity', op);
        $fly.remove();
    });
}

$(document).on('click', '#card .moves button', function () {
    const name = owner;
    closeCard();
    moveGuest(name, $(this).attr('data-room'));
});

/* ---- 4. Sort by time: cards slide to their new places; click again = back to the picture order ---- */
function sortRoom($room) {
    const $list = $room.find('.guests');
    const els = $list.children('.guest').not('.leaving').get();
    const sorted = !$room.data('sorted');
    $room.data('sorted', sorted);
    $room.find('.sort-btn').toggleClass('active', sorted);
    if (sorted) $room.data('picture', els.map(e => e.getAttribute('data-name')));        // remember the picture order
    const picture = $room.data('picture') || [];
    const rank = e => { const i = picture.indexOf(e.getAttribute('data-name')); return i < 0 ? 1000 : i; };

    $(els).stop('slide', true);                                                          // stop old slides, keep the cards where they are now
    const first = new Map(els.map(e => [e, $(e).offset()]));                              // where every card is right now
    els.sort(sorted ? (a, b) => minutes(a.dataset.time) - minutes(b.dataset.time) : (a, b) => rank(a) - rank(b));
    $(els).css({ left: 0, top: 0 });
    $list.append(els);                                                                    // new order in the DOM
    els.forEach(function (e) {                                                            // put every card back where it was, then slide it
        const now = $(e).offset(), was = first.get(e);
        $(e).css({ left: was.left - now.left, top: was.top - now.top })
            .animate({ left: 0, top: 0 }, { duration: 700, queue: 'slide' }).dequeue('slide');
    });
}

$(document).on('click', '.sort-btn', function () { sortRoom($(this).closest('.room')); });
