'use strict';

const icons = {};

class TightPriorityQueue {
    constructor() {
        this.pList = [];
        this.values = {};
    }
    
    add(...values) {
        for (const pair in pairs) {
            if (pair.prio in this.values) this.values[pair.prio].push(pair.value);
            else {
                this.pList.push(pair.prio);
                this.pList.sort();
                this.values[pair.prio] = [pair.value];
            }
        }
    }
    
    addEquiPrio(prio, ...values) {
        if (prio in this.values) this.values[prio].push(...values);
        else {
            this.pList.push(prio);
            this.pList.sort();
            this.values[prio] = values;
        }
    }
    
    get first() {
        if (!this.pList) return undefined;
        return {prio: this.pList[0], value: this.values[this.pList[0]][0]};
    }
    
    popFirst() {
        const r = {prio: this.pList[0], value: this.values[this.pList[0]].shift()};
        if (!this.values[this.pList[0]]) delete this.values[this.pList.shift()];
        return r;
    }
}

function DownloadCanvasAsImage(canvas) {
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    const dataURL = canvas.toDataURL('image/png').replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.href = dataURL;
    downloadLink.click();
    downloadLink.remove();
}

function drawBaseMap(canvas, plane) {
    const drawCtx = canvas.getContext('2d');
    const colorBG = 'dimgray';
    const x0 = plane.x_offset;
    const y0 = plane.y_offset;
    
    const encodeLocation = (x, y) => x + y*72 + plane.id*3600;
    const drawTile = (x, y, color) => {
        // console.log(x, y, color);
        drawCtx.fillStyle = color;
        drawCtx.fillRect((x-x0)*24, (y-y0)*24, 23, 23);
    };
    
    canvas.width = plane.x;
    canvas.height = plane.y;
    
    drawCtx.fillStyle = "#000000";
    drawCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    for (let x = 1 + x0; x <= plane.columns + x0; x++) {
        for (let y = 1 + y0; y <= plane.rows + y0; y++) {
            drawTile(x, y, colorBG);
        }
    }
    
    // Draw Border Coordinates
    drawCtx.font = "18px monospace";
    drawCtx.fillStyle = "white";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    for (let x = 1 + x0; x <= plane.columns + x0; x++) {
        drawCtx.fillText(x, (x-x0)*24 + 11, 13);
        drawCtx.fillText(x, (x-x0)*24 + 11, canvas.height - 10);
    }
    for (let y = 1 + y0; y <= plane.rows + y0; y++) {
        drawCtx.fillText(y, 11, (y-y0)*24 + 13);
        drawCtx.fillText(y, canvas.width - 11, (y-y0)*24 + 13);
    }
}

function drawMap(canvas, plane, tiledata, tileinfo) {
    const drawCtx = canvas.getContext('2d');
    const colorBG = 'dimgray';
    const x0 = plane.x_offset;
    const y0 = plane.y_offset;
    
    const encodeLocation = (x, y) => x + y*72 + plane.id*3600;
    const drawTile = (x, y, color) => {
        // console.log(x, y, color);
        drawCtx.fillStyle = color;
        drawCtx.fillRect((x-x0)*24, (y-y0)*24, 23, 23);
    };
    
    // Draw tiles
    for (let x = 1 + x0; x <= plane.columns + x0; x++) {
        for (let y = 1 + y0; y <= plane.rows + y0; y++) {
            const EL = encodeLocation(x, y);
            if (!tiledata[EL]) continue;
            drawTile(x, y, '#' + tiledata[EL].tilecolor);
        }
    }
}

const noIconList = [
    'Biodome Wall',
    'Cropland',
    'Airlock',
    'Lake',
    'Grassland',
    'Gravel Parking Lot',
    'Pond',
    
    'Solid Rock',
    
    'Idyllic Meadow',
    'River',
    
    'Frozen Wastes',
    'Iron Wastes',
    'Frozen River',
    'Blood Waste',
    
    'Stoneland',
    'Dark Ocean',
    
    'Sewer Tunnel',
];

async function loadAllIcons(planes) {
    const iconPromises = [];
    
    for (const plane of Object.values(planes)) {
        iconPromises.push(
            getMapDataURL({}, plane.id)
            .then(TBset => loadTBsetIcons(TBset))
            .catch(e => {
                if (e.name === 'Error' && e.message === '526 ') {
                    console.log(`Cloudflare error 526 while retrieving data for ${planes[plane.id].name}.`);
                } else throw e;
            })
        );
    }
    return Promise.all(iconPromises);
}

async function loadTBsetIcons(TBset) {
    const iconPromises = [];
    
    for (const base of TBset) {
        if (!icons[base] && !noIconList.includes(base)) {
            icons[base] = new Image();
            icons[base].src = `https://github.com/Argavyon/NC-jsMap/raw/main/icons/tiles/${base}.gif`;
            iconPromises.push(
                icons[base].decode()
                .catch(e => {
                    if (e instanceof DOMException) {
                        console.log(`No tile icon found for "${base}"`);
                    } else throw e;
                })
            );
        }
    }
    
    return Promise.all(iconPromises);
}

async function drawIcons(canvas, plane, tiledata, tileinfo, iconsPromise) {
    const drawCtx = canvas.getContext('2d');
    const colorBG = 'dimgray';
    const x0 = plane.x_offset;
    const y0 = plane.y_offset;
    
    const encodeLocation = (x, y) => x + y*72 + plane.id*3600;
    const drawIcon = (x, y, icon) => {
        // console.log(x, y, icon);
        drawCtx.drawImage(icon, (x-x0)*24+5, (y-y0)*24, 18, 18);
    };
    
    await iconsPromise;
    const drawPromises = [];
    for (let x = 1 + x0; x <= plane.columns + x0; x++) {
        for (let y = 1 + y0; y <= plane.rows + y0; y++) {
            if (window.cur_plane != plane.id) return;
            const EL = encodeLocation(x, y);
            if (!tiledata[EL]) continue;
            const base = tiledata[EL].tilebase;
            if (noIconList.includes(base)) continue;
            drawPromises.push(
                icons[base].decode()
                .then(() => {
                    if (window.cur_plane != plane.id) return;
                    drawIcon(x, y, icons[base]);
                })
                .catch(e => {
                    if (e instanceof DOMException) {
                        console.log(`No tile icon found for "${base}"`);
                    } else throw e;
                })
            );
        }
    }
    
    return Promise.all(drawPromises);
}

async function drawPortals(canvas, plane, portals, tileinfo) {
    const drawCtx = canvas.getContext('2d');
    if (!icons.portal) {
        icons.portal = new Image();
        icons.portal.src = 'https://github.com/Argavyon/NC-jsMap/raw/main/icons/modifiers/portal.gif';
        await icons.portal.decode();
    }
    
    const portalColors = {
        'Planar':      'DimGrey',
        'QW':          'SpringGreen',
        'Demon':       'Crimson',
        'Transcended': 'Gold',
        'Angel':       'Cyan',
        'Interplanar': 'RebeccaPurple',
    };
    const portalColor = (portal) => {
        if (!portal.alignment in portalColors) return 'white';
        return portalColors[portal.alignment];
    }
    const drawPortal = (x,y, x0,y0, color) => {
        drawCtx.beginPath();
        
        drawCtx.rect((x-x0)*24+1, (y-y0)*24+1, 21, 21);
        drawCtx.strokeStyle = color;
        drawCtx.lineWidth = 2;
        drawCtx.stroke();
        
        drawCtx.closePath();
    };
    
    const portalIndices = {
        'Planar': 1, 'QW': 2, 'Evil': 3, 'Unaligned': 4, 'Good': 5, 'Interplanar': -6,
    };
    const portalIndex = (portal) => {
        if (!portal.alignment in portalIndices) return 0;
        return portalIndices[portal.alignment];
    }
    portals.sort((a,b) => portalIndex(a) - portalIndex(b));
    for (const portal of portals) {
        const [x0, y0] = [plane.x_offset, plane.y_offset];
        if (!portal.alignment) {
            if (portal.from.plane === portal.to.plane) portal.alignment = 'Planar';
            else if (
                [portal.from.plane, portal.to.plane].includes('Purgatorio') &&
                [portal.from.plane, portal.to.plane].includes('Purgatorio Underground')
            ) portal.alignment = 'Planar';
            else if (
                [portal.from.plane, portal.to.plane].includes('Cordillera') &&
                [portal.from.plane, portal.to.plane].includes('Centrum')
            ) portal.alignment = 'Planar';
            else portal.alignment = 'Interplanar';
        }
        if (portal.from.plane === plane.name) {
            const [x, y] = [portal.from.x, portal.from.y];
            drawPortal(x,y, x0,y0, portalColor(portal));
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.to, from: portal.from})
        }
        if (portal.from.plane === 'PurgatorioUG' && plane.name === 'Purgatorio' && portal.to.plane != 'Purgatorio') {
            const [x, y] = [portal.from.x, portal.from.y];
            drawPortal(x,y, x0,y0, portalColor(portal));
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.to, from: portal.from})
        }
        /*
        if (portal.bidirectional && portal.to.plane === plane.name) {
            const [x, y] = [portal.to.x, portal.to.y];
            drawPortal(x,y, x0,y0, portalColor(portal));
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.from, from: portal.to});
        }
        if (portal.bidirectional && portal.to.plane === 'PurgatorioUG' && plane.name === 'Purgatorio' && portal.from.plane != 'Purgatorio') {
            const [x, y] = [portal.to.x, portal.to.y];
            drawPortal(x,y, x0,y0, portalColor(portal));
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.from, from: portal.to});
        }
        */
    }
}

async function getMapDataURL(tiledata, planeID) {
    const TBset = new Set();
    await d3.csv(
        `https://www.nexusclash.com/js/${planeID}.csv`,
        function (d) {
            tiledata[parseInt(d.coord_enc)] = {
                tilename: d.tilename,
                tilebase: d.tile_base,
                tilecolor: d.tilecolor
            };
            if (!TBset.has(d.tile_base)) {
                TBset.add(d.tile_base);
            }
        }
    );
    return TBset;
}

function updateTooltip(mousemove, planes, tiledata) {
    const X = Math.floor((mousemove.offsetX) / 24) + planes[window.cur_plane].x_offset;
    const Y = Math.floor((mousemove.offsetY) / 24) + planes[window.cur_plane].y_offset;
    // console.log(X, Y, window.cur_plane);
    const tooltip = document.querySelector('div#tooltip');
    const TCS = window.getComputedStyle(tooltip);
    const toolHalfHeight = Math.ceil(parseFloat(TCS['marginTop']) + parseFloat(TCS['marginBottom']) + tooltip.offsetHeight) / 2;
    const loc = X + Y*72 + window.cur_plane*3600;
    // console.log(loc);
    
    const concatNonEmptyWithSpaces = (...strings) => {
        let result = '';
        for (const str of strings) result += (result && str) ? (' ' + str) : str;
        return result;
    }
    
    if (tiledata[loc]) {
        tooltip.innerHTML = '';
        tooltip.style.left = `${Math.floor(mousemove.pageX) + 12}px`;
        tooltip.style.top = `${Math.floor(mousemove.pageY - toolHalfHeight) - 12}px`;
        tooltip.style.display = 'block';
        
        const tile = tiledata[loc];
        const article = (word) => ['a', 'e', 'i', 'o', 'u'].includes(word[0].toLowerCase()) ? 'an' : 'a';
        const descDiv = tooltip.appendChild(document.createElement('div'));
        descDiv.textContent = `(${X}, ${Y}) ${tile.tilename}, ${article(tile.tilebase)} ${tile.tilebase}`;
        
        const tileContentDiv = tooltip.appendChild(document.createElement('div'));
        tileContentDiv.style.marginLeft = '10px';
        
        if (tileinfo[`${X}_${Y}`]) {
            for (const info of tileinfo[`${X}_${Y}`]) {
                const infoDiv = tileContentDiv.appendChild(document.createElement('div'));
                switch (info.type) {
                case 'portal':
                    const fromPlane = (info.from.plane === 'PurgatorioUG') ? '' : `${info.from.plane}`;
                    const toPlane = (info.to.plane === 'PurgatorioUG') ? 'Underground' : `${info.to.plane}`;
                    
                    const fromSide = (info.from.plane === 'PurgatorioUG') ? ((planes[window.cur_plane].name !== 'PurgatorioUG') ? 'Underground' : '') : `${info.from.side}`.toLowerCase();
                    const toSide = (info.to.plane === 'PurgatorioUG') ? '' : `${info.to.side}`.toLowerCase();
                    
                    // infoDiv.textContent = `Portal (${info.from.side}) to ${info.to.plane} ${info.to.x},${info.to.y} (${info.to.side}).`;
                    infoDiv.textContent = concatNonEmptyWithSpaces(fromSide, 'portal', 'to', toPlane, toSide, `${info.to.x},${info.to.y}`);
                    infoDiv.textContent = infoDiv.textContent[0].toUpperCase() + infoDiv.textContent.slice(1);
                    break;
                }
            }
        }
    } else { tooltip.style.display = 'none'; }
}

function main() {
    const canvas = document.querySelector('#canvas');
    const planes = {
        '406': {'name': 'Cordillera',   'id':406, 'rows': 53, 'columns': 71, 'x':1751, 'x_offset':0,  'y':1319, 'y_offset':0},
        '416': {'name': 'Centrum',      'id':416, 'rows': 29, 'columns': 29, 'x':743,  'x_offset':26, 'y':743,  'y_offset':16},
        '405': {'name': 'PurgatorioUG', 'id':405, 'rows': 30, 'columns': 30, 'x':767,  'x_offset':0,  'y':767,  'y_offset':0},
        '404': {'name': 'Purgatorio',   'id':404, 'rows': 30, 'columns': 30, 'x':767,  'x_offset':0,  'y':767,  'y_offset':0},
        '403': {'name': 'Stygia',       'id':403, 'rows': 20, 'columns': 20, 'x':527,  'x_offset':0,  'y':527,  'y_offset':0},
        '402': {'name': 'Elysium',      'id':402, 'rows': 20, 'columns': 20, 'x':527,  'x_offset':0,  'y':527,  'y_offset':0}
	};
    
    window.tiledata = {};
    window.tileinfo = [];
    window.cur_plane = null;
    const iconsPromise = loadAllIcons(planes, tileinfo);
    const portalsPromise = fetch('https://www.nexusclash.com/js/portals.json').then(resp => resp.json());
    window.portals = {};
    document.querySelectorAll('li.nav-item button').forEach(btn => {
		btn.onclick = async function() {
            window.cur_plane = this.value;
            window.tileinfo = {};
            window.tiledata = {};
            drawBaseMap(canvas, planes[window.cur_plane]);
            let TBset = new Set();
            try {
                TBset = await getMapDataURL(tiledata, window.cur_plane);
            } catch (e) {
                if (e.name === 'Error' && e.message === '526 ') {
                    console.log(`Cloudflare error 526 while retrieving data for ${planes[window.cur_plane].name}.`);
                } else throw e;
            }
            // const iconsPromise = loadTBsetIcons(TBset);
            window.portals = await portalsPromise;
            drawMap(canvas, planes[window.cur_plane], tiledata, tileinfo);
            await drawPortals(canvas, planes[window.cur_plane], window.portals, tileinfo);
            await drawIcons(canvas, planes[window.cur_plane], tiledata, tileinfo, iconsPromise);
            await drawPortals(canvas, planes[window.cur_plane], window.portals, {});
        };
        
        canvas.onmousemove = function (e) { updateTooltip(e, planes, tiledata) };
        
        // DownloadCanvasAsImage(canvas);
	});
    document.querySelector('li.nav-item button').click();
}

main();
