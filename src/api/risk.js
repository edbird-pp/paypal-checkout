/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { info } from 'beaver-logger/client';

import { getSessionID } from '../lib';

function collectDeviceData(flowID : string, sessionID : string = getSessionID()) : ZalgoPromise<string> {

    info(`risk_api_collect_device_data`);

    let scriptBaseURL = `https://www.paypalobjects.com/webstatic/r/fb/`;
    let initialScript = document.createElement('script');
    let dom;
    let doc;
    let iframe = document.createElement('iframe');

    // Create script
    initialScript.type = `application/json`;
    initialScript.setAttribute(`fncls`, `fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99`);
    initialScript.innerHTML = `{ "f":"${ sessionID }", "s":"${ flowID }" }`;

    document.body.appendChild(initialScript);

    // Create iFrame
    iframe.src = `about:blank`;
    iframe.title = ``;
    iframe.role = `presentation`; // a11y
    (iframe.frameElement || iframe).style.cssText = `width: 0; height: 0; border: 0`;

    document.body.insertBefore(iframe, initialScript);

    try {
        doc = iframe.contentWindow.document;
    } catch (err) {
        dom = document.domain;
        iframe.src = `javascript:var d=document.open();d.domain=${ dom };void(0);`;
        doc = iframe.contentWindow.document;
    }
    let load = function () {
        let js = this.createElement('script');
        if (dom) {
            this.domain = dom;
        }
        js.id = `js-iframe-async`;
        js.src = `${ scriptBaseURL }fb-all-prod.pp.min.js`;
        this.body.appendChild(js);
    };
    doc.open()._l = load;
    doc.write(`<body onload="document._l();">`);
    doc.close();

    return sessionID;
}

export let risk = {
    collect: collectDeviceData
};
