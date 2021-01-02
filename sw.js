/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-d8f3a20c2f278974a57a.js"
  },
  {
    "url": "styles.875516c8a52afcaea49b.css"
  },
  {
    "url": "styles-407fe62976dc5310c43e.js"
  },
  {
    "url": "framework-acd7498685eeb36e39da.js"
  },
  {
    "url": "app-12b30deebfc2b9249bf4.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "76edd97ff45ecec945a933b529e36444"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-ad6431e4664bcf916d19.js"
  },
  {
    "url": "polyfill-b1e8269bf7d82e5fa523.js"
  },
  {
    "url": "3d5d71b6bca5d711284e8e863c4e9dd833428f91-24c0bc96452e892252ca.js"
  },
  {
    "url": "819fab4f94018bf5237f3d0109f94079746111e5-830bfd741cd408a2c577.js"
  },
  {
    "url": "component---src-pages-posts-jsx-a8251e4330a3791d40ec.js"
  },
  {
    "url": "page-data/posts/page-data.json",
    "revision": "86b2a4f7995dc01f2481747bd3bf7ffd"
  },
  {
    "url": "page-data/sq/d/35275500.json",
    "revision": "7c1ba749e4bc4739e32fd86371a9fead"
  },
  {
    "url": "page-data/sq/d/3649515864.json",
    "revision": "14a6b7d4f6fbda921d6db1893b682ea7"
  },
  {
    "url": "page-data/sq/d/63159454.json",
    "revision": "068db49a047e48200c240251da2160f0"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "31fe4ecc0e3ade0d82e2f2348b12cd37"
  },
  {
    "url": "component---src-pages-about-me-jsx-f7d5195538beb2570426.js"
  },
  {
    "url": "page-data/about-me/page-data.json",
    "revision": "c7315b13fb50d8cf22d1442b40cb27fd"
  },
  {
    "url": "component---src-pages-friends-jsx-e74f411f958b18a3114d.js"
  },
  {
    "url": "page-data/friends/page-data.json",
    "revision": "7cb8514e90f1c5c435539cd19cb78022"
  },
  {
    "url": "page-data/sq/d/3369934648.json",
    "revision": "c5c3a196fc97a9276f009f36f7a96abe"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "d96eb3322372bb2ff9093806c3745dcd"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-12b30deebfc2b9249bf4.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
