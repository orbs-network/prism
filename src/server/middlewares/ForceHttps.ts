export function forceHttps(req, res, next) {
  const isNotSecure =
    (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
    (parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
      parseInt(req.get('x-forwarded-port'), 10) === parseInt(req.get('x-forwarded-port'), 10));

  if (isNotSecure) {
    return res.redirect(302, 'https://' + req.get('host') + req.url);
  }

  next();
}
