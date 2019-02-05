import { Evalable } from 'puppeteer';

export const pauseFor = (timeout: number): Promise<void> => new Promise(resolve => setTimeout(resolve, timeout));
export const getElementText = async (selector: string, parent: Evalable = page) => await parent.$eval(`${selector}`, (el: HTMLElement) => el.innerHTML);

export async function waitUntil(predicate: () => Promise<boolean>, timeout: number = 10_000, interval: number = 250): Promise<void> {
    const endTime = Date.now() + timeout;
    while (endTime > Date.now()) {
        if (await predicate()) {
            return;
        }

        await pauseFor(interval);
    }

    throw new Error('waitUtil reached timeout');
}