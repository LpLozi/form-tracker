/* Small equipment diagrams for the workout interface. No external assets. */
window.FormWorkoutArt = (() => {
  const diagrams = {
    press: '<path class="art-frame" d="M37 139h113M53 139V34h13m-7 13h69v90m-44-27v29m-13-40h42"/><rect class="art-pad" x="73" y="58" width="17" height="43" rx="5"/><path class="art-metal" d="M62 52 48 73l7 28m65-49 14 21-7 28M48 73h19m48 0h19"/><path class="art-accent" d="M50 99h14m55 0h13M75 110h32"/><rect class="art-stack" x="121" y="87" width="16" height="39" rx="3"/><path class="art-detail" d="M122 96h14m-14 9h14m-14 9h14"/>',
    row: '<path class="art-frame" d="M30 137h128M47 137l22-66m47 66-11-43m-62 23h81M124 137V34h18v94"/><path class="art-metal" d="m63 85 32-14m-5-20 12 41m20-31-12 20m-12 0h16"/><rect class="art-pad" x="58" y="90" width="41" height="12" rx="5" transform="rotate(-20 58 90)"/><rect class="art-pad" x="90" y="50" width="14" height="38" rx="5" transform="rotate(-17 90 50)"/><circle class="art-accent" cx="132" cy="48" r="7"/><path class="art-detail" d="M132 56v41m-8 8h16m-16 8h16m-16 8h16"/>',
    cable: '<path class="art-frame" d="M45 139h102M57 138V28h73v110M67 28v110m52-110v110"/><circle class="art-metal" cx="94" cy="38" r="8"/><path class="art-detail" d="M94 46v34m-27 23h52m-52 8h52m-52 8h52m-52 8h52"/><path class="art-metal" d="M94 80 78 94m16-14 16 14"/><path class="art-accent" d="m72 92 9 8m26-1 8-8"/><rect class="art-stack" x="74" y="98" width="39" height="33" rx="3"/><path class="art-detail" d="M75 107h37m-37 9h37m-37 9h37"/>',
    bench: '<path class="art-frame" d="M29 138h131M47 138l22-33m65 33-17-48m-75 37h91"/><path class="art-pad" d="m47 101 63-29 7 15-63 29Z"/><path class="art-metal" d="m45 55 29-13m-27 6 7 17m10-25 7 18m46-22 29 13m-24-18-7 18m24-7-7 17"/><path class="art-accent" d="m42 49 7 17m19-29 7 17m43-24-7 17m31-6-7 17"/>',
    bar: '<path class="art-metal" d="m27 99 132-39M39 76l11 37m91-67 11 37M50 70l12 38m68-60 12 38"/><path class="art-accent" d="m34 77 12 39m96-71 12 39"/><path class="art-detail" d="M46 137h98m-81-4h64"/><path class="art-metal" d="m73 86 9 5 14-12 10 4"/>',
    leg: '<path class="art-frame" d="M26 140h137M45 140l85-98m-62 99 85-98M41 125l38-6m29-63 32 28"/><path class="art-pad" d="m35 109 23-22 11 13-24 22Z"/><path class="art-metal" d="m76 105 35-40m-17-8 31 27m-18-42 31 27"/><path class="art-accent" d="m116 31 24 21m-27-18 24 21"/><circle class="art-stack" cx="83" cy="86" r="16"/><circle class="art-metal" cx="83" cy="86" r="6"/>',
    curl: '<path class="art-frame" d="M28 140h131M49 140V90m61 50V88m-61 33h61m25 19V45h18v84"/><rect class="art-pad" x="41" y="77" width="61" height="15" rx="5"/><rect class="art-pad" x="40" y="41" width="16" height="39" rx="5"/><path class="art-metal" d="m98 83 17 32 22-9M86 96h32"/><circle class="art-accent" cx="134" cy="108" r="9"/><rect class="art-stack" x="128" y="58" width="20" height="34" rx="3"/><path class="art-detail" d="M130 68h16m-16 9h16m-16 9h16"/>',
    fly: '<path class="art-frame" d="M35 140h118M94 139V30M70 121h47M94 39 45 55m49-16 49 16"/><rect class="art-pad" x="84" y="66" width="20" height="43" rx="5"/><path class="art-metal" d="m45 55-9 29 18 17m89-46 9 29-18 17"/><path class="art-accent" d="M52 94v21m82-21v21"/><rect class="art-pad" x="75" y="114" width="38" height="10" rx="4"/>',
    mat: '<path class="art-pad" d="m30 116 68-60 65 24-66 60Z"/><path class="art-detail" d="m49 112 52-45m-40 50 52-45m-39 49 52-45m-39 49 52-45m-39 49 52-45"/><path class="art-accent" d="m31 117 65 24 66-60"/>',
    dumbbell: '<path class="art-metal" d="m45 65 78 42m-72-58-17 33m28-27-17 33m73 3-17 33m28-27-17 33"/><path class="art-accent" d="m44 52-17 33m110 8-17 33"/><path class="art-detail" d="M40 142h106"/>'
  };
  const patterns = {
    'horizontal-push':'press','horizontal-pull':'row','vertical-pull':'cable',
    'vertical-push':'press','incline-push':'bench',hinge:'bar',knee:'leg',
    'knee-flexion':'curl','knee-extension':'curl',calf:'leg',fly:'fly',
    'rear-delt':'fly',core:'mat',extension:'cable',lateral:'cable',curl:'bar'
  };
  return e => {
    const key = /dumbbell|dambıl/i.test(e.equipment||'') && ['curl','lateral'].includes(e.pattern)
      ? 'dumbbell' : e.id==='db-flat' ? 'bench' : patterns[e.pattern]||'dumbbell';
    return `<svg class="equipment-art" viewBox="0 0 190 170" aria-hidden="true" focusable="false"><ellipse class="art-shadow" cx="95" cy="147" rx="66" ry="7"/>${diagrams[key]}</svg>`;
  };
})();
