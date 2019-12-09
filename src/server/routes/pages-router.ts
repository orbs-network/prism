import { Router } from 'express';
import * as config from '../config';
import { getManifest } from './manifest-manager';

export function pagesRouter() {
  const router = Router({ mergeParams: true });

  router.get(`/vchains/:vchainId*`, async (req, res) => {
    const vchainId = Number(req.params.vchainId);
    if (vchainId === config.ORBS_VIRTUAL_CHAIN_ID) {
      const manifest = await getManifest();
      res.render('page.ejs', { manifest, vchainId, prismVersion: `v${config.PRISM_VERSION}` });
    } else {
      res.render('vchain-404.ejs', { vchainId });
    }
  });

  router.use('/**', (_, res) => res.redirect(`/vchains/${config.ORBS_VIRTUAL_CHAIN_ID}`));

  return router;
}
