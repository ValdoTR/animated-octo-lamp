/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

console.log('Script started successfully');

let currentZone: string;
let currentPopup: any;

const config = [
    {
        zone: 'needHelp',
        message: 'Do you need some guidance? We are happy to help you out.',
        cta: [
            {
                label: 'Meet us',
                className: 'primary',
                callback: () => WA.nav.openTab('https://play.staging.workadventu.re/@/tcm/workadventure/wa-village'),
            }
        ]
    },
    {
        zone: 'followUs',
        message: 'Hey! Have you already started following us?',
        cta: [
            {
                label: 'LinkedIn',
                className: 'primary',
                callback: () => WA.nav.openTab('https://www.linkedin.com/company/workadventu-re'),
            },
            {
                label: 'Twitter',
                className: 'primary',
                callback: () => WA.nav.openTab('https://twitter.com/workadventure_'),
            }
        ]
    },
]


WA.onEnterZone('needHelp', () => {
    currentZone = 'needHelp'
    openPopup(currentZone, currentZone + 'Popup')
});
WA.onEnterZone('followUs', () => {
    currentZone = 'followUs'
    openPopup(currentZone, currentZone + 'Popup')
});
WA.onLeaveZone('needHelp', closePopup);
WA.onLeaveZone('followUs', closePopup);

WA.room.onEnterLayer('exitWest').subscribe(() => {
    currentZone = 'exitWest'
    const isDoorConfigured = WA.state.loadVariable(currentZone + 'URL')
    if (isDoorConfigured) return;
    openExitPopup()
})
WA.room.onLeaveLayer('exitWest').subscribe(closePopup)

WA.room.onEnterLayer('exitSouth').subscribe(() => {
    currentZone = 'exitSouth'
    const isDoorConfigured = WA.state.loadVariable(currentZone + 'URL')
    if (isDoorConfigured) return;
    openExitPopup()
})
WA.room.onLeaveLayer('exitSouth').subscribe(closePopup)

// Popup management functions
function openExitPopup(): void {
    const popupName = currentZone + 'Popup'
    const variableName = currentZone + 'URL'

    let cta = []
    if (WA.player.tags.includes('editor')) {
        cta.push({
            label: 'Configure',
            className: 'primary',
            callback: () => WA.nav.openCoWebSite('https://workadventu.re')
        })
    }
    // TODO: add WA.nav.openConfig(variableName)

    // @ts-ignore otherwise we can't assign cta variable
    currentPopup = WA.ui.openPopup(popupName, 'This exit is not configured yet.', cta)
}

function openPopup(zoneName: string, popupName: string) {
    const zone = config.find((item) => {
        return item.zone == zoneName
    });
    if (typeof zone !== 'undefined') {
        // @ts-ignore otherwise we can't use zone.cta object
        currentPopup = WA.openPopup(popupName, zone.message, zone.cta)
    }
}
function closePopup(){
    if (typeof currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}