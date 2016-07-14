#! /usr/bin/env node

const Rx = require('rxjs');
const cp = require('child_process');
const got = require('got');
const os = require('os');
const fs = require('fs');
const gi = require('./lib/gi');
const pg = require('./lib/pg');
const awe = require('./lib/awe');

const gi$ = Rx.Observable.fromPromise(got(gi.url));
const pg$ = Rx.Observable.fromPromise(got(pg.url));
const awe$ = Rx.Observable.fromPromise(got(awe.url));
const all$ = Rx.Observable.zip(gi$, pg$, awe$, (resGi, resPg, resAwe) => {
  return [
    gi.parse(resGi),
    pg.parse(resPg),
    awe.parse(resAwe),
  ];
});

all$.subscribe(
  x => {
    const result = JSON.stringify({
      gi: x[0],
      pg: x[1],
      awe: x[2],
    });

    const all = cp.spawnSync('firebase', ['database:get', '/'], {
      encoding: 'utf8',
    });
    fs.writeFileSync('all.json', all.stdout);

    cp.spawnSync('firebase', ['database:set', '-y', '/'], {
      input: result,
      encoding: 'utf8',
    });
    console.log('done');
  },
  e => {
    console.log(e);
  }
);

