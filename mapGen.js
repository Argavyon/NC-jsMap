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

async function drawIcons(canvas, plane, tiledata, tileinfo) {
    const drawCtx = canvas.getContext('2d');
    const colorBG = 'dimgray';
    const x0 = plane.x_offset;
    const y0 = plane.y_offset;
    
    const encodeLocation = (x, y) => x + y*72 + plane.id*3600;
    const drawIcon = (x, y, icon) => {
        // console.log(x, y, icon);
        drawCtx.drawImage(icon, (x-x0)*24+5, (y-y0)*24, 18, 18);
    };
    
    // Draw icons
    for (let x = 1 + x0; x <= plane.columns + x0; x++) {
        for (let y = 1 + y0; y <= plane.rows + y0; y++) {
            if (window.cur_plane != plane.id) return;
            const EL = encodeLocation(x, y);
            if (!tiledata[EL]) continue;
            if (!icons[tiledata[EL].tilebase]) {
                icons[tiledata[EL].tilebase] = new Image();
                icons[tiledata[EL].tilebase].src = `https://github.com/Argavyon/NC-jsMap/raw/main/icons/tiles/${tiledata[EL].tilebase}.gif`;
            }
            try {
                await icons[tiledata[EL].tilebase].decode();
                if (window.cur_plane != plane.id) return;
                drawIcon(x, y, icons[tiledata[EL].tilebase]);
            } catch (e) {
                if (e instanceof DOMException) {
                    console.log(`No tile icon found for "${tiledata[EL].tilebase}"`);
                } else { throw e; }
            }
        }
    }
}

async function drawPortals(canvas, plane, portals, tileinfo) {
    const drawCtx = canvas.getContext('2d');
    if (!icons.portal) {
        icons.portal = new Image();
        icons.portal.src = 'https://github.com/Argavyon/NC-jsMap/raw/main/icons/modifiers/portal.gif';
        await icons.portal.decode();
    }
    
    const drawPortal = (x,y, x0,y0) => {
        // APPROACH 1
        // drawCtx.drawImage(icons.portal, 0, 13, 46, 46, (x-x0)*24, (y-y0)*24, 23, 23);
        
        // APPROACH 2
        drawCtx.beginPath();
        
        drawCtx.rect((x-x0)*24+1, (y-y0)*24+1, 21, 21);
        drawCtx.strokeStyle = 'blue';
        drawCtx.lineWidth = 2;
        drawCtx.stroke();
        
        drawCtx.closePath();
    };
    
    for (const portal of portals) {
        const [x0, y0] = [plane.x_offset, plane.y_offset];
        if (portal.from.plane === plane.name) {
            const [x, y] = [portal.from.x, portal.from.y];
            drawPortal(x,y, x0,y0);
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.to, from: portal.from})
        }
        if (portal.bidirectional && portal.to.plane === plane.name) {
            const [x, y] = [portal.to.x, portal.to.y];
            drawPortal(x,y, x0,y0);
            if (!tileinfo[`${x}_${y}`]) tileinfo[`${x}_${y}`] = [];
            tileinfo[`${x}_${y}`].push({type: 'portal', to: portal.from, from: portal.to});
        }
    }
}

async function getMapDataURL(tiledata, planeID) {
    await d3.csv(
        `https://cors-anywhere.argavyon.workers.dev/?https://www.nexusclash.com/js/${planeID}.csv`,
        function (d) {
            tiledata[parseInt(d.coord_enc)] = {
                tilename: d.tilename,
                tilebase: d.tile_base,
                tilecolor: d.tilecolor
            };
        }
    );
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
    document.querySelectorAll('li.nav-item button').forEach(btn => {
		btn.onclick = async function() {
            window.cur_plane = this.value;
            window.tileinfo = {};
            window.tiledata = {};
            drawBaseMap(canvas, planes[window.cur_plane]);
            await getMapDataURL(tiledata, window.cur_plane);
            drawMap(canvas, planes[window.cur_plane], tiledata, tileinfo);
            await drawPortals(canvas, planes[window.cur_plane], portals, tileinfo);
            await drawIcons(canvas, planes[window.cur_plane], tiledata, tileinfo);
            await drawPortals(canvas, planes[window.cur_plane], portals, {});
        };
        
        // console.log(tiledata);
        canvas.onmousemove = function (e) {
            const X = Math.floor((e.offsetX) / 24) + planes[window.cur_plane].x_offset;
            const Y = Math.floor((e.offsetY) / 24) + planes[window.cur_plane].y_offset;
            // console.log(X, Y, window.cur_plane);
            const tooltip = document.querySelector('div#tooltip');
            const TCS = window.getComputedStyle(tooltip);
            const toolHalfHeight = Math.ceil(parseFloat(TCS['marginTop']) + parseFloat(TCS['marginBottom']) + tooltip.offsetHeight) / 2;
            const loc = X + Y*72 + window.cur_plane*3600;
            // console.log(loc);
            
            if (tiledata[loc]) {
                tooltip.innerHTML = '';
                tooltip.style.left = `${Math.floor(e.pageX) + 12}px`;
                tooltip.style.top = `${Math.floor(e.pageY - toolHalfHeight) - 12}px`;
                tooltip.style.display = 'block';
                
                const tile = tiledata[loc];
                const article = (word) => ['a', 'e', 'i', 'o', 'u'].includes(word[0].toLowerCase()) ? 'an' : 'a';
                const descDiv = tooltip.appendChild(document.createElement('div'));
                descDiv.textContent = `(${X}, ${Y}) ${tile.tilename}, ${article(tile.tilebase)} ${tile.tilebase}`;
                
                if (tileinfo[`${X}_${Y}`]) {
                    for (const info of tileinfo[`${X}_${Y}`]) {
                        const infoDiv = tooltip.appendChild(document.createElement('div'));
                        switch (info.type) {
                        case 'portal':
                            infoDiv.textContent = `Portal (${info.from.side}) to ${info.to.plane} ${info.to.x},${info.to.y} (${info.to.side}).`;
                            break;
                        }
                    }
                }
            } else { tooltip.style.display = 'none'; }
        }
        
        // DownloadCanvasAsImage(canvas);
	});
    document.querySelector('li.nav-item button').click();
}

main();
