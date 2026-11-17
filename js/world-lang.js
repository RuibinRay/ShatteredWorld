'use strict';
// Shattered Worlds — Spanish and Chinese for the world files' place, enemy and boss names and prompts that the shared
// js/lang/*.js files do not have (the Roots and the Tether Fields: world-deep.js, world-sky.js). Moved from the first
// story mode's story-roots-lang.js when that story was removed; its mission, card and dialogue rows went with it.
// Kept in its own file so the shared js/lang/*.js files are not touched. Each row: [English, Spanish, Chinese]; the
// English must match the game text exactly.
(function () {
  const SW = window.SW;
  if (!SW.i18n || !SW.i18n.add) return;
  const R = [
    // ----- places, people, things -----
    ['The Roots', 'Las Raíces', '根脉'],
    ['Tether Fields', 'Campos de Amarras', '系缆原野'],
    ['The Tether Fields', 'Los Campos de Amarras', '系缆原野'],
    ['The Taproot Stair', 'La Escalera de Raíces', '主根阶梯'],
    ['The Rootways', 'Los Pasos de Raíz', '根道'],
    ['The Heartroot', 'La Raíz Madre', '心根'],
    ['The Great Tether', 'La Gran Amarra', '巨型系缆'],
    ['The Anchor Crown', 'La Corona del Ancla', '锚冠'],
    ['BENEATH DEEPLINE', 'BAJO DEEPLINE', '深线之下'],
    ['Rootling', 'Raicilla', '根须怪'],
    ['Halcyon Tap Crew', 'Cuadrilla de grifos de Halcyon', '哈尔西恩汲取工'],
    ['Tap Drone', 'Dron de grifo', '汲取无人机'],
    ['Root Knot', 'Nudo de raíz', '根结'],
    ['Halcyon Lineman', 'Liniero de Halcyon', '哈尔西恩线路工'],
    ['Kite Drone', 'Dron cometa', '风筝无人机'],
    ['Clamp Crawler', 'Reptador de abrazadera', '钳夹爬行者'],
    ['ROOT WARDEN GRANE', 'GUARDIANA DE RAÍCES GRANE', '根脉看守·格兰妮'],
    ['Halcyon taproot station', 'Estación de raíces de Halcyon', '哈尔西恩主根站'],
    ['LINEWARDEN ORRO', 'GUARDACABLES ORRO', '缆线看守·奥罗'],
    ['Halcyon tether line, anchor crown', 'Línea de amarras de Halcyon, corona del ancla', '哈尔西恩系缆线，锚冠'],
    ['Root Warden Grane', 'Guardiana de Raíces Grane', '根脉看守格兰妮'],
    ['Linewarden Orro', 'Guardacables Orro', '缆线看守奥罗'],
    // ----- prompts -----
    ['Climb down through the crack', 'Baja por la grieta', '从裂缝爬下去'],
    ['Climb back up to the Old Metro', 'Vuelve a subir al Metro Viejo', '爬回旧地铁'],
    ['Ride the tap-pipe lift up to the Old Metro', 'Sube en el elevador de tuberías hasta el Metro Viejo', '乘管道升降机回到旧地铁'],
    ['Ride the zipline down to the Skylift gate', 'Baja en tirolina hasta la puerta del Elevador Celeste', '乘滑索降到天梯大门']
  ];
  const es = {}, zh = {};
  R.forEach(r => { es[r[0]] = r[1]; zh[r[0]] = r[2]; });
  SW.i18n.add('es', es); SW.i18n.add('zh', zh);
})();
